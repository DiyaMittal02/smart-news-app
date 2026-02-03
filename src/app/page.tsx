import { fetchLiveNews } from '@/lib/news-service';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: { region?: string; lang?: string; category?: string };
}) {
  const params = await searchParams;
  const region = params?.region || 'global';
  const lang = params?.lang || 'en';
  const category = params?.category || 'all';

  const liveNews = await fetchLiveNews(region, lang, category);

  return (
    <HomeClient
      liveNews={liveNews}
      currentRegion={region}
      currentLang={lang}
      currentCategory={category}
    />
  );
}
