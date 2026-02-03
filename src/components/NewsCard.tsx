'use client';

import { motion } from 'framer-motion';
import { NewsItem } from '@/lib/types';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsCardProps {
    news: NewsItem;
    onClick: (news: NewsItem) => void;
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
    const getSentimentIcon = () => {
        switch (news.sentiment) {
            case 'positive': return <TrendingUp size={12} />;
            case 'negative': return <TrendingDown size={12} />;
            default: return <Minus size={12} />;
        }
    };

    return (
        <motion.article
            className="news-card"
            onClick={() => onClick(news)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image */}
            <div className="card-image-container">
                <img
                    src={news.image}
                    alt={news.title}
                    className="card-image"
                    loading="lazy"
                />
                <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                    {news.category}
                </div>
            </div>

            {/* Content */}
            <div className="card-content">
                {/* Source & Time */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                    fontSize: '0.75rem',
                    color: '#a1a1aa'
                }}>
                    <span style={{ fontWeight: 600, color: '#d4d4d8' }}>{news.source}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        {news.timestamp}
                    </span>
                </div>

                {/* Title */}
                <h3 className="card-title">{news.title}</h3>

                {/* Summary Preview */}
                <p style={{
                    fontSize: '0.85rem',
                    color: '#71717a',
                    lineHeight: 1.5,
                    marginBottom: 16,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {news.summary}
                </p>

                {/* Footer */}
                <div className="card-meta">
                    <span className={`sentiment-indicator ${news.sentiment}`}>
                        {getSentimentIcon()}
                        {news.sentiment}
                    </span>
                    <span style={{
                        fontSize: '0.7rem',
                        color: '#52525b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Tap to read
                    </span>
                </div>
            </div>
        </motion.article>
    );
}
