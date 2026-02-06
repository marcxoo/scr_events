import React from 'react';
import { motion } from 'framer-motion';
import logoEmprendimiento from '../logo-emprendimientosinfondo.png';

const EventList = ({ events }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="w-full h-full flex flex-col relative p-6 md:p-12 overflow-hidden">

            {/* HEADER with Logo */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 relative z-20">
                <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-4 py-2 bg-brand-orange/10 text-brand-orange font-bold text-sm tracking-wider uppercase rounded-lg mb-3">
                        Coordinación de Emprendimiento
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-brand-blue leading-tight">
                        EVENTOS <span className="text-brand-orange">FEBRERO</span> 2026
                    </h1>
                </div>

                <div className="w-64 md:w-96 flex items-center justify-center -mt-4 md:-mt-0 md:mr-12">
                    <img src={logoEmprendimiento} alt="Logo Emprendimiento" className="w-full object-contain" />
                </div>
            </div>

            {/* EVENTS GRID */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-12"
            >
                {events.map((event, index) => {
                    const day = event.dateObj.getDate();
                    const month = event.dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
                    const weekday = event.dateObj.toLocaleDateString('es-ES', { weekday: 'long' });

                    // Check if event is past
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const eventDate = new Date(event.dateObj);
                    eventDate.setHours(0, 0, 0, 0);
                    const isPast = eventDate < today;

                    return (
                        <motion.div
                            key={event.id}
                            variants={itemVariants}
                            className={`group bg-white rounded-2xl p-0 shadow-md border border-slate-100 overflow-hidden transition-all duration-300 ${isPast ? 'opacity-60 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            <div className="flex h-full">
                                {/* Date Side */}
                                <div className="w-28 bg-brand-blue text-white flex flex-col items-center justify-center p-4 relative overflow-hidden group-hover:bg-brand-orange transition-colors duration-300">
                                    {/* Elegant soft glow effect - only for future events */}
                                    {!isPast && (
                                        <>
                                            <motion.div
                                                animate={{
                                                    opacity: [0, 0.15, 0],
                                                    scale: [0.8, 1.2, 0.8]
                                                }}
                                                transition={{
                                                    duration: 6,
                                                    repeat: Infinity,
                                                    delay: index * 1.5,
                                                    ease: "easeInOut"
                                                }}
                                                className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/30 to-white/0 blur-xl"
                                            />
                                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                        </>
                                    )}

                                    <span className="text-5xl font-bold leading-none relative z-10">{day < 10 ? `0${day}` : day}</span>
                                    <span className="text-sm font-semibold tracking-widest mt-1 uppercase opacity-90 relative z-10">{month}</span>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-brand-blue text-sm font-bold uppercase tracking-wide">
                                            {weekday}
                                        </span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                                            {event.type}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-extrabold text-brand-blue mb-3 leading-snug group-hover:text-brand-orange transition-colors">
                                        {event.title}
                                    </h3>

                                    {/* Footer Logic: Only show if valid data exists */}
                                    {(() => {
                                        const showLog = event.responsibles.logistica && event.responsibles.logistica !== 'N/A';
                                        const showCom = event.responsibles.comunicacion && event.responsibles.comunicacion !== 'N/A';

                                        if (!showLog && !showCom) return null;

                                        return (
                                            <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-1 text-sm text-slate-700 font-medium">
                                                {showLog && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                                                        <span><span className="font-bold text-slate-900">Logística:</span> {event.responsibles.logistica}</span>
                                                    </div>
                                                )}
                                                {showCom && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0"></span>
                                                        <span><span className="font-bold text-slate-900">Coms:</span> {event.responsibles.comunicacion}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default EventList;
