import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { eventsData as defaultEvents } from '../data/events';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch events from Supabase on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true });

            if (error) {
                console.error('Error fetching events:', error);
                // Fallback to static data if Supabase fails
                setEvents(defaultEvents);
            } else {
                // Transform Supabase data to match app format
                const formattedEvents = data.map(event => ({
                    id: event.id,
                    date: event.event_date,
                    // Add T12:00:00 to avoid timezone shifting the date by one day
                    dateObj: new Date(event.event_date + 'T12:00:00'),
                    type: event.type,
                    title: event.title,
                    responsibles: {
                        logistica: event.logistica || 'N/A',
                        comunicacion: event.comunicacion || 'N/A'
                    },
                    time: event.time || '',
                    description: event.description || ''
                }));
                setEvents(formattedEvents);
            }
        } catch (err) {
            console.error('Supabase connection error:', err);
            setEvents(defaultEvents);
        }
        setLoading(false);
    };

    const addEvent = async (newEvent) => {
        const { data, error } = await supabase
            .from('events')
            .insert([{
                event_date: newEvent.dateObj.toISOString().split('T')[0],
                type: newEvent.type,
                title: newEvent.title,
                logistica: newEvent.responsibles.logistica,
                comunicacion: newEvent.responsibles.comunicacion,
                time: newEvent.time,
                description: newEvent.description
            }])
            .select();

        if (!error && data) {
            await fetchEvents(); // Refresh the list
        }
    };

    const updateEvent = async (updatedEvent) => {
        const { error } = await supabase
            .from('events')
            .update({
                event_date: updatedEvent.dateObj.toISOString().split('T')[0],
                type: updatedEvent.type,
                title: updatedEvent.title,
                logistica: updatedEvent.responsibles.logistica,
                comunicacion: updatedEvent.responsibles.comunicacion,
                time: updatedEvent.time,
                description: updatedEvent.description
            })
            .eq('id', updatedEvent.id);

        if (!error) {
            await fetchEvents();
        }
    };

    const deleteEvent = async (id) => {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (!error) {
            await fetchEvents();
        }
    };

    return (
        <EventContext.Provider value={{ events, loading, addEvent, updateEvent, deleteEvent, refetch: fetchEvents }}>
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
