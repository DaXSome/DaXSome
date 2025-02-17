'use client';
import { motion } from 'framer-motion';
import { useLoadingStore } from '@/states/app';

export default function Loader() {
    const size = 100;
    const color = '#4F46E5';
    const glowColor = '#818CF8';

    const { loading } = useLoadingStore();

    if (!loading) return;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Base circle */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: `${size / 20}px solid ${color}`,
                        borderTopColor: 'transparent',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                    }}
                />

                {/* Data streams */}
                {[...Array(3)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="absolute inset-0 rounded-full"
                        style={{
                            border: `${size / 40}px solid ${color}`,
                            borderTopColor: 'transparent',
                            borderLeftColor: 'transparent',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                            delay: index * 0.2,
                        }}
                    />
                ))}

                {/* Pulsating glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        boxShadow: `0 0 ${size / 5}px ${glowColor}`,
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                    }}
                />

                {/* Center dot */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: size / 5,
                        height: size / 5,
                        backgroundColor: color,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </div>
    );
}
