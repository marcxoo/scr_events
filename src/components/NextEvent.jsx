import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Mascot from './Mascot';

const NextEvent = ({ event }) => {
    if (!event) return null;

    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-8 bg-white overflow-hidden relative">

            {/* BRAND SHAPE BACKGROUND */}
            <div className="absolute top-0 left-0 w-[40%] h-full bg-brand-blue skew-x-[-10deg] -ml-[10%] z-0"></div>
            <div className="absolute bottom-0 right-0 w-[30%] h-[40%] bg-brand-orange/10 rounded-tl-[100px] z-0"></div>

            <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-12 relative z-10">

                {/* LEFT: Mascot Area (Over blue background) */}
                {/* LEFT: Mascot Area (Over blue background) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 flex flex-col items-center justify-center text-white text-center relative h-full"
                >


                    <div className="relative w-full max-w-[650px] mt-12 md:mt-0">
                        <Mascot className="w-full drop-shadow-2xl scale-125" />
                    </div>
                </motion.div>

                {/* RIGHT: Content Area */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-[1.5] w-full"
                >
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-6 h-6">
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inline-flex h-full w-full rounded-full bg-brand-orange/50"
                                ></motion.span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange shadow-sm"></span>
                            </div>
                            <span className="text-brand-orange font-bold text-sm md:text-base uppercase tracking-[0.2em]">
                                Próximo Evento
                            </span>
                        </div>

                        <span className="hidden md:block w-px h-6 bg-slate-200"></span>

                        <span className="px-4 py-1.5 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transform hover:scale-105 transition-transform">
                            {event.type}
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-blue leading-tight mb-8">
                        {event.title}
                    </h1>

                    <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mb-12">
                        {event.description}
                    </p>

                    {/* Details Section - Refined & Balanced */}
                    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl mt-8 p-6 bg-white rounded-2xl shadow-lg shadow-slate-200/50 relative z-20 border border-slate-100/50">
                        {/* Date */}
                        <div className="flex items-center gap-5 flex-1 border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6">
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    backgroundColor: ["rgba(249, 115, 22, 0.1)", "rgba(249, 115, 22, 0.25)", "rgba(249, 115, 22, 0.1)"],
                                    boxShadow: ["0 0 0 0px rgba(249, 115, 22, 0)", "0 0 0 4px rgba(249, 115, 22, 0.1)", "0 0 0 0px rgba(249, 115, 22, 0)"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-14 h-14 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center shrink-0"
                            >
                                <Calendar size={28} strokeWidth={2} />
                            </motion.div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                    {event.dateObj.toLocaleDateString('es-ES', { weekday: 'long' })}
                                </p>
                                <div className="flex items-baseline gap-2 leading-none">
                                    <span className="text-3xl font-black text-brand-blue tracking-tight">
                                        {event.dateObj.getDate()}
                                    </span>
                                    <span className="text-3xl font-black text-brand-blue uppercase mb-1">DE</span>
                                    <span className="text-3xl font-black text-brand-blue uppercase">
                                        {event.dateObj.toLocaleDateString('es-ES', { month: 'long' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-5 flex-1 pt-5 md:pt-0 md:pl-6">
                            <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                                <Clock size={28} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Horario</p>
                                <p className="text-3xl font-black text-brand-blue leading-none tracking-tight">
                                    {event.time.split('-')[0].replace('H', ':')}
                                    <span className="text-slate-300 mx-1.5 font-light">-</span>
                                    {event.time.split('-')[1].replace('H', ':')}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default NextEvent;
