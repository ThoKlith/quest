import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Trophy, Settings } from 'lucide-react';

interface ProfileMenuProps {
    user: any;
    onLogout: () => void;
}

export default function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDisplayName = () => {
        return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    };

    const getAvatarUrl = () => {
        return user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
                {getAvatarUrl() ? (
                    <img
                        src={getAvatarUrl()}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-500">
                        <User size={18} />
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 glass border border-gray-800 rounded-xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                {getAvatarUrl() ? (
                                    <img
                                        src={getAvatarUrl()}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">
                                        {getDisplayName()}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
