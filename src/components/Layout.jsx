import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative font-sans text-brand-blue overflow-hidden bg-slate-50">
            {/* Institutional Background with Brand Colors */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Dynamic Curve Shape */}
                <svg className="absolute top-0 right-0 w-[60%] h-[80%] opacity-10 text-brand-blue" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 L100 0 L100 100 Q50 50 0 0 Z" fill="currentColor" />
                </svg>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-brand-orange opacity-5 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 w-full h-screen flex flex-col">
                {children}
            </main>

            {/* Official Stripe Footer */}
            <div className="fixed bottom-0 left-0 w-full h-3 bg-brand-orange z-50"></div>
            <div className="fixed bottom-3 left-0 w-full h-1 bg-brand-blue z-50"></div>
        </div>
    );
};

export default Layout;
