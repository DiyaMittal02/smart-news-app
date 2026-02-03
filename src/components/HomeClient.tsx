'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem, WeatherData } from '@/lib/types';
import NewsGrid from '@/components/NewsGrid';
import {
    Cloud, Zap, Filter, Home, Briefcase, Cpu, Activity,
    Play, Globe, X, Smartphone, Film, Sparkles
} from 'lucide-react';
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
    const router = useRouter();

    const [selectedRegion, setSelectedRegion] = useState(currentRegion);
    const [selectedLang, setSelectedLang] = useState(currentLang);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        setSelectedRegion(currentRegion);
        setSelectedLang(currentLang);
    }, [currentRegion, currentLang]);

    const displayNews = zenMode
        ? liveNews.filter(n => n.sentiment === 'positive' || n.category.includes('Tech') || n.category.includes('Science'))
        : liveNews;

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
                <div className="sidebar-brand">
                    <div className="logo-icon">N</div>
                    <div className="brand-text">
                        <span className="brand-name">Nexus</span>
                        <span className="brand-tagline">Smart News</span>
                    </div>
                </div>

                {/* Featured Links */}
                <div className="nav-section">
                    <div className="nav-section-title">Discover</div>

                    <div
                        className="nav-item featured"
                        onClick={() => router.push('/reels')}
                        style={{
                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(124, 58, 237, 0.15))',
                            borderColor: 'rgba(236, 72, 153, 0.3)'
                        }}
                    >
                        <Smartphone size={18} />
                        <span>News Reels</span>
                        <Sparkles size={14} style={{ marginLeft: 'auto', color: '#ec4899' }} />
                    </div>

                    <div
                        className="nav-item"
                        onClick={() => router.push('/live-tv')}
                        style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            borderColor: 'rgba(6, 182, 212, 0.2)'
                        }}
                    >
                        <Film size={18} />
                        <span>Live TV</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="nav-section">
                    <div className="nav-section-title">Categories</div>
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

                {/* Settings */}
                <div className="nav-section" style={{ marginTop: 'auto' }}>
                    <div className="nav-section-title">Settings</div>
                    <div className="nav-item" onClick={() => setShowFilter(true)}>
                        <Filter size={18} />
                        <span>{getLabel(currentLang, 'preferences')}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="nexus-header">
                    {/* Mobile Brand */}
                    <div className="mobile-brand" style={{ display: 'none', alignItems: 'center', gap: 12 }}>
                        <div className="logo-icon" style={{ width: 36, height: 36, fontSize: '1rem' }}>N</div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Nexus</span>
                    </div>

                    <div className="header-controls" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <div className="weather-widget">
                            <Cloud size={16} color="#facc15" />
                            <span>{weather.temp}°C</span>
                        </div>

                        <div className="zen-toggle" onClick={() => setZenMode(!zenMode)}>
                            <Zap size={14} color={zenMode ? '#10b981' : '#71717a'} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Zen</span>
                            <div className={`zen-switch ${zenMode ? 'active' : ''}`}>
                                <div className="zen-dot" />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowFilter(true)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <Filter size={18} color="#a1a1aa" />
                        </button>
                    </div>
                </header>

                <NewsGrid initialNews={displayNews} currentLang={currentLang} />

                {/* Filter Modal */}
                {showFilter && (
                    <div className="modal-overlay" onClick={() => setShowFilter(false)}>
                        <div className="settings-modal" onClick={e => e.stopPropagation()}>
                            <div className="settings-header">
                                <h2>Preferences</h2>
                                <button
                                    onClick={() => setShowFilter(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#fff'
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="settings-body">
                                <div className="filter-section">
                                    <div className="filter-title">Region</div>
                                    <div className="filter-grid">
                                        {['global', 'india', 'usa'].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setSelectedRegion(r)}
                                                className={`filter-btn ${selectedRegion === r ? 'active' : ''}`}
                                                style={{ textTransform: 'capitalize' }}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-title">Language</div>
                                    <div className="filter-grid">
                                        {[
                                            { code: 'en', label: 'EN' },
                                            { code: 'hi', label: 'HI' },
                                            { code: 'ta', label: 'TA' },
                                            { code: 'te', label: 'TE' },
                                            { code: 'kn', label: 'KN' },
                                            { code: 'ml', label: 'ML' },
                                            { code: 'bn', label: 'BN' },
                                            { code: 'mr', label: 'MR' },
                                            { code: 'gu', label: 'GU' },
                                        ].map(l => (
                                            <button
                                                key={l.code}
                                                onClick={() => setSelectedLang(l.code)}
                                                className={`filter-btn ${selectedLang === l.code ? 'active' : ''}`}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="apply-btn"
                                    onClick={() => {
                                        setIsApplying(true);
                                        applyFilters();
                                        setTimeout(() => setIsApplying(false), 1500);
                                    }}
                                    disabled={isApplying}
                                >
                                    {isApplying ? 'Applying...' : 'Apply Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
