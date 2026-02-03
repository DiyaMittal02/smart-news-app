'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem, WeatherData } from '@/lib/types';
import NewsGrid from '@/components/NewsGrid';
import { Cloud, Zap, Filter, Menu, Home, Briefcase, Cpu, Activity, Play, Globe, X, Smartphone, Film } from 'lucide-react';
import { getLabel } from '@/lib/locales';

interface HomeProps {
    liveNews: NewsItem[];
    currentRegion?: string;
    currentLang?: string;
    currentCategory?: string;
}

export default function HomeClient({ liveNews, currentRegion = 'global', currentLang = 'en', currentCategory = 'all' }: HomeProps) {
    const [zenMode, setZenMode] = useState(false);
    const [weather, setWeather] = useState<WeatherData>({ temp: 22, condition: 'Clear', location: 'London' });
    const [showFilter, setShowFilter] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Local state for filter modal
    const [selectedRegion, setSelectedRegion] = useState(currentRegion);
    const [selectedLang, setSelectedLang] = useState(currentLang);
    const [isApplying, setIsApplying] = useState(false);

    // Sync state with props
    useEffect(() => {
        setSelectedRegion(currentRegion);
        setSelectedLang(currentLang);
    }, [currentRegion, currentLang]);

    // Filter news if Zen Mode is active
    const displayNews = zenMode
        ? liveNews.filter(n => n.sentiment === 'positive' || n.category.includes('Tech') || n.category.includes('Science'))
        : liveNews;

    // Real Weather Fetching
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                    const data = await res.json();
                    setWeather({
                        temp: data.current_weather.temperature,
                        condition: 'Local',
                        location: 'My Location'
                    });
                } catch (e) { console.error("Weather fetch failed", e); }
            });
        }
    }, []);

    const changeCategory = (cat: string) => {
        router.push(`/?region=${currentRegion}&lang=${currentLang}&category=${cat}`);
        router.refresh();
    };

    const applyFilters = () => {
        router.push(`/?region=${selectedRegion}&lang=${selectedLang}&category=${currentCategory}`);
        setShowFilter(false);
        router.refresh();
    };

    // Categories Sidebar Data
    const categories = [
        { id: 'all', label: getLabel(currentLang, 'topStories'), icon: Home },
        { id: 'business', label: getLabel(currentLang, 'business'), icon: Briefcase },
        { id: 'tech', label: getLabel(currentLang, 'tech'), icon: Cpu },
        { id: 'sports', label: getLabel(currentLang, 'sports'), icon: Activity },
        { id: 'entertainment', label: getLabel(currentLang, 'entertainment'), icon: Play },
        { id: 'science', label: getLabel(currentLang, 'science'), icon: Globe },
        { id: 'health', label: getLabel(currentLang, 'health'), icon: Activity },
    ];

    return (
        <div className="app-layout">

            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="brand-section mb-8" style={{ marginBottom: '2rem' }}>
                    <div className="logo-box" style={{ width: 36, height: 36, fontSize: '1.2rem' }}>N</div>
                    <h1 className="brand-title" style={{ fontSize: '1.4rem' }}>{getLabel(currentLang, 'appTitle')}</h1>
                </div>

                <div className="nav-section">
                    <h3 className="nav-title">{getLabel(currentLang, 'feeds')}</h3>

                    {/* New Unique Feature: Reels */}
                    <div
                        className="nav-item mb-4"
                        onClick={() => router.push('/reels')}
                        style={{
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        <Smartphone size={18} />
                        <span>News Reels</span>
                    </div>

                    {/* Live TV Feature */}
                    <div
                        className="nav-item mb-4"
                        onClick={() => router.push('/live-tv')}
                        style={{
                            background: 'linear-gradient(45deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        <Film size={18} />
                        <span>Live TV</span>
                    </div>


                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            className={`nav-item ${currentCategory === cat.id ? 'active' : ''}`}
                            onClick={() => changeCategory(cat.id)}
                        >
                            <cat.icon size={18} />
                            <span>{cat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="nav-section mt-auto" style={{ marginTop: 'auto' }}>
                    <h3 className="nav-title">{getLabel(currentLang, 'settings')}</h3>
                    <div className="nav-item" onClick={() => setShowFilter(true)}>
                        <Filter size={18} />
                        <span>{getLabel(currentLang, 'preferences')}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="nexus-header">
                    <div className="mobile-brand brand-section" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setZenMode(true)} style={{ background: 'none', border: 'none', color: '#fff' }}>
                            <Menu size={24} onClick={(e) => { e.stopPropagation(); setZenMode(!zenMode); /* Re-using zenmode as toggle for now or better add new state */ }} />
                        </button>
                        <div className="logo-box">N</div>
                    </div>

                    {/* DESKTOP HEADER CONTROLS */}
                    <div className="header-controls ml-auto" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        {/* Mobile Menu Button - Visible only on mobile via CSS */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(true)}
                            style={{ display: 'none', background: 'none', border: 'none', color: 'white', marginRight: 'auto' }}
                        >
                            <Menu size={24} />
                        </button>

                        <div className="weather-widget hidden md:flex">
                            <Cloud size={18} color="#facc15" />
                            <span className="weather-temp">{weather.temp}°C</span>
                        </div>

                        <div className="zen-toggle hidden md:flex" onClick={() => setZenMode(!zenMode)}>
                            <Zap size={16} color={zenMode ? '#2ea043' : '#8b949e'} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Zen</span>
                            <div className={`zen-switch ${zenMode ? 'active' : ''}`}>
                                <div className="zen-dot" />
                            </div>
                        </div>

                        <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowFilter(!showFilter)}>
                                <Filter size={20} color="#fff" />
                            </button>
                        </div>
                    </div>
                </header>

                <NewsGrid initialNews={displayNews} currentLang={currentLang} />

                {/* MOBILE NAVIGATION DRAWER */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-left duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 overflow-y-auto">
                            {/* Specific Mobile Nav Items */}
                            <div
                                className="nav-item mb-4"
                                onClick={() => { router.push('/reels'); setIsMobileMenuOpen(false); }}
                                style={{ background: 'linear-gradient(45deg, #f09433 0%, #dc2743 100%)', border: 'none' }}
                            >
                                <Smartphone size={18} /> <span>News Reels</span>
                            </div>

                            <div
                                className="nav-item mb-6"
                                onClick={() => { router.push('/live-tv'); setIsMobileMenuOpen(false); }}
                                style={{ background: 'linear-gradient(45deg, #0ea5e9 0%, #3b82f6 100%)', border: 'none' }}
                            >
                                <Film size={18} /> <span>Live TV</span>
                            </div>

                            <h3 className="nav-title mt-2">Categories</h3>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className={`nav-item ${currentCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => { changeCategory(cat.id); setIsMobileMenuOpen(false); }}
                                >
                                    <cat.icon size={18} />
                                    <span>{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filter Modal - Uses NEW Settings Classes */}
                {showFilter && (
                    <div className="modal-overlay" onClick={() => setShowFilter(false)}>
                        <div className="settings-modal" onClick={e => e.stopPropagation()}>
                            <div className="settings-header">
                                <h2>{getLabel(currentLang, 'preferences')}</h2>
                                <button onClick={() => setShowFilter(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="settings-body">
                                <div className="filter-section">
                                    <span className="filter-title">{getLabel(currentLang, 'region')}</span>
                                    <div className="filter-grid">
                                        {['global', 'india', 'usa'].map(r => (
                                            <button key={r} onClick={() => setSelectedRegion(r)} className={`filter-btn ${selectedRegion === r ? 'active' : ''} capitalize`}>
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-section">
                                    <span className="filter-title">{getLabel(currentLang, 'language')}</span>
                                    <div className="filter-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', display: 'grid' }}>
                                        {['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa'].map(l => (
                                            <button key={l} onClick={() => setSelectedLang(l)} className={`filter-btn ${selectedLang === l ? 'active' : ''} uppercase`}>
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button className="apply-btn" onClick={() => {
                                    setIsApplying(true);
                                    applyFilters();
                                    setTimeout(() => setIsApplying(false), 2000);
                                }} disabled={isApplying}>
                                    {isApplying ? 'Updating...' : getLabel(currentLang, 'update')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
