import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, ArrowLeft, Calendar, Pencil } from 'lucide-react';

const AdminPage = () => {
    const { events, addEvent, updateEvent, deleteEvent } = useEvents();
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track ID if editing

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        type: 'Taller',
        customType: '', // Store custom type input
        logistica: '',
        comunicacion: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (event) => {
        setEditingId(event.id);

        // Reconstruct date string for input (YYYY-MM-DD)
        const dateObj = new Date(event.dateObj);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Check if type is in standard list
        const standardTypes = ['Taller', 'Webinar', '@Emprender', 'Emprendex', 'Bootcamp Parte I', 'Bootcamp Parte II', 'Bootcamp Parte III', 'Networking'];
        const isStandard = standardTypes.includes(event.type);

        setFormData({
            title: event.title,
            date: dateStr,
            time: event.time,
            type: isStandard ? event.type : 'Otro',
            customType: isStandard ? '' : event.type,
            logistica: event.responsibles.logistica,
            comunicacion: event.responsibles.comunicacion,
            description: event.description
        });
        setIsOpen(true);
    };

    const handleReset = () => {
        setIsOpen(false);
        setEditingId(null);
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
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Process Date
        const [year, month, day] = formData.date.split('-');
        const dateObj = new Date(year, month - 1, day);

        // Format DD/MM/YYYY for display legacy string
        const formattedDate = `${day}/${month}/${year}`;

        // Determine final type
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

        if (editingId) {
            updateEvent({ ...eventData, id: editingId });
        } else {
            addEvent(eventData);
        }

        handleReset();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold text-brand-blue">Gestor de Eventos</h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                title: '', date: '', time: '', type: 'Taller', customType: '', logistica: '', comunicacion: '', description: ''
                            });
                            setIsOpen(true);
                        }}
                        className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition"
                    >
                        <Plus size={20} />
                        Nuevo Evento
                    </button>
                </div>

                {/* Event List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Evento</th>
                                    <th className="p-4">Tipo</th>
                                    <th className="p-4">Responsables</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/50 transition">
                                        <td className="p-4 font-bold text-brand-blue whitespace-nowrap">
                                            {new Date(event.dateObj).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase()}
                                        </td>
                                        <td className="p-4 font-medium text-slate-700 max-w-md truncate">
                                            {event.title}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">
                                                {event.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {event.responsibles.logistica && <div>L: {event.responsibles.logistica}</div>}
                                            {event.responsibles.comunicacion && <div>C: {event.responsibles.comunicacion}</div>}
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-brand-blue hover:bg-blue-50 rounded-lg transition"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Estás seguro de eliminar este evento?')) deleteEvent(event.id)
                                                }}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-400">
                                            No hay eventos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Simple Modal for New Event */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 bg-brand-blue text-white flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Calendar size={20} /> {editingId ? 'Editar Evento' : 'Nuevo Evento'}
                            </h2>
                            <button onClick={handleReset} className="text-white/70 hover:text-white">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título del Evento</label>
                                <input
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    placeholder="Ej. Taller de Innovación..."
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora (Ej. 14H00-16H00)</label>
                                    <input
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                        placeholder="14H00-16H00"
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none bg-white mb-2"
                                >
                                    <option>Taller</option>
                                    <option>Webinar</option>
                                    <option>@Emprender</option>
                                    <option>Emprendex</option>
                                    <option>Bootcamp Parte I</option>
                                    <option>Bootcamp Parte II</option>
                                    <option>Bootcamp Parte III</option>
                                    <option>Networking</option>
                                    <option>Otro</option>
                                </select>

                                {formData.type === 'Otro' && (
                                    <input
                                        name="customType"
                                        required
                                        value={formData.customType}
                                        onChange={handleInputChange}
                                        placeholder="Escribe el nombre del tipo..."
                                        className="w-full p-2 border border-brand-orange/50 rounded-lg focus:ring-2 focus:ring-brand-orange/20 outline-none bg-orange-50/50"
                                    />
                                )}
                            </div>

                            {/* Responsibles */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resp. Logística</label>
                                    <input
                                        name="logistica"
                                        value={formData.logistica}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resp. Comunicación</label>
                                    <input
                                        name="comunicacion"
                                        value={formData.comunicacion}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={handleReset} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 bg-brand-orange text-white rounded-lg font-bold hover:brightness-95">
                                    {editingId ? 'Guardar Cambios' : 'Crear Evento'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPage;
