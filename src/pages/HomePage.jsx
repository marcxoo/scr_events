import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import EventList from '../components/EventList';
import NextEvent from '../components/NextEvent';
import { useEvents } from '../context/EventContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Timer } from 'lucide-react';

const INTERVAL_SECONDS = 60;

function HomePage() {
    const { events, loading } = useEvents();
    const [currentView, setCurrentView] = useState('list');
    const [countdown, setCountdown] = useState(INTERVAL_SECONDS);

    // Logic to find the next event
    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.dateObj) >= now).sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj));
    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : events[events.length - 1];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentView(prev => prev === 'list' ? 'next' : 'list');
            setCountdown(INTERVAL_SECONDS);
        }, INTERVAL_SECONDS * 1000);

        return () => clearInterval(interval);
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : INTERVAL_SECONDS));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Show loading state
    if (loading) {
        return (
            <Layout>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-2xl text-brand-blue font-bold animate-pulse">
                        Cargando eventos...
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <AnimatePresence mode="wait">
                {currentView === 'list' ? (
                    <motion.div
                        key="list"
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <EventList events={events} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="next"
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <NextEvent event={nextEvent} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle countdown timer */}
            <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-100 select-none z-50">
                <div className="w-6 h-6 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <Timer size={14} className="text-brand-blue" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-slate-600 tabular-nums">{countdown}s</span>
            </div>
        </Layout>
    );
}

export default HomePage;
