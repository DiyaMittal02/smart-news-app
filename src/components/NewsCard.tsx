'use client';

import { motion } from 'framer-motion';
import { NewsItem } from '@/lib/types';
import { ExternalLink, Clock, User } from 'lucide-react';

interface NewsCardProps {
    news: NewsItem;
    onClick: (news: NewsItem) => void;
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
    return (
        <motion.div
            layoutId={`card-${news.id}`}
            className="news-card"
            onClick={() => onClick(news)}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="card-image-container">
                <motion.img
                    layoutId={`image-${news.id}`}
                    src={news.image}
                    alt={news.title}
                    className="card-image"
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                        {news.category}
                    </span>
                </div>
            </div>

            <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#8b949e' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} /> {news.source}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {news.timestamp}
                    </span>
                </div>

                <motion.h3
                    layoutId={`title-${news.id}`}
                    className="card-title"
                >
                    {news.title}
                </motion.h3>

                <p style={{ fontSize: '0.9rem', color: '#8b949e', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.summary}
                </p>

                <div className="card-meta">
                    <span className={`sentiment-indicator ${news.sentiment}`}>
                        <span className="dot" />
                        {news.sentiment}
                    </span>
                    <ExternalLink size={16} color="#8b949e" />
                </div>
            </div>
        </motion.div>
    );
}
