'use client';

import { motion } from 'framer-motion';
import { NewsItem } from '@/lib/types';
import { ArrowRight, Clock } from 'lucide-react';

interface NewsCardProps {
    news: NewsItem;
    onClick: (news: NewsItem) => void;
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
    return (
        <motion.div
            layoutId={`card-${news.id}`}
            className="news-card group"
            onClick={() => onClick(news)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-image-container">
                <motion.img
                    layoutId={`image-${news.id}`}
                    src={news.image}
                    alt={news.title}
                    className="card-image"
                />
                <div className="card-overlay" />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                    <span className="badge badge-neutral" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                        {news.category}
                    </span>
                </div>
            </div>

            <div className="card-content">
                <div className="card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {news.timestamp}
                    </span>
                    <span className={`badge badge-${news.sentiment || 'neutral'}`}>
                        {news.sentiment}
                    </span>
                </div>

                <motion.h3 layoutId={`title-${news.id}`} className="card-title">
                    {news.title}
                </motion.h3>

                <div className="read-more-link">
                    Read Story <ArrowRight size={16} className="arrow-icon" />
                </div>
            </div>
        </motion.div>
    );
}
