'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem, ScrapedArticle } from '@/lib/types';
import NewsCard from './NewsCard';
import {
    X, Search, RefreshCw, FileText, ExternalLink, Play, Square, ArrowLeft
} from 'lucide-react';
import { getFullArticle } from '@/lib/scraper';
import { useSpeech } from '@/hooks/use-speech';

interface NewsGridProps {
    initialNews: NewsItem[];
    currentLang?: string;
}

export default function NewsGrid({ initialNews = [], currentLang = 'en' }: NewsGridProps) {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [activeTab, setActiveTab] = useState<'story' | 'reader' | 'context'>('story');
    const [search, setSearch] = useState('');
    const [news, setNews] = useState<NewsItem[]>(initialNews);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [articleContent, setArticleContent] = useState<ScrapedArticle | null>(null);
    const [loadingArticle, setLoadingArticle] = useState(false);

    const { speak, stop, isPlaying, isSupported } = useSpeech();
    const router = useRouter();

    useEffect(() => {
        setNews(initialNews);
    }, [initialNews]);

    const handleCardClick = (n: NewsItem) => {
        setSelectedNews(n);
        setActiveTab('story');
        setArticleContent(null);
        stop();
    };

    const closeModal = () => {
        setSelectedNews(null);
        stop();
    };

    useEffect(() => {
        if (!selectedNews) stop();
    }, [selectedNews, stop]);

    // Fetch Full Article when switching to "Reader" tab
    useEffect(() => {
        if (activeTab === 'reader' && selectedNews && !articleContent && selectedNews.link) {
            setLoadingArticle(true);
            getFullArticle(selectedNews.link, currentLang)
                .then(data => {
                    setArticleContent(data);
                    setLoadingArticle(false);
                })
                .catch(() => setLoadingArticle(false));
        }
    }, [activeTab, selectedNews, articleContent, currentLang]);

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase())
    );

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
        <div className="nexus-container">
            {/* Search & Refresh Toolbar */}
            <div className="toolbar">
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search stories..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className={`refresh-btn ${isRefreshing ? 'spin' : ''}`} onClick={handleRefresh}>
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Grid Layout */}
            <div className="news-grid">
                {filteredNews.map((item) => (
                    <NewsCard
                        key={item.id}
                        news={item}
                        onClick={handleCardClick}
                    />
                ))}
            </div>

            {/* MOBILE-OPTIMIZED FULL SCREEN MODAL */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div
                        className="news-detail-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="news-detail-sheet"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            {/* Header with Back Button */}
                            <div className="detail-header">
                                <button className="back-btn" onClick={closeModal}>
                                    <ArrowLeft size={20} />
                                    <span>Back</span>
                                </button>
                                <div className="header-actions">
                                    {selectedNews.link && (
                                        <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" className="external-link-btn">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="detail-content">
                                {/* Hero Image */}
                                <div className="detail-hero">
                                    <img src={selectedNews.image} alt={selectedNews.title} />
                                    <div className="hero-gradient" />
                                </div>

                                {/* Article Info */}
                                <div className="detail-info">
                                    <div className="detail-meta">
                                        <span className="source-badge">{selectedNews.source}</span>
                                        <span className="timestamp">{selectedNews.timestamp}</span>
                                    </div>
                                    <h1 className="detail-title">{selectedNews.title}</h1>
                                </div>

                                {/* Tab Navigation */}
                                <div className="detail-tabs">
                                    <button
                                        className={`detail-tab ${activeTab === 'story' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('story')}
                                    >
                                        Summary
                                    </button>
                                    <button
                                        className={`detail-tab ${activeTab === 'reader' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('reader')}
                                    >
                                        Full Article
                                    </button>
                                    <button
                                        className={`detail-tab ${activeTab === 'context' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('context')}
                                    >
                                        Context
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="detail-tab-content">
                                    {/* Summary Tab */}
                                    {activeTab === 'story' && (
                                        <div className="tab-panel">
                                            <p className="summary-text">{selectedNews.summary}</p>

                                            <div className="action-buttons">
                                                <button className="action-btn primary" onClick={() => setActiveTab('reader')}>
                                                    <FileText size={18} />
                                                    <span>Read Full Article</span>
                                                </button>

                                                {isSupported && (
                                                    <button
                                                        className={`action-btn ${isPlaying ? 'stop' : 'listen'}`}
                                                        onClick={() => isPlaying ? stop() : speak(selectedNews.summary, currentLang)}
                                                    >
                                                        {isPlaying ? <Square size={18} /> : <Play size={18} />}
                                                        <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Full Article Tab */}
                                    {activeTab === 'reader' && (
                                        <div className="tab-panel">
                                            {loadingArticle ? (
                                                <div className="loading-state">
                                                    <div className="spinner" />
                                                    <p>Loading article...</p>
                                                </div>
                                            ) : articleContent && articleContent.content ? (
                                                <div className="article-content">
                                                    {isSupported && (
                                                        <button
                                                            className={`listen-btn ${isPlaying ? 'playing' : ''}`}
                                                            onClick={() => isPlaying ? stop() : speak((articleContent.textContent || articleContent.content || '').replace(/<[^>]*>?/gm, ''), currentLang)}
                                                        >
                                                            {isPlaying ? <Square size={16} /> : <Play size={16} />}
                                                            <span>{isPlaying ? 'Stop' : 'Listen to Article'}</span>
                                                        </button>
                                                    )}
                                                    <div
                                                        className="article-body"
                                                        dangerouslySetInnerHTML={{ __html: articleContent.content || '' }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="error-state">
                                                    <p>Content not available</p>
                                                    <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                                                        <ExternalLink size={18} />
                                                        <span>Read on Website</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Context Tab */}
                                    {activeTab === 'context' && (
                                        <div className="tab-panel">
                                            <div className="context-card">
                                                <h3>Article Details</h3>
                                                <div className="context-item">
                                                    <span className="label">Source</span>
                                                    <span className="value">{selectedNews.source}</span>
                                                </div>
                                                <div className="context-item">
                                                    <span className="label">Category</span>
                                                    <span className="value">{selectedNews.category}</span>
                                                </div>
                                                <div className="context-item">
                                                    <span className="label">Published</span>
                                                    <span className="value">{selectedNews.timestamp}</span>
                                                </div>
                                                <div className="context-item">
                                                    <span className="label">Sentiment</span>
                                                    <span className={`value sentiment-${selectedNews.sentiment}`}>{selectedNews.sentiment}</span>
                                                </div>
                                                <div className="context-item">
                                                    <span className="label">Language</span>
                                                    <span className="value">{currentLang.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
