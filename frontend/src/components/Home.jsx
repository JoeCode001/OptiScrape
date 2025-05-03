import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaChartLine, FaSearch, FaToolbox } from 'react-icons/fa';

const OptiScrapeHome = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

    const features = [
        {
            icon: <FaRobot className="text-xl" />,
            title: "AI-Powered Meta Analysis",
        },
        {
            icon: <FaChartLine className="text-xl" />,
            title: "Performance Metrics",
        },
        {
            icon: <FaSearch className="text-xl" />,
            title: "Deep Analysis",
        }
    ];

    const headlines = [
        { first: "Optimize Your", second: "Website SEO" },
        { first: "AI-Powered", second: "Meta Analysis" },
        { first: "Get Actionable", second: "SEO Insights" }
    ];

    // Auto-rotate text and features independently
    useEffect(() => {
        const textInterval = setInterval(() => {
            setCurrentTextIndex(prev => (prev + 1) % headlines.length);
        }, 5000);

        const featureInterval = setInterval(() => {
            setCurrentFeatureIndex(prev => (prev + 1) % features.length);
        }, 5000);

        return () => {
            clearInterval(textInterval);
            clearInterval(featureInterval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
            <div className="max-w-6xl w-full text-center">
                {/* Features Badge - Animates independently */}
                <div className="w-full flex flex-col items-center mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`feature-${currentFeatureIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="py-2 px-4 rounded-full flex gap-3 items-center justify-center border border-[#FF7B25] bg-gray-900"
                        >
                            <div className="text-[#FF7B25]">
                                {features[currentFeatureIndex].icon}
                            </div>
                            <h3 className="text-lg font-bold text-[#FF7B25]">
                                {features[currentFeatureIndex].title}
                            </h3>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Split Animated Headline - Animates independently */}
                <div className="h-48 flex flex-col items-center justify-center mb-12 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`first-${currentTextIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-7xl font-bold text-white"
                        >
                            {headlines[currentTextIndex].first}
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`second-${currentTextIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl md:text-7xl font-bold text-[#FF7B25] mt-2"
                        >
                            {headlines[currentTextIndex].second}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-8 flex flex-col gap-6 items-center"
                >
                    <motion.p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Gain competitive advantage with intelligent SEO recommendations tailored to your website's unique architecture and content profile.
                    </motion.p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#FF7B25] hover:bg-[#E56A1B] text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-colors mb-4 w-[8cm] flex items-center justify-center gap-3"
                    >
                        <motion.div
                           animate={{ x: [0, 4, 0] }}
                           transition={{
                               repeat: Infinity,
                               repeatType: "loop",
                               duration: 2,
                               ease: "easeInOut"
                           }}
                        >
                            <FaToolbox />
                        </motion.div>
                        Start SEO Analysis
                    </motion.button>

                    <a
                        href="https://joecode.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-gray-400 hover:text-[#FF7B25] transition-colors text-sm"
                    >
                        Who built this?
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default OptiScrapeHome;