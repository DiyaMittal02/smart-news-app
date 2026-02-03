export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  source: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  bias?: 'left' | 'right' | 'center';
  link?: string;
  videoUrl?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}

export interface ScrapedArticle {
  content: string | null;
  html: string | null;
  title?: string | null;
  error?: string;
}
