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
        <div className="w-full h-full flex flex-col relative p-6 md:p-8 md:pb-4 overflow-hidden justify-center">

            {/* HEADER with Logo */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-0 md:mb-0 relative z-20">
                <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-4 py-2 bg-brand-orange/10 text-brand-orange font-bold text-sm tracking-wider uppercase rounded-lg mb-3">
                        Coordinación de Emprendimiento
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-brand-blue leading-tight">
                        EVENTOS <span className="text-brand-orange">FEBRERO</span> 2026
                    </h1>
                </div>

                <div className="w-64 md:w-96 2xl:w-[24rem] flex items-center justify-center -mt-8 md:-mt-0 md:mr-12 transition-all duration-300">
                    <img src={logoEmprendimiento} alt="Logo Emprendimiento" className="w-full object-contain" />
                </div>
            </div>

            {/* EVENTS GRID */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 2xl:gap-6 flex-1 content-start overflow-hidden pr-2"
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

                    // Check if event is one of the next 2 upcoming events
                    const upcomingEvents = events
                        .filter(e => {
                            const eDate = new Date(e.dateObj);
                            eDate.setHours(0, 0, 0, 0);
                            return eDate >= today;
                        })
                        .sort((a, b) => new Date(a.dateObj) - new Date(b.dateObj))
                        .slice(0, 3);
                    const isUpcoming = upcomingEvents.some(e => e.id === event.id);

                    // Determine special styling for specific dates
                    let specialStyle = null;
                    if (!isPast) {
                        if (day === 18) {
                            specialStyle = {
                                border: 'border-green-500/40',
                                shadow: 'shadow-green-500/20',
                                ring: 'ring-green-500/20',
                                shimmer: 'via-green-500/10',
                                text: 'text-green-600',
                                bg: 'bg-green-500',
                                glow: 'group-hover:text-green-500'
                            };
                        } else if (day === 19) {
                            specialStyle = {
                                border: 'border-yellow-500/40',
                                shadow: 'shadow-yellow-500/20',
                                ring: 'ring-yellow-500/20',
                                shimmer: 'via-yellow-500/10',
                                text: 'text-yellow-600',
                                bg: 'bg-yellow-500',
                                glow: 'group-hover:text-yellow-500'
                            };
                        } else if (day === 24) {
                            specialStyle = {
                                border: 'border-red-500/40',
                                shadow: 'shadow-red-500/20',
                                ring: 'ring-red-500/20',
                                shimmer: 'via-red-500/10',
                                text: 'text-red-600',
                                bg: 'bg-red-500',
                                glow: 'group-hover:text-red-500'
                            };
                        }
                    }

                    // Default upcoming style (brand-orange) if no special date matches
                    const borderClass = specialStyle
                        ? specialStyle.border
                        : 'border-brand-orange/40';
                    const shadowClass = specialStyle
                        ? specialStyle.shadow
                        : 'shadow-brand-orange/20';
                    const ringClass = specialStyle
                        ? specialStyle.ring
                        : 'ring-brand-orange/20';
                    const shimmerClass = specialStyle
                        ? specialStyle.shimmer
                        : 'via-brand-orange/10';

                    const hoverBgClass = specialStyle
                        ? `group-hover:${specialStyle.bg}`
                        : 'group-hover:bg-brand-orange';

                    const hoverTextClass = specialStyle
                        ? specialStyle.glow
                        : 'group-hover:text-brand-orange';

                    return (
                        <motion.div
                            key={event.id}
                            variants={itemVariants}
                            className={`group bg-white rounded-2xl p-0 shadow-md border overflow-hidden transition-all duration-300 relative ${isPast ? 'bg-slate-100 border-slate-200' : isUpcoming ? `${borderClass} ${shadowClass} shadow-lg ring-2 ${ringClass}` : 'border-slate-100 hover:shadow-xl hover:-translate-y-1'}`}
                            style={isPast ? { filter: 'grayscale(100%)', opacity: 0.6 } : {}}
                        >
                            {/* Shimmer effect for upcoming events */}
                            {isUpcoming && (
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-r from-transparent ${shimmerClass} to-transparent z-10 pointer-events-none`}
                                    animate={{
                                        x: ['-100%', '200%']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                            <div className="flex h-full relative z-0">
                                {/* Date Side */}
                                <div className={`w-28 md:w-32 2xl:w-40 bg-brand-blue text-white flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 shrink-0 ${!isPast ? hoverBgClass : ''}`}>
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

                                    <span className="text-5xl md:text-6xl 2xl:text-7xl font-bold leading-none relative z-10">{day < 10 ? `0${day}` : day}</span>
                                    <span className="text-sm md:text-base 2xl:text-lg font-semibold tracking-widest mt-1 uppercase opacity-90 relative z-10">{month}</span>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 py-6 px-6 2xl:py-8 2xl:px-8 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-brand-blue text-sm md:text-base 2xl:text-lg font-bold uppercase tracking-wide">
                                            {weekday}
                                        </span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] md:text-xs 2xl:text-sm font-bold uppercase">
                                            {event.type}
                                        </span>
                                    </div>

                                    <h3 className={`text-xl md:text-2xl 2xl:text-4xl font-extrabold text-brand-blue mb-3 leading-snug transition-colors ${!isPast ? hoverTextClass : ''}`}>
                                        {event.title}
                                    </h3>

                                    {/* Footer Logic: Only show if valid data exists */}
                                    {(() => {
                                        const showLog = event.responsibles.logistica && event.responsibles.logistica !== 'N/A';
                                        const showCom = event.responsibles.comunicacion && event.responsibles.comunicacion !== 'N/A';

                                        if (!showLog && !showCom) return null;

                                        return (
                                            <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-1 text-sm 2xl:text-lg text-slate-700 font-medium">
                                                {showLog && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 2xl:w-2.5 2xl:h-2.5 rounded-full bg-brand-orange shrink-0"></span>
                                                        <span><span className="font-bold text-slate-900">Logística:</span> {event.responsibles.logistica}</span>
                                                    </div>
                                                )}
                                                {showCom && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 2xl:w-2.5 2xl:h-2.5 rounded-full bg-brand-blue shrink-0"></span>
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
