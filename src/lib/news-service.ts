import Parser from 'rss-parser';
import { NewsItem } from './types';
import translate from 'google-translate-api-x';

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['media:content', 'mediaContent'],
            ['enclosure', 'enclosure'],
            ['media:thumbnail', 'thumbnail'],
            ['image', 'image']
        ]
    }
});

// Helper for timeout
const timeoutPromise = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

// --- 1. ENGLISH / GLOBAL FEEDS (Default) ---
const ENGLISH_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [
        { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC' },
        { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', source: 'TOI' },
        { url: 'https://www.ndtv.com/rss/top-stories', source: 'NDTV' },
        { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NYT' }
    ],
    business: [
        { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Biz' },
        { url: 'https://economictimes.indiatimes.com/rssfeedsdefault.cms', source: 'Economic Times' },
        { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', source: 'CNBC' }
    ],
    tech: [
        { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC Tech' },
        { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
        { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' }
    ],
    sports: [
        { url: 'http://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport' },
        { url: 'https://www.espn.com/espn/rss/news', source: 'ESPN' },
        { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports' }
    ],
    entertainment: [
        { url: 'https://www.hollywoodreporter.com/feed/', source: 'Hollywood Reporter' },
        { url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', source: 'E! Online' }
    ],
    science: [
        { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', source: 'BBC Science' },
        { url: 'https://www.sciencedaily.com/rss/top_news.xml', source: 'ScienceDaily' }
    ],
    health: [
        { url: 'http://feeds.bbci.co.uk/news/health/rss.xml', source: 'BBC Health' },
        { url: 'https://www.healthline.com/feed', source: 'Healthline' }
    ]
};

// --- 2. HINDI FEEDS (Native Support) ---
const HINDI_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [
        { url: 'https://feeds.bbci.co.uk/hindi/rss.xml', source: 'BBC Hindi' },
        { url: 'https://khabar.ndtv.com/rss/top-stories', source: 'NDTV India' },
        { url: 'https://www.aajtak.in/rss/top-stories', source: 'Aaj Tak' },
        { url: 'https://www.jagran.com/rss/news-national-hindi.xml', source: 'Dainik Jagran' }
    ],
    business: [
        { url: 'https://www.aajtak.in/rss/business', source: 'Aaj Tak Biz' },
        { url: 'https://www.jagran.com/rss/business-hindi.xml', source: 'Jagran Biz' },
        { url: 'https://zeenews.india.com/hindi/rss/business.xml', source: 'Zee Biz' }
    ],
    tech: [
        { url: 'https://www.aajtak.in/rss/tech', source: 'Aaj Tak Tech' },
        { url: 'https://www.jagran.com/rss/technology-hindi.xml', source: 'Jagran Tech' },
        { url: 'https://gadgets360.com/rss/hindi/news', source: 'Gadgets360' }
    ],
    sports: [
        { url: 'https://www.aajtak.in/rss/sports', source: 'Aaj Tak Sports' },
        { url: 'https://www.jagran.com/rss/cricket-hindi.xml', source: 'Jagran Cricket' },
        { url: 'https://zeenews.india.com/hindi/rss/sports-news.xml', source: 'Zee Sports' }
    ],
    entertainment: [
        { url: 'https://www.aajtak.in/rss/movie-masala', source: 'Aaj Tak Ent' },
        { url: 'https://www.jagran.com/rss/entertainment-hindi.xml', source: 'Jagran Ent' }
    ],
    science: [
        { url: 'https://www.jagran.com/rss/technology-hindi.xml', source: 'Jagran Tech/Sci' }, // Often combined
        { url: 'https://feeds.bbci.co.uk/hindi/rss.xml', source: 'BBC Hindi' }
    ],
    health: [
        { url: 'https://www.jagran.com/rss/lifestyle-health-hindi.xml', source: 'Jagran Health' },
        { url: 'https://www.livehindustan.com/rss/lifestyle/health', source: 'Live Hindustan' }
    ]
};

// --- 3. REGIONAL INDIAN LANGUAGES (Native Support) ---

const TAMIL_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://tamil.oneindia.com/rss/tamil-news-fb.xml', source: 'OneIndia Tamil' }, { url: 'https://feeds.bbci.co.uk/tamil/rss.xml', source: 'BBC Tamil' }],
    business: [{ url: 'https://tamil.goodreturns.in/rss/tamil-business-fb.xml', source: 'GoodReturns Tamil' }],
    sports: [{ url: 'https://tamil.mykhel.com/rss/tamil-sports-fb.xml', source: 'MyKhel Tamil' }],
    entertainment: [{ url: 'https://tamil.filmibeat.com/rss/tamil-filmibeat-fb.xml', source: 'Filmibeat Tamil' }],
    tech: [{ url: 'https://tamil.gizbot.com/rss/tamil-gizbot-fb.xml', source: 'Gizbot Tamil' }]
};

const TELUGU_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://telugu.oneindia.com/rss/telugu-news-fb.xml', source: 'OneIndia Telugu' }, { url: 'https://feeds.bbci.co.uk/telugu/rss.xml', source: 'BBC Telugu' }],
    business: [{ url: 'https://telugu.goodreturns.in/rss/telugu-business-fb.xml', source: 'GoodReturns Telugu' }],
    sports: [{ url: 'https://telugu.mykhel.com/rss/telugu-sports-fb.xml', source: 'MyKhel Telugu' }],
    entertainment: [{ url: 'https://telugu.filmibeat.com/rss/telugu-filmibeat-fb.xml', source: 'Filmibeat Telugu' }],
    tech: [{ url: 'https://telugu.gizbot.com/rss/telugu-gizbot-fb.xml', source: 'Gizbot Telugu' }]
};

const KANNADA_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://kannada.oneindia.com/rss/kannada-news-fb.xml', source: 'OneIndia Kannada' }],
    business: [{ url: 'https://kannada.goodreturns.in/rss/kannada-business-fb.xml', source: 'GoodReturns Kannada' }],
    sports: [{ url: 'https://kannada.mykhel.com/rss/kannada-sports-fb.xml', source: 'MyKhel Kannada' }],
    entertainment: [{ url: 'https://kannada.filmibeat.com/rss/kannada-filmibeat-fb.xml', source: 'Filmibeat Kannada' }],
    tech: [{ url: 'https://kannada.gizbot.com/rss/kannada-gizbot-fb.xml', source: 'Gizbot Kannada' }]
};

const MALAYALAM_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://malayalam.oneindia.com/rss/malayalam-news-fb.xml', source: 'OneIndia Malayalam' }],
    business: [{ url: 'https://malayalam.goodreturns.in/rss/malayalam-business-fb.xml', source: 'GoodReturns Malayalam' }],
    sports: [{ url: 'https://malayalam.mykhel.com/rss/malayalam-sports-fb.xml', source: 'MyKhel Malayalam' }],
    entertainment: [{ url: 'https://malayalam.filmibeat.com/rss/malayalam-filmibeat-fb.xml', source: 'Filmibeat Malayalam' }],
    tech: [{ url: 'https://malayalam.gizbot.com/rss/malayalam-gizbot-fb.xml', source: 'Gizbot Malayalam' }]
};

const BENGALI_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://bengali.oneindia.com/rss/bengali-news-fb.xml', source: 'OneIndia Bengali' }, { url: 'https://feeds.bbci.co.uk/bengali/rss.xml', source: 'BBC Bengali' }],
    sports: [{ url: 'https://bengali.mykhel.com/rss/bengali-sports-fb.xml', source: 'MyKhel Bengali' }]
};

const MARATHI_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://marathi.oneindia.com/rss/marathi-news-fb.xml', source: 'OneIndia Marathi' }, { url: 'https://feeds.bbci.co.uk/marathi/rss.xml', source: 'BBC Marathi' }],
    sports: [{ url: 'https://marathi.mykhel.com/rss/marathi-sports-fb.xml', source: 'MyKhel Marathi' }]
};

const GUJARATI_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://gujarati.oneindia.com/rss/gujarati-news-fb.xml', source: 'OneIndia Gujarati' }, { url: 'https://feeds.bbci.co.uk/gujarati/rss.xml', source: 'BBC Gujarati' }],
    business: [{ url: 'https://gujarati.goodreturns.in/rss/gujarati-business-fb.xml', source: 'GoodReturns Gujarati' }]
};

const PUNJABI_FEEDS: Record<string, { url: string; source: string }[]> = {
    all: [{ url: 'https://feeds.bbci.co.uk/punjabi/rss.xml', source: 'BBC Punjabi' }]
};


// Map UI language codes to Google Translate codes (Fallback)
const ISO_CODES: Record<string, string> = {
    'en': 'en', 'hi': 'hi', 'ta': 'ta', 'te': 'te', 'bn': 'bn',
    'mr': 'mr', 'gu': 'gu', 'kn': 'kn', 'ml': 'ml', 'pa': 'pa', 'es': 'es'
};

export async function fetchLiveNews(
    region: string = 'global',
    targetLang: string = 'en',
    category: string = 'all'
): Promise<NewsItem[]> {

    const allNews: NewsItem[] = [];
    const catKey = category.toLowerCase();

    // 1. SELECT FEEDS BASED ON LANGUAGE
    // Default to English
    let targetFeeds = ENGLISH_FEEDS[catKey] || ENGLISH_FEEDS['all'];
    let needsTranslation = false;

    // NATIVE FEED SELECTION LOGIC
    if (targetLang === 'hi') {
        targetFeeds = HINDI_FEEDS[catKey] || HINDI_FEEDS['all'];
    } else if (targetLang === 'ta') {
        targetFeeds = TAMIL_FEEDS[catKey] || TAMIL_FEEDS['all'];
    } else if (targetLang === 'te') {
        targetFeeds = TELUGU_FEEDS[catKey] || TELUGU_FEEDS['all'];
    } else if (targetLang === 'kn') {
        targetFeeds = KANNADA_FEEDS[catKey] || KANNADA_FEEDS['all'];
    } else if (targetLang === 'ml') {
        targetFeeds = MALAYALAM_FEEDS[catKey] || MALAYALAM_FEEDS['all'];
    } else if (targetLang === 'bn') {
        targetFeeds = BENGALI_FEEDS[catKey] || BENGALI_FEEDS['all'];
    } else if (targetLang === 'mr') {
        targetFeeds = MARATHI_FEEDS[catKey] || MARATHI_FEEDS['all'];
    } else if (targetLang === 'gu') {
        targetFeeds = GUJARATI_FEEDS[catKey] || GUJARATI_FEEDS['all'];
    } else if (targetLang === 'pa') {
        targetFeeds = PUNJABI_FEEDS[catKey] || PUNJABI_FEEDS['all'];
    } else if (targetLang !== 'en') {
        // If no native feed exists (e.g. Spanish 'es'), fall back to English + Translate
        needsTranslation = true;
    }

    // 2. FETCH RSS
    const results = await Promise.allSettled(
        targetFeeds.map(async (feed) => {
            try {
                const feedData: any = await Promise.race([
                    parser.parseURL(feed.url),
                    timeoutPromise(4000) // 4s timeout
                ]);

                return feedData.items.slice(0, 15).map((item: any) => {
                    // Extract Image
                    let imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000";

                    if (item.enclosure?.url) imageUrl = item.enclosure.url;
                    else if (item['media:content']?.$?.url) imageUrl = item['media:content'].$.url;
                    else if (item['media:content']?.url) imageUrl = item['media:content'].url;
                    else if (item.content?.match(/src="([^"]+)"/)) imageUrl = item.content.match(/src="([^"]+)"/)[1];
                    else if (item['thumbnail']?.$?.url) imageUrl = item['thumbnail'].$.url;

                    // Parse Date
                    const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
                    const now = new Date();
                    const diffMs = now.getTime() - pubDate.getTime();
                    const diffHours = diffMs / (1000 * 60 * 60);

                    // Skip old news (> 24h)
                    if (diffHours > 36) return null;

                    // Sentiment
                    const title = (item.title || '').toLowerCase();
                    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
                    if (title.includes('dead') || title.includes('kill') || title.includes('crash') || title.includes('war')) sentiment = 'negative';
                    if (title.includes('win') || title.includes('success') || title.includes('record') || title.includes('launch')) sentiment = 'positive';

                    return {
                        id: item.guid || item.link || Math.random().toString(),
                        title: item.title,
                        summary: (item.contentEncoded || item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').substring(0, 800),
                        image: imageUrl,
                        videoUrl: item.enclosure?.type?.includes('video') ? item.enclosure.url : undefined,
                        category: category === 'all' ? 'Top Story' : category.charAt(0).toUpperCase() + category.slice(1),
                        source: feed.source,
                        timestamp: diffHours < 1 ? 'Just now' : `${Math.floor(diffHours)}h ago`,
                        sentiment,
                        bias: 'center',
                        link: item.link
                    } as NewsItem;
                }).filter((item: any) => item !== null);
            } catch (e) { return []; }
        })
    );

    // Flatten
    results.forEach(r => { if (r.status === 'fulfilled') allNews.push(...r.value); });

    // --- FALLBACK: If specific category failed (0 items), fetch Top Stories instead ---
    if (allNews.length === 0 && catKey !== 'all') {
        const fallbackFeeds = targetLang === 'hi' ? HINDI_FEEDS['all'] : ENGLISH_FEEDS['all'];
        const fallbackResults = await Promise.allSettled(
            fallbackFeeds.map(async (feed) => {
                try {
                    const feedData: any = await parser.parseURL(feed.url);
                    return feedData.items.map((item: any) => ({
                        id: item.guid || item.link || Math.random().toString(),
                        title: item.title,
                        summary: (item.contentSnippet || item.content || '').substring(0, 200).replace(/<[^>]*>?/gm, ''),
                        image: item.enclosure?.url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000",
                        category: 'Top Story (Fallback)',
                        source: feed.source,
                        timestamp: 'Just now',
                        sentiment: 'neutral',
                        link: item.link
                    } as NewsItem));
                } catch (e) { return []; }
            })
        );
        fallbackResults.forEach(r => { if (r.status === 'fulfilled') allNews.push(...r.value); });
    }

    // 3. TRANSLATE (Only if Native Feed unavailable)
    if (needsTranslation && ISO_CODES[targetLang]) {
        const translateItem = async (newsItem: NewsItem) => {
            try {
                // Heuristic: Translate shorter text to save time/bandwidth
                const [titleRes, summaryRes] = await Promise.all([
                    translate(newsItem.title, { to: ISO_CODES[targetLang] }).catch(() => ({ text: newsItem.title })),
                    translate(newsItem.summary.substring(0, 120), { to: ISO_CODES[targetLang] }).catch(() => ({ text: newsItem.summary }))
                ]);
                newsItem.title = (titleRes as any).text || newsItem.title;
                newsItem.summary = (summaryRes as any).text || newsItem.summary;
            } catch (err) { /* Ignore */ }
        };

        // Parallelize
        await Promise.allSettled(allNews.slice(0, 10).map(translateItem)); // Limit to top 10 for speed
    }

    return allNews.sort(() => Math.random() - 0.5);
}
