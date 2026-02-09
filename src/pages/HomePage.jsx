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
    const [viewIndex, setViewIndex] = useState(0); // 0 = list, 1 = first event, 2 = second event, etc.
    const [countdown, setCountdown] = useState(INTERVAL_SECONDS);

    // Logic to find upcoming events
    const now = new Date();
    const upcomingEvents = events
        .filter(e => new Date(e.dateObj) >= now)
        .sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj));

    // Determine which events to feature in the rotation
    const featuredEvents = [];
    if (upcomingEvents.length > 0) {
        // Always add the very next event
        featuredEvents.push(upcomingEvents[0]);

        // Check if the SECOND event is on the same day or the next day
        if (upcomingEvents.length > 1) {
            const firstEventDate = new Date(upcomingEvents[0].dateObj);
            const secondEventDate = new Date(upcomingEvents[1].dateObj);

            // Calculate difference in days
            const diffTime = Math.abs(secondEventDate - firstEventDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If same day (0) or next day (1), add to rotation
            if (diffDays <= 1) {
                featuredEvents.push(upcomingEvents[1]);
            }
        }
    } else if (events.length > 0) {
        // Fallback if no upcoming events, show last event
        featuredEvents.push(events[events.length - 1]);
    }

    // Total views = 1 (List) + number of featured events
    const totalViews = 1 + featuredEvents.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setViewIndex(prev => (prev + 1) % totalViews);
            setCountdown(INTERVAL_SECONDS);
        }, INTERVAL_SECONDS * 1000);

        return () => clearInterval(interval);
    }, [totalViews]);

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
                {viewIndex === 0 ? (
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
                        key={`event-${featuredEvents[viewIndex - 1].id}`}
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <NextEvent event={featuredEvents[viewIndex - 1]} />
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
