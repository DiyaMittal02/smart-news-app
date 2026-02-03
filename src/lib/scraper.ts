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
        const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        clearTimeout(timeout);

        const html = await response.text();
        const doc = new JSDOM(html, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (!article) return null;

        let content = article.textContent || '';
        let title = article.title || '';

        // Translate if needed
        if (targetLang !== 'en' && ISO_CODES[targetLang]) {
            try {
                // Translate chunks to avoid API limits (naive chunking)
                const chunks = content.match(/[\s\S]{1,2000}/g) || [content];
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

                // Translate Title
                if (title) {
                    const resTitle = await translate(title, { to: ISO_CODES[targetLang] });
                    title = (resTitle as any).text || title;
                }

            } catch (e) {
                console.error("Article Translation Failed", e);
            }
        }

        return { content, title, html: article.content || '' };
    } catch (error) {
        console.error('Failed to scrape article:', error);
        return null;
    }
}
