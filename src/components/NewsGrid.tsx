'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem, ScrapedArticle } from '@/lib/types';
import NewsCard from './NewsCard';
import {
    X, Search, RefreshCw, Activity, FileText, ExternalLink, Play, Square
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

    // Audio Hook
    const { speak, stop, isPlaying, isSupported } = useSpeech();

    const router = useRouter();

    useEffect(() => {
        setNews(initialNews);
    }, [initialNews]);

    // When expanding a card, reset article state
    const handleCardClick = (n: NewsItem) => {
        setSelectedNews(n);
        setActiveTab('story');
        setArticleContent(null);
        stop(); // Stop any playing audio
    };

    // Stop audio when modal closes
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

            {/* Expanded Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
                        <motion.div
                            layoutId={`card-${selectedNews.id}`}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >

                            <button
                                onClick={() => setSelectedNews(null)}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={20} />
                            </button>

                            {/* Standard Modal Header (Hidden in Reader Mode) */}
                            {activeTab !== 'reader' && (
                                <div className="modal-hero">
                                    <motion.img
                                        layoutId={`image-${selectedNews.id}`}
                                        src={selectedNews.image}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #161b22 10%, transparent)' }} />
                                    <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                                        <motion.h2 layoutId={`title-${selectedNews.id}`} style={{ fontSize: '2rem', lineHeight: '1.2', marginBottom: '1rem', fontWeight: 800 }}>
                                            {selectedNews.title}
                                        </motion.h2>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem', color: '#ccc' }}>
                                            <span className="badge">{selectedNews.sentiment}</span>
                                            <span>{selectedNews.source}</span>
                                            <span>{selectedNews.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Content Body */}
                            <div className="modal-body" style={activeTab === 'reader' ? { padding: 0 } : { padding: '2rem' }}>

                                {/* Tabs (Hidden in Reader Mode) */}
                                {activeTab !== 'reader' && (
                                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #30363d', marginBottom: '2rem' }}>
                                        <button className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`} onClick={() => setActiveTab('story')} style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'story' ? '2px solid #1f6feb' : 'none', color: activeTab === 'story' ? '#fff' : '#8b949e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Quick Summary</button>
                                        <button className={`tab-btn ${activeTab === 'reader' ? 'active' : ''}`} onClick={() => setActiveTab('reader')} style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'reader' ? '2px solid #1f6feb' : 'none', color: activeTab === 'reader' ? '#fff' : '#8b949e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Full Article</button>
                                        <button className={`tab-btn ${activeTab === 'context' ? 'active' : ''}`} onClick={() => setActiveTab('context')} style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'context' ? '2px solid #1f6feb' : 'none', color: activeTab === 'context' ? '#fff' : '#8b949e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Context</button>
                                    </div>
                                )}

                                <div>
                                    {/* 1. Quick Summary */}
                                    {activeTab === 'story' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#d0d7de', marginBottom: '2rem' }}>
                                                {selectedNews.summary}
                                            </p>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                <button onClick={() => setActiveTab('reader')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1f6feb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                    <FileText size={18} /> Load Full Story
                                                </button>

                                                {/* Text-to-Speech Button */}
                                                {isSupported && (
                                                    <button
                                                        onClick={() => isPlaying ? stop() : speak(selectedNews.summary, currentLang)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isPlaying ? '#da3633' : '#238636', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', minWidth: '120px', justifyContent: 'center' }}
                                                    >
                                                        {isPlaying ? (
                                                            <><span className="spin" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} /> Stop</>
                                                        ) : (
                                                            <><Play size={18} /> Listen</>
                                                        )}
                                                    </button>
                                                )}

                                                {selectedNews.link && (
                                                    <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold' }}>
                                                        Open Source <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* 2. Full Content Reader (MAGAZINE MODE) */}
                                    {activeTab === 'reader' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="reader-mode">
                                            {loadingArticle ? (
                                                <div style={{ textAlign: 'center', padding: '4rem' }}>
                                                    <div className="spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #333', borderTopColor: '#fff', borderRadius: '50%', marginBottom: '1rem' }} />
                                                    <p style={{ color: '#8b949e' }}>Curating content from {selectedNews.source}...</p>
                                                </div>
                                            ) : articleContent ? (
                                                <>
                                                    {/* Back Button */}
                                                    <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 60 }}>
                                                        <button onClick={() => setActiveTab('story')} style={{ background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                                                            ← Back
                                                        </button>
                                                    </div>

                                                    {/* Hero Section */}
                                                    <div className="magazine-hero">
                                                        <img src={selectedNews.image} alt="Hero" />
                                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f1115 0%, transparent 80%)' }} />
                                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 2rem 4rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                                                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                                                <h1 className="magazine-title" style={{ marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                                                                    {articleContent.title || selectedNews.title}
                                                                </h1>
                                                                <div className="magazine-meta" style={{ color: '#ccc', justifyContent: 'flex-start' }}>
                                                                    <span style={{ color: '#fff', fontWeight: 700 }}>{selectedNews.source}</span>
                                                                    <span>•</span>
                                                                    <span>{selectedNews.timestamp}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Article Body */}
                                                    <div className="magazine-content">
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                            <span className="badge" style={{ background: '#1f6feb', borderColor: '#1f6feb' }}>
                                                                {selectedNews.category}
                                                            </span>

                                                            {/* Read Aloud Full Article */}
                                                            {isSupported && (
                                                                <button
                                                                    onClick={() => isPlaying ? stop() : speak(articleContent.content.replace(/<[^>]*>?/gm, ''), currentLang)}
                                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #30363d', color: '#8b949e', padding: '6px 12px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                                >
                                                                    {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                                    {isPlaying ? 'Stop Reading' : 'Listen to Article'}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* DANGEROUSLY SET HTML */}
                                                        <div
                                                            className="magazine-body"
                                                            dangerouslySetInnerHTML={{ __html: articleContent.content }}
                                                        />

                                                        <div style={{ marginTop: '4rem', padding: '2rem', background: '#21262d', borderRadius: '12px', textAlign: 'center' }}>
                                                            <p style={{ marginBottom: '1rem', color: '#8b949e' }}>Read the full story at the source</p>
                                                            <a href={selectedNews.link} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#000', padding: '10px 24px', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none' }}>
                                                                Visit Original Source <ExternalLink size={16} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '5rem' }}>
                                                    <p>Content unavailable.</p>
                                                    <a href={selectedNews.link} target="_blank" style={{ color: '#1f6feb' }}>Open Website</a>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* 3. Context */}
                                    {activeTab === 'context' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <div className="bias-meter">
                                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                                    <Activity size={18} color="#1f6feb" /> Key Information
                                                </h4>
                                                <ul style={{ color: '#d0d7de', lineHeight: '1.8' }}>
                                                    <li><strong>Source:</strong> {selectedNews.source}</li>
                                                    <li><strong>Category:</strong> {selectedNews.category}</li>
                                                    <li><strong>Published:</strong> {selectedNews.timestamp}</li>
                                                    <li><strong>Language:</strong> {currentLang.toUpperCase()}</li>
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
