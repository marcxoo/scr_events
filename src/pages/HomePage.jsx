import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import EventList from '../components/EventList';
import NextEvent from '../components/NextEvent';
import { useEvents } from '../context/EventContext';
import { AnimatePresence, motion } from 'framer-motion';

function HomePage() {
    const { events } = useEvents(); // Use context instead of direct import
    const [currentView, setCurrentView] = useState('list'); // 'list' or 'next'

    // Logic to find the next event
    const now = new Date();
    // Filter events that are today or in future
    const upcomingEvents = events.filter(e => new Date(e.dateObj) >= now).sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj));
    // Default to first upcoming, or last event if all past
    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : events[events.length - 1];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentView(prev => prev === 'list' ? 'next' : 'list');
        }, 60000); // Rotate every 1 minute

        return () => clearInterval(interval);
    }, []);

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
