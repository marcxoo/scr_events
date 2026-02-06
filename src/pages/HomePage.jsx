import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import EventList from '../components/EventList';
import NextEvent from '../components/NextEvent';
import { useEvents } from '../context/EventContext';
import { AnimatePresence, motion } from 'framer-motion';

function HomePage() {
    const { events, loading } = useEvents();
    const [currentView, setCurrentView] = useState('list');

    // Logic to find the next event
    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.dateObj) >= now).sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj));
    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : events[events.length - 1];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentView(prev => prev === 'list' ? 'next' : 'list');
        }, 60000);

        return () => clearInterval(interval);
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
        </Layout>
    );
}

export default HomePage;
