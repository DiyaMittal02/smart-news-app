import { fetchLiveNews } from '@/lib/news-service';
import NewsReelsClient from '@/components/NewsReelsClient';

export const dynamic = 'force-dynamic';

export default async function ReelsPage({
    searchParams,
}: {
    searchParams: { region?: string; lang?: string; category?: string };
}) {
    const params = await searchParams;
    const region = params?.region || 'global';
    const lang = params?.lang || 'en';
    const category = params?.category || 'all';

    // Fetch news based on category selection
    const liveNews = await fetchLiveNews(region, lang, category);

    return (
        <NewsReelsClient
            initialNews={liveNews}
            currentLang={lang}
            currentCategory={category}
        />
    );
}
