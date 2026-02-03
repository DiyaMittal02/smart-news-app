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
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                background: '#161b22',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid #30363d',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <motion.img
                    layoutId={`image-${news.id}`}
                    src={news.image}
                    alt={news.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                        {news.category}
                    </span>
                </div>
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                    style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.4', marginBottom: '0.75rem', color: '#e6edf3', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                    {news.title}
                </motion.h3>

                <p style={{ fontSize: '0.9rem', color: '#8b949e', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.summary}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
