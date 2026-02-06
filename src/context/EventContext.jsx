import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventsData as defaultEvents } from '../data/events';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('events');
        if (savedEvents) {
            // Need to reconstruct Date objects
            const parsed = JSON.parse(savedEvents);
            return parsed.map(e => ({
                ...e,
                dateObj: new Date(e.dateObj)
            }));
        }
        return defaultEvents;
    });

    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
    }, [events]);

    const addEvent = (newEvent) => {
        setEvents(prev => {
            // Sort by date automatically
            const updated = [...prev, { ...newEvent, id: Date.now() }];
            return updated.sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj));
        });
    };

    const updateEvent = (updatedEvent) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
            .sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj)));
    };

    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};
