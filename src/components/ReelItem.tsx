'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem } from '@/lib/types';
import { Share2, Heart, Volume2, VolumeX, Newspaper, ExternalLink, Check, Play, Pause } from 'lucide-react';
import { useSpeech } from '@/hooks/use-speech';

interface ReelItemProps {
    news: NewsItem;
    isActive: boolean;
    currentLang?: string;
    isAutoPlay?: boolean;
    onToggleAutoPlay?: () => void;
}

export default function ReelItem({ news, isActive, currentLang = 'en', isAutoPlay = false, onToggleAutoPlay }: ReelItemProps) {
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);
    const { speak, stop, isPlaying } = useSpeech();

    // Video Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);

    // Auto-Stop Audio/Video when swiping away AND Handle Auto-Play Speech
    useEffect(() => {
        if (!isActive) {
            if (isPlaying) stop();
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        } else {
            // 1. Auto-play video when active
            if (videoRef.current) {
                videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
                setIsVideoPlaying(true);
            }

            // 2. Auto-play Speech if enabled globally
            if (isAutoPlay) {
                speak(news.title + ". " + news.summary, currentLang);
            }
        }
    }, [isActive, isPlaying, stop, isAutoPlay, currentLang, news.title, news.summary]); // Added dependencies

    // Cleanup video styles for "Instagram" feel
    // If news.videoUrl exists, render video player

    const toggleVideo = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsVideoPlaying(true);
        } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        }
    };

    // Toggle Global Auto-Play Mode
    const toggleRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleAutoPlay) {
            onToggleAutoPlay(); // Toggle global state
        }

        // Immediate local feedback
        if (isPlaying) {
            stop(); // Always stop if currently playing
        } else {
            // If we just enabled it, start speaking immediately
            // Note: The generic useEffect will also catch it, but explicit start helps responsiveness
            speak(news.title + ". " + news.summary, currentLang);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: news.title,
                    text: news.summary,
                    url: news.link
                });
            } catch (err) { console.error(err); }
        } else {
            navigator.clipboard.writeText(news.link || window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="reel-item snap-start relative h-[100dvh] w-full overflow-hidden bg-black shrink-0 font-sans">

            {/* MEDIA LAYER: Video OR Image */}
            <div className="absolute inset-0 z-0 bg-black" onClick={toggleVideo}>
                {news.videoUrl ? (
                    <div className="relative w-full h-full">
                        <video
                            ref={videoRef}
                            src={news.videoUrl}
                            className="w-full h-full object-cover"
                            loop
                            playsInline
                            muted // Start muted for autoplay policy usually
                        // But usually users want sound? For news reels maybe muted by default or let TTS handle audio.
                        />
                        {/* Play/Pause Overlay Icon */}
                        {!isVideoPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                                <Play size={64} className="text-white/80 fill-white/80" />
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <motion.div
                            animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                            transition={{ duration: 15, ease: "linear" }}
                            className="w-full h-full"
                        >
                            <img
                                src={news.image}
                                alt={news.title}
                                className="h-full w-full object-cover"
                                loading="eager"
                            />
                        </motion.div>
                        {/* Gradient Overlays for Image Mode */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    </>
                )}

                {/* Global Gradient Overlay (Apply to video too for readability) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-90" />
            </div>

            {/* Progress Bar */}
            {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 z-50">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: news.videoUrl ? 30 : 15, ease: "linear" }} // Longer if video? or just generic
                        className="h-full bg-white/50 backdrop-blur-sm"
                    />
                </div>
            )}

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-32 z-30 flex flex-col gap-5 items-center">
                <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="group flex flex-col items-center gap-1">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg transition-all active:scale-90 group-hover:bg-white/20">
                        <Heart size={24} className={`transition-all duration-300 ${liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`} />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-lg">{liked ? '12K' : 'Like'}</span>
                </button>

                <button onClick={toggleRead} className="group flex flex-col items-center gap-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/20 shadow-lg transition-all active:scale-90 group-hover:bg-white/20 ${isAutoPlay ? 'bg-indigo-500/80 border-indigo-400' : 'bg-white/10'}`}>
                        {isAutoPlay ? <Volume2 size={24} className="text-white animate-pulse" /> : <VolumeX size={24} className="text-white" />}
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-lg">{isAutoPlay ? 'Auto-Read' : 'Listen'}</span>
                </button>

                <a href={news.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group flex flex-col items-center gap-1">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg transition-all active:scale-90 group-hover:bg-white/20">
                        <ExternalLink size={24} className="text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-lg">Open</span>
                </a>

                <button onClick={handleShare} className="group flex flex-col items-center gap-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/20 shadow-lg transition-all active:scale-90 group-hover:bg-white/20 ${copied ? 'bg-emerald-500/80' : 'bg-white/10'}`}>
                        {copied ? <Check size={24} className="text-white" /> : <Share2 size={24} className="text-white" />}
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-lg">{copied ? 'Copied' : 'Share'}</span>
                </button>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 z-20 w-full p-5 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <div className="flex flex-col gap-3 max-w-[85%] pointer-events-auto">

                    {/* Source Tag */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 w-fit">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            <span className="text-xs font-bold text-white tracking-wider uppercase">{news.source}</span>
                        </div>
                        <span className="text-xs text-white/60 font-medium backdrop-blur-sm px-2 py-1 rounded-md">{news.timestamp}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-white font-extrabold text-xl md:text-2xl leading-tight drop-shadow-xl line-clamp-3">
                        {news.title}
                    </h2>

                    {/* Expandable Summary - IMPROVED: Longer text by default, cleaner expansion */}
                    <AnimatePresence mode="wait">
                        {expanded ? (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="max-h-[40vh] overflow-y-auto pr-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-zinc-200 text-sm leading-relaxed font-normal drop-shadow-md whitespace-pre-line border-l-2 border-white/30 pl-3">
                                        {news.summary}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                                    className="text-white/50 text-xs mt-3 font-bold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Collapse
                                </button>
                            </motion.div>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                                className="text-left mt-1 group w-full"
                            >
                                <p className="text-zinc-300 text-sm line-clamp-2 font-normal drop-shadow-md"> {/* Increased clamp to 2 lines */}
                                    {news.summary}
                                </p>
                                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2 block group-hover:text-white transition-colors">
                                    Read Context
                                </span>
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
