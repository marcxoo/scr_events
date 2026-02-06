import React from 'react';
import { motion } from 'framer-motion';
import tigerImage from '../TIGREEE1111.png';

const Mascot = ({ className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className={`relative z-10 ${className}`}
        >
            <img
                src={tigerImage}
                alt="Institutional Mascot"
                className="w-full h-auto object-contain"
            />
        </motion.div>
    );
};

export default Mascot;
