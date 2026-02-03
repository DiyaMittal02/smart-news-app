'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tv, Play, ExternalLink, Zap } from 'lucide-react';

interface Channel {
    id: string;
    name: string;
    category: string;
    lang: string;
    youtubeId: string;
    color: string;
}

// CURATED LIST OF STABLE LIVE STREAM IDs (Verified)
const CHANNELS: Channel[] = [
    // World News
    { id: 'sky-news', name: 'Sky News', category: 'World', lang: 'en', youtubeId: '9Auq9mYxFEE', color: '#ef4444' },
    { id: 'abc-news', name: 'ABC News', category: 'US', lang: 'en', youtubeId: 'gN0PZCe-kwQ', color: '#22c55e' },
    { id: 'al-jazeera', name: 'Al Jazeera', category: 'World', lang: 'en', youtubeId: 'gCNeDWCI0vo', color: '#eab308' },
    { id: 'dw-news', name: 'DW News', category: 'World', lang: 'en', youtubeId: '3KkO6j6e_kE', color: '#f97316' },

    // India News
    { id: 'india-today', name: 'India Today', category: 'India', lang: 'en', youtubeId: 'sYZtOFzM78M', color: '#ef4444' }, // Updated ID
    { id: 'ndtv', name: 'NDTV 24x7', category: 'India', lang: 'en', youtubeId: 'l9ViEIip9q4', color: '#ef4444' },
    { id: 'aaj-tak', name: 'Aaj Tak', category: 'India', lang: 'hi', youtubeId: 'Nq2wYlWFucg', color: '#3b82f6' },
    { id: 'tv9-telugu', name: 'TV9 Telugu', category: 'Regional', lang: 'te', youtubeId: 'II_m28bmKET', color: '#8b5cf6' },
    { id: 'polimer', name: 'Polimer', category: 'Regional', lang: 'ta', youtubeId: 'E1qK_vJ1cQ0', color: '#ec4899' },

    // Tech/Space
    { id: 'nasa', name: 'NASA Live', category: 'Space', lang: 'en', youtubeId: '21X5lGlDOfg', color: '#06b6d4' },
];

export default function LiveTVClient() {
    const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row">

            {/* Sidebar / Channel List */}
            <aside className="w-full md:w-80 h-[40vh] md:h-screen bg-[#0E121B] border-r border-[#1a1f2e] overflow-y-auto flex flex-col z-20">
                <div className="p-6 sticky top-0 bg-[#0E121B]/95 backdrop-blur-md z-10 border-b border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Live TV</h1>
                            <p className="text-xs text-white/40 font-medium tracking-wider uppercase">Global Broadcasts</p>
                        </div>
                    </div>
                </div>

                <div className="px-3 pb-6 space-y-1">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel)}
                            className={`w-full group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${activeChannel.id === channel.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            {/* Live Indicator Dot */}
                            <div className={`absolute left-0 w-1 h-8 rounded-r-full transition-all duration-300 ${activeChannel.id === channel.id ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: channel.color }} />

                            {/* Icon Box */}
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 transition-all ${activeChannel.id === channel.id ? 'scale-110 shadow-lg' : 'grayscale group-hover:grayscale-0'}`} style={{ backgroundColor: `${channel.color}20` }}>
                                    <Tv size={20} style={{ color: channel.color }} />
                                </div>
                                {activeChannel.id === channel.id && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0E121B] flex items-center justify-center z-10">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>

                            <div className="text-left flex-1">
                                <h3 className={`font-semibold text-sm transition-colors ${activeChannel.id === channel.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                    {channel.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] uppercase font-bold text-white/30 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                                        {channel.lang}
                                    </span>
                                    <span className="text-[10px] text-white/30">
                                        {channel.category}
                                    </span>
                                </div>
                            </div>

                            {activeChannel.id === channel.id && (
                                <Zap size={16} className="text-white/50 animate-pulse ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Player Area */}
            <main className="flex-1 h-[60vh] md:h-screen relative bg-black flex flex-col">
                {/* Embed Container */}
                <div className="flex-1 w-full h-full relative group bg-zinc-900/50">
                    <iframe
                        key={activeChannel.youtubeId}
                        src={`https://www.youtube.com/embed/${activeChannel.youtubeId}?autoplay=1&mute=0&playsinline=1&rel=0&showinfo=0&modestbranding=1`}
                        title={activeChannel.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* Watch on YouTube Fallback Overlay (Visible on Hover or when empty) */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                            href={`https://www.youtube.com/watch?v=${activeChannel.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-sm font-bold hover:bg-red-600 transition-colors shadow-2xl"
                        >
                            <span>Open in YouTube</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>

                {/* Info Bar (Bottom) */}
                <div className="p-6 bg-[#0E121B] border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="real-live-dot w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                            <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Live Signal</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{activeChannel.name}</h2>
                        <p className="text-sm text-zinc-400">
                            Streaming via YouTube • {activeChannel.category}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href={`https://www.youtube.com/watch?v=${activeChannel.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 px-6 shadow-lg"
                        >
                            <Tv size={18} />
                            <span className="text-sm font-semibold">Watch on YouTube</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
