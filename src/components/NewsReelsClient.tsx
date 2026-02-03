'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem } from '@/lib/types';
import ReelItem from './ReelItem';
import { ArrowLeft, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface NewsReelsClientProps {
    initialNews: NewsItem[];
    currentLang?: string;
    currentCategory?: string;
}

const CATEGORIES = [
    { id: 'all', label: 'For You', icon: '✨' },
    { id: 'tech', label: 'Tech', icon: '💻' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'entertainment', label: 'Life', icon: '🎭' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'business', label: 'Business', icon: '📈' }
];

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', flag: '🇮🇳' },
    { code: 'kn', label: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
    { code: 'bn', label: 'Bengali', flag: '🇮🇳' },
    { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', label: 'Gujarati', flag: '🇮🇳' },
    { code: 'pa', label: 'Punjabi', flag: '🇮🇳' }
];

export default function NewsReelsClient({ initialNews, currentLang = 'en', currentCategory = 'all' }: NewsReelsClientProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(currentCategory);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    useEffect(() => {
        setActiveTab(currentCategory);
    }, [currentCategory]);

    const handleCategoryChange = (catId: string) => {
        setIsAutoPlay(false);
        setActiveTab(catId);
        router.push(`/reels?region=global&lang=${currentLang}&category=${catId}`);
    };

    const handleLangChange = (langCode: string) => {
        setShowLangMenu(false);
        setIsAutoPlay(false);
        router.push(`/reels?region=global&lang=${langCode}&category=${activeTab}`);
        router.refresh();
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (activeIndex !== index) {
                setActiveIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    return (
        <div className="reels-container">
            {/* Premium Gradient Background */}
            <div className="reels-bg-gradient" />

            {/* Top Navigation */}
            <header className="reels-header">
                <div className="reels-header-content">
                    {/* Back Button */}
                    <Link href="/" className="reels-back-btn">
                        <ArrowLeft size={20} />
                    </Link>

                    {/* Brand */}
                    <div className="reels-brand">
                        <span className="reels-brand-sub">Nexus News</span>
                        <span className="reels-brand-main">
                            <Sparkles size={16} />
                            REELS
                        </span>
                    </div>

                    {/* Language Button */}
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className={`reels-lang-btn ${showLangMenu ? 'active' : ''}`}
                    >
                        <Globe size={18} />
                    </button>

                    {/* Language Dropdown */}
                    {showLangMenu && (
                        <div className="reels-lang-menu">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLangChange(lang.code)}
                                    className={`reels-lang-option ${currentLang === lang.code ? 'active' : ''}`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category Pills */}
                <div className="reels-categories">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`reels-category-btn ${activeTab === cat.id ? 'active' : ''}`}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Reels Scroll Container */}
            <div
                ref={containerRef}
                className="reels-scroll-container"
            >
                {initialNews.map((news, index) => (
                    <ReelItem
                        key={news.id}
                        news={news}
                        isActive={index === activeIndex}
                        currentLang={currentLang}
                        isAutoPlay={isAutoPlay}
                        onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
                    />
                ))}

                {initialNews.length === 0 && (
                    <div className="reels-empty">
                        <p>No stories found in this category</p>
                        <button onClick={() => handleCategoryChange('all')} className="reels-empty-btn">
                            Back to For You
                        </button>
                    </div>
                )}
            </div>

            {/* Scroll Indicator */}
            <div className="reels-progress">
                {initialNews.slice(0, 10).map((_, i) => (
                    <div key={i} className={`progress-dot ${i === activeIndex ? 'active' : ''}`} />
                ))}
            </div>

            <style jsx global>{`
                .reels-container {
                    position: fixed;
                    inset: 0;
                    background: #0a0a0f;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    z-index: 100;
                    overflow: hidden;
                }
                
                .reels-bg-gradient {
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(ellipse 50% 30% at 50% 0%, rgba(124, 58, 237, 0.2), transparent),
                        radial-gradient(ellipse 40% 20% at 100% 100%, rgba(236, 72, 153, 0.15), transparent);
                    pointer-events: none;
                    z-index: 0;
                }
                
                .reels-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                    padding: 1rem;
                    padding-top: max(1rem, env(safe-area-inset-top));
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    pointer-events: none;
                }
                
                .reels-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    pointer-events: auto;
                    position: relative;
                    max-width: 500px;
                    margin: 0 auto;
                    width: 100%;
                }
                
                .reels-back-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: white;
                    transition: all 0.2s;
                }
                
                .reels-back-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }
                
                .reels-brand {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .reels-brand-sub {
                    font-size: 0.6rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: rgba(255, 255, 255, 0.4);
                }
                
                .reels-brand-main {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 1.25rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.5px;
                }
                
                .reels-lang-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .reels-lang-btn:hover, .reels-lang-btn.active {
                    background: white;
                    color: #0a0a0f;
                }
                
                .reels-lang-menu {
                    position: absolute;
                    top: 56px;
                    right: 0;
                    width: 180px;
                    background: rgba(22, 22, 31, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 8px;
                    max-height: 300px;
                    overflow-y: auto;
                    animation: fadeIn 0.2s ease;
                }
                
                .reels-lang-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 10px 12px;
                    background: none;
                    border: none;
                    border-radius: 10px;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                
                .reels-lang-option:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                
                .reels-lang-option.active {
                    background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.3));
                    color: white;
                }
                
                .reels-categories {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    padding: 0 1rem;
                    pointer-events: auto;
                    justify-content: center;
                    -webkit-overflow-scrolling: touch;
                }
                
                .reels-categories::-webkit-scrollbar {
                    display: none;
                }
                
                .reels-category-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 50px;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    white-space: nowrap;
                }
                
                .reels-category-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                }
                
                .reels-category-btn.active {
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
                    transform: scale(1.05);
                }
                
                .reels-category-btn .cat-icon {
                    font-size: 1rem;
                }
                
                .reels-scroll-container {
                    height: 100dvh;
                    width: 100%;
                    overflow-y: scroll;
                    scroll-snap-type: y mandatory;
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                }
                
                .reels-scroll-container::-webkit-scrollbar {
                    display: none;
                }
                
                .reels-empty {
                    height: 100dvh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    scroll-snap-align: start;
                }
                
                .reels-empty p {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 1rem;
                }
                
                .reels-empty-btn {
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    border: none;
                    border-radius: 50px;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
                }
                
                .reels-progress {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    z-index: 30;
                }
                
                .progress-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    transition: all 0.3s;
                }
                
                .progress-dot.active {
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
                    transform: scale(1.3);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @media (max-width: 768px) {
                    .reels-header-content {
                        padding: 0 0.5rem;
                    }
                    
                    .reels-category-btn {
                        padding: 6px 12px;
                        font-size: 0.75rem;
                    }
                    
                    .reels-progress {
                        right: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
