'use client';

import { useState } from 'react';
import NewsCard from './NewsCard';
import { MOCK_NEWS, NewsItem } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';

export default function CardStack() {
    const [cards, setCards] = useState<NewsItem[]>(MOCK_NEWS);
    const [history, setHistory] = useState<NewsItem[]>([]);

    const handleSwipe = (id: string, direction: 'left' | 'right') => {
        // Remove the card from the stack
        setTimeout(() => {
            setCards((prev) => prev.filter((card) => card.id !== id));
        }, 200); // Small delay to allow animation to complete

        console.log(`Swiped ${direction} on card ${id}`);
    };

    return (
        <div className="relative w-full h-[80vh] flex items-center justify-center">
            <AnimatePresence>
                {cards.map((news, index) => {
                    // Only render the top 3 cards for performance
                    if (index > 2) return null;

                    return (
                        <NewsCard
                            key={news.id}
                            news={news}
                            index={index}
                            onSwipe={(dir) => handleSwipe(news.id, dir)}
                        />
                    );
                }).reverse()}
            </AnimatePresence>

            {cards.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <h2 className="text-2xl font-bold text-white mb-2">You're all caught up!</h2>
                    <p className="text-slate-400">Check back later for more updates.</p>
                    <button
                        onClick={() => setCards(MOCK_NEWS)}
                        className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors"
                    >
                        Refresh Feed
                    </button>
                </div>
            )}
        </div>
    );
}
