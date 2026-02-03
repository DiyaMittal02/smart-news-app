'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Film, Tv, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

export default function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);

    // Hide on desktop (hidden md:flex is handled by CSS usually, but we'll use a class)
    // We'll style this in globals.css to be `display: none` on desktop.

    const navItems = [
        { id: '/', icon: Home, label: 'Feed' },
        { id: '/reels', icon: Film, label: 'Reels' },
        { id: '/live-tv', icon: Tv, label: 'Live' },
    ];

    return (
        <>
            <div className="mobile-bottom-nav">
                {navItems.map((item) => {
                    const isActive = pathname === item.id;
                    return (
                        <div
                            key={item.id}
                            className={`nav-btn ${isActive ? 'active' : ''}`}
                            onClick={() => router.push(item.id)}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="nav-label">{item.label}</span>
                        </div>
                    );
                })}

                {/* Mobile Menu/Settings Toggle */}
                <div
                    className={`nav-btn ${showMenu ? 'active' : ''}`}
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <Menu size={24} />
                    <span className="nav-label">Menu</span>
                </div>
            </div>

            {/* Simple Menu Overlay for Extra Settings */}
            {showMenu && (
                <div className="mobile-menu-overlay" onClick={() => setShowMenu(false)}>
                    <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
                        <h3>Preferences</h3>
                        <p style={{ color: '#888', marginBottom: '1rem' }}>Customize your feed</p>

                        <div className="menu-option" onClick={() => { router.push('/?region=india'); setShowMenu(false); }}>
                            🇮🇳 India News
                        </div>
                        <div className="menu-option" onClick={() => { router.push('/?region=global'); setShowMenu(false); }}>
                            🌍 Global News
                        </div>
                        <div className="menu-option" style={{ marginTop: 'auto', color: '#ff4444' }} onClick={() => setShowMenu(false)}>
                            Close
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
