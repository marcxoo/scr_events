import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Check,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    X
} from 'lucide-react';

const STANDARD_TYPES = [
    'Taller',
    'Webinar',
    '@Emprender',
    'Emprendex',
    'Bootcamp Parte I',
    'Bootcamp Parte II',
    'Bootcamp Parte III',
    'Networking'
];

function formatMonthUpper(dateLike) {
    const d = new Date(dateLike);
    return d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
}

function formatDay2(dateLike) {
    const d = new Date(dateLike);
    return String(d.getDate()).padStart(2, '0');
}

function formatYearMonth(dateLike) {
    const d = new Date(dateLike);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const AdminPage = () => {
    const { events, loading, error, dataSource, refetch, addEvent, updateEvent, deleteEvent } = useEvents();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Filters
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [monthFilter, setMonthFilter] = useState('Todos');

    const searchInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        type: 'Taller',
        customType: '',
        logistica: '',
        comunicacion: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormError('');
        setIsSaving(false);
        setFormData({
            title: '',
            date: '',
            time: '',
            type: 'Taller',
            customType: '',
            logistica: '',
            comunicacion: '',
            description: ''
        });
        setIsOpen(true);
    };

    const handleEdit = (event) => {
        setEditingId(event.id);
        setFormError('');
        setIsSaving(false);

        // Reconstruct date string for input (YYYY-MM-DD)
        const dateObj = new Date(event.dateObj);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const isStandard = STANDARD_TYPES.includes(event.type);

        setFormData({
            title: event.title,
            date: dateStr,
            time: event.time,
            type: isStandard ? event.type : 'Otro',
            customType: isStandard ? '' : event.type,
            logistica: event.responsibles.logistica === 'N/A' ? '' : event.responsibles.logistica,
            comunicacion: event.responsibles.comunicacion === 'N/A' ? '' : event.responsibles.comunicacion,
            description: event.description
        });
        setIsOpen(true);
    };

    const handleReset = () => {
        setIsOpen(false);
        setEditingId(null);
        setIsSaving(false);
        setFormError('');
        setFormData({
            title: '',
            date: '',
            time: '',
            type: 'Taller',
            customType: '',
            logistica: '',
            comunicacion: '',
            description: ''
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') handleReset();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // Focus search on first load and allow Cmd/Ctrl+K shortcut to jump to it.
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }

        const onKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const monthOptions = useMemo(() => {
        const set = new Set();
        for (const e of events) set.add(formatYearMonth(e.dateObj));
        return Array.from(set).sort();
    }, [events]);

    const typeOptions = useMemo(() => {
        const set = new Set();
        for (const e of events) set.add(e.type);
        const fromData = Array.from(set).filter(Boolean);

        const standard = STANDARD_TYPES.filter((t) => fromData.includes(t));
        const custom = fromData.filter((t) => !STANDARD_TYPES.includes(t)).sort((a, b) => a.localeCompare(b, 'es'));
        return [...standard, ...custom];
    }, [events]);

    const filteredEvents = useMemo(() => {
        const q = query.trim().toLowerCase();
        return events.filter((e) => {
            const matchesQuery =
                q.length === 0 ||
                e.title?.toLowerCase().includes(q) ||
                e.type?.toLowerCase().includes(q) ||
                e.responsibles?.logistica?.toLowerCase().includes(q) ||
                e.responsibles?.comunicacion?.toLowerCase().includes(q);

            const matchesType = typeFilter === 'Todos' ? true : e.type === typeFilter;
            const matchesMonth = monthFilter === 'Todos' ? true : formatYearMonth(e.dateObj) === monthFilter;

            return matchesQuery && matchesType && matchesMonth;
        });
    }, [events, monthFilter, query, typeFilter]);

    const upcomingCount = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return events.filter(e => new Date(e.dateObj) >= startOfToday).length;
    }, [events]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        setFormError('');
        setIsSaving(true);

        // Process Date
        const [year, month, day] = formData.date.split('-');
        // Noon local time avoids timezone shifting when stored as ISO date.
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);

        // Format DD/MM/YYYY for display legacy string
        const formattedDate = `${day}/${month}/${year}`;

        const finalType = formData.type === 'Otro' ? formData.customType : formData.type;

        const eventData = {
            title: formData.title,
            date: formattedDate,
            dateObj: dateObj,
            type: finalType,
            time: formData.time,
            description: formData.description,
            responsibles: {
                logistica: formData.logistica,
                comunicacion: formData.comunicacion
            }
        };

        const result = editingId
            ? await updateEvent({ ...eventData, id: editingId })
            : await addEvent(eventData);

        if (!result?.ok) {
            setFormError('No se pudo guardar el evento. Revisa tu conexión e inténtalo de nuevo.');
            setIsSaving(false);
            return;
        }

        handleReset();
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto px-6 py-6 md:px-10 md:py-10">
                {/* Top bar */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <Link
                                to="/"
                                className="mt-0.5 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-blue hover:border-slate-300 transition"
                                aria-label="Volver a la pantalla"
                                title="Volver"
                            >
                                <ArrowLeft size={18} />
                            </Link>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-brand-blue">
                                        Gestor de Eventos
                                    </h1>
                                    {dataSource === 'fallback' && (
                                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                                            <AlertTriangle size={14} />
                                            Modo sin conexión
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mt-1">
                                    Crea, edita y organiza la agenda de la Coordinación de Emprendimiento.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
                                title="Actualizar lista"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                <span className="hidden sm:inline text-sm font-semibold">Actualizar</span>
                            </button>

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white font-bold shadow-sm hover:brightness-95 transition"
                            >
                                <Plus size={18} />
                                Nuevo evento
                            </button>
                        </div>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm flex items-start gap-3">
                            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                            <div className="leading-snug">
                                <div className="font-semibold">No se pudo sincronizar con Supabase.</div>
                                <div className="text-rose-700/90">{error}</div>
                            </div>
                        </div>
                    )}

                    {/* Stats + filters */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white border border-slate-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-600">Eventos (total)</div>
                                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue">
                                    <Calendar size={18} />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <div className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">
                                    {events.length}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {upcomingCount} próximos
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border border-slate-200 p-4 lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Buscar
                                    </label>
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            ref={searchInputRef}
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Título, tipo, logística o comunicación…"
                                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    >
                                        <option value="Todos">Todos</option>
                                        {typeOptions.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Mes
                                    </label>
                                    <select
                                        value={monthFilter}
                                        onChange={(e) => setMonthFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    >
                                        <option value="Todos">Todos</option>
                                        {monthOptions.map((ym) => {
                                            const [y, m] = ym.split('-');
                                            const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                                            return (
                                                <option key={ym} value={ym}>
                                                    {label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event list */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Agenda</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Título</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Tipo</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Responsables</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                                            <span className="inline-flex items-center gap-2 font-semibold">
                                                <RefreshCw size={16} className="animate-spin" />
                                                Cargando eventos…
                                            </span>
                                        </td>
                                    </tr>
                                )}

                                {!loading && filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/60 transition">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-3">
                                                <div className="w-12 rounded-xl border border-slate-200 bg-white overflow-hidden">
                                                    <div className="px-2 py-1 text-[10px] font-extrabold tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 text-center">
                                                        {formatMonthUpper(event.dateObj)}
                                                    </div>
                                                    <div className="py-1 text-center text-lg font-extrabold tabular-nums text-brand-blue">
                                                        {formatDay2(event.dateObj)}
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-semibold text-slate-600 capitalize">
                                                        {new Date(event.dateObj).toLocaleDateString('es-ES', { weekday: 'long' })}
                                                    </div>
                                                    <div className="mt-0.5 inline-flex items-center gap-2">
                                                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                                                            {event.time || 'Sin hora'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900 leading-snug">
                                                {event.title}
                                            </div>
                                            {event.description ? (
                                                <div className="text-xs text-slate-500 mt-1 max-w-176 truncate">
                                                    {event.description}
                                                </div>
                                            ) : null}
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/10 text-xs font-bold">
                                                {event.type}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-xs text-slate-600">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold">
                                                        L
                                                    </span>
                                                    <span className="truncate">{event.responsibles.logistica || '—'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold">
                                                        C
                                                    </span>
                                                    <span className="truncate">{event.responsibles.comunicacion || '—'}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(event)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/10 transition"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                    <span className="hidden md:inline text-sm font-semibold">Editar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const ok = confirm(`¿Eliminar “${event.title}”?`);
                                                        if (!ok) return;
                                                        await deleteEvent(event.id);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                    <span className="hidden md:inline text-sm font-semibold">Eliminar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!loading && filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-14 text-center">
                                            <div className="mx-auto max-w-md">
                                                <div className="text-lg font-extrabold text-slate-900">No hay resultados</div>
                                                <div className="text-sm text-slate-600 mt-1">
                                                    Prueba cambiando los filtros o crea un nuevo evento.
                                                </div>
                                                <div className="mt-4 flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setQuery('');
                                                            setTypeFilter('Todos');
                                                            setMonthFilter('Todos');
                                                        }}
                                                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-semibold"
                                                    >
                                                        Limpiar filtros
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={openCreateModal}
                                                        className="px-4 py-2 rounded-xl bg-brand-orange text-white hover:brightness-95 transition font-bold"
                                                    >
                                                        Crear evento
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-event-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) handleReset();
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200">
                        <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
                            <div className="px-6 py-5 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h2 id="admin-event-modal-title" className="text-xl font-extrabold tracking-tight text-slate-900">
                                            {editingId ? 'Editar evento' : 'Nuevo evento'}
                                        </h2>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Completa los detalles y asigna responsables (Logística / Comunicación).
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
                                    aria-label="Cerrar"
                                    title="Cerrar"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {formError && (
                                <div className="px-6 pb-5">
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm flex items-start gap-3">
                                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                                        <div className="leading-snug">
                                            <div className="font-semibold">No se pudo guardar.</div>
                                            <div className="text-rose-700/90">{formError}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Título del evento</label>
                                <input
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    placeholder="Ej. Taller de Innovación…"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hora</label>
                                <input
                                    name="time"
                                    required
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    placeholder="Ej. 14H00-16H00"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    >
                                        {STANDARD_TYPES.map((t) => (
                                            <option key={t}>{t}</option>
                                        ))}
                                        <option>Otro</option>
                                    </select>

                                    {formData.type === 'Otro' ? (
                                        <input
                                            name="customType"
                                            required
                                            value={formData.customType}
                                            onChange={handleInputChange}
                                            placeholder="Escribe el nombre del tipo…"
                                            className="w-full px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                                        />
                                    ) : (
                                        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm">
                                            <Check size={16} />
                                            Selección estándar
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responsables</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Recomendado para coordinación interna.
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Logística</label>
                                <input
                                    name="logistica"
                                    value={formData.logistica}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    placeholder="Nombre…"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Comunicación</label>
                                <input
                                    name="comunicacion"
                                    value={formData.comunicacion}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300"
                                    placeholder="Nombre…"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-slate-300 resize-none"
                                    placeholder="Resumen breve para mostrar en pantalla…"
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="sm:flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="sm:flex-1 py-2.5 rounded-xl bg-brand-orange text-white hover:brightness-95 transition font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isSaving}
                                >
                                    <span className="inline-flex items-center justify-center gap-2">
                                        {isSaving ? <RefreshCw size={16} className="animate-spin" /> : null}
                                        {editingId ? (isSaving ? 'Guardando…' : 'Guardar cambios') : (isSaving ? 'Creando…' : 'Crear evento')}
                                    </span>
                                </button>
                            </div>

                            <div className="md:col-span-2 text-xs text-slate-500">
                                Consejo: usa horarios con formato consistente (ej. <span className="font-semibold">14H00-16H00</span>) para que la pantalla se vea uniforme.
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
