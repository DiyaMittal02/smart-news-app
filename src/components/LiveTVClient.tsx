'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tv, Radio, ExternalLink, Zap, Signal, Volume2 } from 'lucide-react';

interface Channel {
    id: string;
    name: string;
    category: string;
    lang: string;
    youtubeId: string;
    color: string;
    logo?: string;
}

const CHANNELS: Channel[] = [
    // World News
    { id: 'sky-news', name: 'Sky News', category: 'World', lang: 'EN', youtubeId: '9Auq9mYxFEE', color: '#ef4444' },
    { id: 'abc-news', name: 'ABC News', category: 'US', lang: 'EN', youtubeId: 'gN0PZCe-kwQ', color: '#22c55e' },
    { id: 'al-jazeera', name: 'Al Jazeera', category: 'World', lang: 'EN', youtubeId: 'gCNeDWCI0vo', color: '#eab308' },
    { id: 'dw-news', name: 'DW News', category: 'World', lang: 'EN', youtubeId: '3KkO6j6e_kE', color: '#f97316' },

    // India News
    { id: 'india-today', name: 'India Today', category: 'India', lang: 'EN', youtubeId: 'sYZtOFzM78M', color: '#ef4444' },
    { id: 'ndtv', name: 'NDTV 24x7', category: 'India', lang: 'EN', youtubeId: 'l9ViEIip9q4', color: '#ef4444' },
    { id: 'aaj-tak', name: 'Aaj Tak', category: 'India', lang: 'HI', youtubeId: 'Nq2wYlWFucg', color: '#3b82f6' },
    { id: 'tv9-telugu', name: 'TV9 Telugu', category: 'Regional', lang: 'TE', youtubeId: 'II_m28bmKET', color: '#8b5cf6' },
    { id: 'polimer', name: 'Polimer', category: 'Regional', lang: 'TA', youtubeId: 'E1qK_vJ1cQ0', color: '#ec4899' },

    // Tech/Space
    { id: 'nasa', name: 'NASA Live', category: 'Space', lang: 'EN', youtubeId: '21X5lGlDOfg', color: '#06b6d4' },
];

export default function LiveTVClient() {
    const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);

    const getCategoryStyle = (category: string) => {
        switch (category) {
            case 'World': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
            case 'US': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' };
            case 'India': return { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316' };
            case 'Regional': return { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6' };
            case 'Space': return { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4' };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff' };
        }
    };

    return (
        <div className="livetv-container">
            {/* Background */}
            <div className="livetv-bg" />

            {/* Sidebar */}
            <aside className="livetv-sidebar">
                <div className="sidebar-header">
                    <Link href="/" className="back-btn">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="brand">
                        <div className="brand-icon">
                            <Radio size={18} />
                        </div>
                        <div>
                            <h1>Live TV</h1>
                            <span>Global Broadcasts</span>
                        </div>
                    </div>
                </div>

                <div className="channels-list">
                    {CHANNELS.map(channel => {
                        const isActive = activeChannel.id === channel.id;
                        const catStyle = getCategoryStyle(channel.category);

                        return (
                            <button
                                key={channel.id}
                                onClick={() => setActiveChannel(channel)}
                                className={`channel-card ${isActive ? 'active' : ''}`}
                            >
                                {/* Active Indicator */}
                                {isActive && <div className="active-bar" style={{ background: channel.color }} />}

                                {/* Channel Icon */}
                                <div className="channel-icon" style={{
                                    background: `${channel.color}15`,
                                    borderColor: isActive ? channel.color : 'transparent'
                                }}>
                                    <Tv size={18} style={{ color: channel.color }} />
                                    {isActive && (
                                        <div className="live-indicator">
                                            <span />
                                        </div>
                                    )}
                                </div>

                                {/* Channel Info */}
                                <div className="channel-info">
                                    <h3>{channel.name}</h3>
                                    <div className="channel-meta">
                                        <span className="lang-badge">{channel.lang}</span>
                                        <span className="category" style={{
                                            background: catStyle.bg,
                                            color: catStyle.text
                                        }}>
                                            {channel.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Playing Indicator */}
                                {isActive && (
                                    <div className="playing-indicator">
                                        <Signal size={14} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Main Player */}
            <main className="livetv-main">
                {/* Video Container */}
                <div className="video-container">
                    <iframe
                        key={activeChannel.youtubeId}
                        src={`https://www.youtube.com/embed/${activeChannel.youtubeId}?autoplay=1&mute=0&playsinline=1&rel=0&showinfo=0&modestbranding=1`}
                        title={activeChannel.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* YouTube Link Overlay */}
                    <a
                        href={`https://www.youtube.com/watch?v=${activeChannel.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-link"
                    >
                        <ExternalLink size={14} />
                        <span>Open in YouTube</span>
                    </a>
                </div>

                {/* Info Bar */}
                <div className="info-bar">
                    <div className="info-content">
                        <div className="live-badge">
                            <span className="live-dot" />
                            <span>LIVE</span>
                        </div>
                        <h2>{activeChannel.name}</h2>
                        <p>
                            <Volume2 size={14} />
                            Streaming via YouTube • {activeChannel.category}
                        </p>
                    </div>

                    <a
                        href={`https://www.youtube.com/watch?v=${activeChannel.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="watch-btn"
                    >
                        <Tv size={16} />
                        <span>Watch on YouTube</span>
                    </a>
                </div>
            </main>

            <style jsx global>{`
                .livetv-container {
                    min-height: 100vh;
                    background: #0a0a0f;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                }
                
                .livetv-bg {
                    position: fixed;
                    inset: 0;
                    background: 
                        radial-gradient(ellipse 60% 40% at 70% 10%, rgba(124, 58, 237, 0.12), transparent),
                        radial-gradient(ellipse 40% 30% at 30% 90%, rgba(6, 182, 212, 0.08), transparent);
                    pointer-events: none;
                    z-index: 0;
                }
                
                .livetv-sidebar {
                    width: 100%;
                    max-height: 45vh;
                    background: rgba(16, 16, 24, 0.9);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    overflow-y: auto;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                }
                
                .sidebar-header {
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    position: sticky;
                    top: 0;
                    background: rgba(16, 16, 24, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 5;
                }
                
                .back-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    color: white;
                    transition: all 0.2s;
                }
                
                .back-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .brand-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                }
                
                .brand h1 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin: 0;
                }
                
                .brand span {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .channels-list {
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .channel-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: none;
                    border: 1px solid transparent;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    text-align: left;
                    width: 100%;
                }
                
                .channel-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                }
                
                .channel-card.active {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.08);
                }
                
                .active-bar {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 24px;
                    border-radius: 0 3px 3px 0;
                }
                
                .channel-icon {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    border: 2px solid;
                    position: relative;
                    flex-shrink: 0;
                    transition: all 0.2s;
                }
                
                .live-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    background: #ef4444;
                    border-radius: 50%;
                    border: 2px solid #0a0a0f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .live-indicator span {
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                    animation: pulse 1.5s infinite;
                }
                
                .channel-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .channel-info h3 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: white;
                    margin: 0 0 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .channel-meta {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }
                
                .lang-badge {
                    font-size: 0.6rem;
                    font-weight: 700;
                    padding: 2px 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    color: rgba(255, 255, 255, 0.6);
                }
                
                .category {
                    font-size: 0.6rem;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                
                .playing-indicator {
                    color: #7c3aed;
                    animation: pulse 2s infinite;
                }
                
                .livetv-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 55vh;
                    position: relative;
                    z-index: 5;
                }
                
                .video-container {
                    flex: 1;
                    position: relative;
                    background: #000;
                }
                
                .video-container iframe {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                
                .youtube-link {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    opacity: 0;
                    transition: all 0.3s;
                    text-decoration: none;
                }
                
                .video-container:hover .youtube-link {
                    opacity: 1;
                }
                
                .youtube-link:hover {
                    background: #ef4444;
                    border-color: #ef4444;
                }
                
                .info-bar {
                    padding: 1.25rem;
                    background: rgba(16, 16, 24, 0.95);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                
                .info-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .live-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: #ef4444;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .live-dot {
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #ef4444;
                    animation: pulse 1.5s infinite;
                }
                
                .info-content h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                }
                
                .info-content p {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                }
                
                .watch-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                    transition: all 0.2s;
                }
                
                .watch-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                /* Desktop Styles */
                @media (min-width: 1024px) {
                    .livetv-container {
                        flex-direction: row;
                    }
                    
                    .livetv-sidebar {
                        width: 320px;
                        max-height: 100vh;
                        height: 100vh;
                        border-bottom: none;
                        border-right: 1px solid rgba(255, 255, 255, 0.06);
                    }
                    
                    .livetv-main {
                        min-height: 100vh;
                    }
                    
                    .channel-card {
                        padding: 14px;
                    }
                    
                    .channel-icon {
                        width: 48px;
                        height: 48px;
                    }
                    
                    .channel-info h3 {
                        font-size: 0.95rem;
                    }
                    
                    .info-bar {
                        padding: 1.5rem 2rem;
                    }
                    
                    .info-content h2 {
                        font-size: 1.5rem;
                    }
                }
                
                /* Mobile Adjustments */
                @media (max-width: 480px) {
                    .sidebar-header {
                        padding: 1rem;
                    }
                    
                    .channels-list {
                        padding: 0.5rem;
                    }
                    
                    .channel-card {
                        padding: 10px;
                    }
                    
                    .channel-icon {
                        width: 38px;
                        height: 38px;
                    }
                    
                    .info-bar {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .watch-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}
