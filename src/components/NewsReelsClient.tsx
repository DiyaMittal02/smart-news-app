'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem } from '@/lib/types';
import ReelItem from './ReelItem';
import { ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

interface NewsReelsClientProps {
    initialNews: NewsItem[];
    currentLang?: string;
    currentCategory?: string;
}

const CATEGORIES = [
    { id: 'all', label: 'For You' },
    { id: 'tech', label: 'Tech' },
    { id: 'science', label: 'Science' },
    { id: 'entertainment', label: 'Life' },
    { id: 'sports', label: 'Sports' },
    { id: 'business', label: 'Business' }
];

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'kn', label: 'Kannada' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'bn', label: 'Bengali' },
    { code: 'mr', label: 'Marathi' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'pa', label: 'Punjabi' }
];

export default function NewsReelsClient({ initialNews, currentLang = 'en', currentCategory = 'all' }: NewsReelsClientProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(currentCategory);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const [isAutoPlay, setIsAutoPlay] = useState(false);

    // Sync state with props if they change externally (e.g. navigation)
    useEffect(() => {
        setActiveTab(currentCategory);
    }, [currentCategory]);

    const handleCategoryChange = (catId: string) => {
        setIsAutoPlay(false); // Reset auto-play on category change
        setActiveTab(catId);
        router.push(`/reels?region=global&lang=${currentLang}&category=${catId}`);
    };

    const handleLangChange = (langCode: string) => {
        setShowLangMenu(false);
        setIsAutoPlay(false); // Reset on lang change
        router.push(`/reels?region=global&lang=${langCode}&category=${activeTab}`);
        // Force refresh to ensure server action fetches new data
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
        <div className="fixed inset-0 z-50 bg-black text-white font-sans">

            {/* Top Bar: Floating Glass Island */}
            <div className="absolute top-0 left-0 right-0 z-40 pt-4 px-4 flex flex-col items-center pointer-events-none">

                {/* Header Row */}
                <div className="w-full max-w-md flex justify-between items-center mb-4 pointer-events-auto relative">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg">
                        <ArrowLeft size={20} />
                    </Link>

                    {/* Centered Logo/Brand for Reels */}
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Smart News</span>
                        <span className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-white to-white/60 drop-shadow-sm">
                            REELS
                        </span>
                    </div>

                    {/* Language Switcher Button */}
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all shadow-lg ${showLangMenu ? 'bg-white text-black border-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                    >
                        <Globe size={20} />
                    </button>

                    {/* Language Menu Dropdown */}
                    {showLangMenu && (
                        <div className="absolute top-14 right-0 w-40 bg-[#0E121B] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="max-h-60 overflow-y-auto no-scrollbar">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLangChange(lang.code)}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentLang === lang.code ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories Pill: Centered & Floating */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto max-w-full px-2 py-2 mask-linear-fade">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`
                                relative whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300
                                ${activeTab === cat.id
                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
                                    : 'bg-black/40 text-white/70 backdrop-blur-md border border-white/10 hover:bg-white/10'
                                }
                            `}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vertical Scroll Container */}
            <div
                ref={containerRef}
                className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
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
                    <div className="h-full w-full flex flex-col items-center justify-center snap-start bg-zinc-900">
                        <p className="text-white/40 font-medium mb-4">No stories found.</p>
                        <button
                            onClick={() => handleCategoryChange('all')}
                            className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm shadow-xl"
                        >
                            Back to For You
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .mask-linear-fade {
                     -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                     mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </div>
    );
}
