'use server';

import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import translate from 'google-translate-api-x';

const ISO_CODES: Record<string, string> = {
    'en': 'en', 'hi': 'hi', 'ta': 'ta', 'te': 'te', 'bn': 'bn',
    'mr': 'mr', 'gu': 'gu', 'kn': 'kn', 'ml': 'ml', 'pa': 'pa', 'es': 'es'
};

export async function getFullArticle(url: string, targetLang: string = 'en') {
    if (!url) return null;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // Increased timeout to 8s

        // 1. Fetch with Real Browser Headers
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            }
        });

        clearTimeout(timeout);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();

        // 2. Parse HTML
        const doc = new JSDOM(html, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        // 3. Validation & Block Detection
        if (!article || !article.content) {
            return null;
        }

        const textContent = article.textContent || '';

        if (article.content.length < 200 || textContent.length < 100) {
            console.warn("Scraper: Content too short or empty. Likely blocked.");
            return null;
        }

        const lowerText = textContent.toLowerCase();
        const blockedKeywords = [
            'enable javascript', 'disable ad blocker', 'access denied',
            'captcha', 'security check', 'robot', 'click here to continue',
            'browser is not supported', 'please wait'
        ];

        if (blockedKeywords.some(kw => lowerText.includes(kw) && lowerText.length < 500)) {
            console.warn("Scraper: Detected anti-bot/block page.");
            return null;
        }

        let content = article.content || '';
        let title = article.title || '';

        // 4. Translate (Optional)
        if (targetLang !== 'en' && ISO_CODES[targetLang]) {
            try {
                const chunks = textContent.match(/[\s\S]{1,2000}/g) || [textContent];
                const translatedChunks = await Promise.all(
                    chunks.map(async (chunk) => {
                        if (!chunk) return '';
                        try {
                            const res = await translate(chunk, { to: ISO_CODES[targetLang] });
                            return (res as any).text || chunk;
                        } catch (e) { return chunk; }
                    })
                );
                content = translatedChunks.join(' ');

                if (title) {
                    const resTitle = await translate(title, { to: ISO_CODES[targetLang] });
                    title = (resTitle as any).text || title;
                }
            } catch (e) {
                console.error("Article Translation Failed", e);
            }
        }

        return { content: article.content, title, textContent: content };
    } catch (error) {
        console.error('Failed to scrape article:', error);
        return null;
    }
}
