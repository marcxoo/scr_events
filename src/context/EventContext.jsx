/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { eventsData as defaultEvents } from '../data/events';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 'supabase' | 'fallback'
    const [dataSource, setDataSource] = useState('supabase');

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true });

            if (error) {
                console.error('Error fetching events:', error);
                setError(error?.message || 'Error fetching events');
                // Fallback to static data if Supabase fails
                setEvents(defaultEvents);
                setDataSource('fallback');
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
                setDataSource('supabase');
            }
        } catch (err) {
            console.error('Supabase connection error:', err);
            setError(err?.message || 'Supabase connection error');
            setEvents(defaultEvents);
            setDataSource('fallback');
        }
        setLoading(false);
    };

    // Fetch events from Supabase on mount
    useEffect(() => {
        // Defer to avoid synchronous setState within effect body (ESLint rule).
        let cancelled = false;
        Promise.resolve().then(() => {
            if (cancelled) return;
            fetchEvents();
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const addEvent = async (newEvent) => {
        setError(null);
        try {
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

            if (error) {
                setError(error?.message || 'Error creating event');
                return { ok: false, error };
            }

            if (data) {
                await fetchEvents(); // Refresh the list
            }
            return { ok: true };
        } catch (err) {
            setError(err?.message || 'Error creating event');
            return { ok: false, error: err };
        }
    };

    const updateEvent = async (updatedEvent) => {
        setError(null);
        try {
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

            if (error) {
                setError(error?.message || 'Error updating event');
                return { ok: false, error };
            }

            await fetchEvents();
            return { ok: true };
        } catch (err) {
            setError(err?.message || 'Error updating event');
            return { ok: false, error: err };
        }
    };

    const deleteEvent = async (id) => {
        setError(null);
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) {
                setError(error?.message || 'Error deleting event');
                return { ok: false, error };
            }

            await fetchEvents();
            return { ok: true };
        } catch (err) {
            setError(err?.message || 'Error deleting event');
            return { ok: false, error: err };
        }
    };

    return (
        <EventContext.Provider value={{ events, loading, error, dataSource, addEvent, updateEvent, deleteEvent, refetch: fetchEvents }}>
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
