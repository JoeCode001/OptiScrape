import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaChartLine, FaSearch, FaToolbox, FaTimes } from 'react-icons/fa';
// import Result from './Result';
import axios from 'axios';
import PageSpeedReport from './PageSpeedResult';

const OptiScrapeHome = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [checks, setChecks] = useState({
        seoAnalyzer: false,
        pageSpeed: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

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
    const[seo, setSeo] = useState({})
    const[pageSpeed, setPageSpeed] = useState({})

    const headlines = [
        { first: "Optimize Your", second: "Website SEO" },
        { first: "AI-Powered", second: "Meta Analysis" },
        { first: "Get Actionable", second: "SEO Insights" }
    ];

    // Auto-rotate text and features
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

    const handleCheckChange = (e) => {
        const { name, checked } = e.target;
        setChecks(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const analyzeSEO = async () => {
        if (!url) {
            setError("Please enter a URL");
            return;
        }

        if (!checks.seoAnalyzer && !checks.pageSpeed) {
            setError("Please select at least one analysis type");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let responses = {};

            if (checks.seoAnalyzer) {
                const seoResponse = await axios.get(`http://localhost:8000/analyze`, {
                    params: { url },
                    headers: { 'Content-Type': 'application/json' }
                });
                responses.seo = seoResponse.data;
                setSeo( responses.seo)
            }

            if (checks.pageSpeed) {
                const speedResponse = await axios.get(`http://localhost:8000/pagespeed`, {
                    params: { url },
                    headers: { 'Content-Type': 'application/json' }
                });
                responses.pageSpeed = speedResponse.data;
                setPageSpeed(responses.pageSpeed)
            }

            setResult(responses);
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to analyze URL");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative">
            {/* Main Content */}
            <div className="max-w-6xl w-full text-center">
                {/* Features Badge */}
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

                {/* Split Animated Headline */}
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
                        onClick={() => setIsModalOpen(true)}
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

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-[#FF7B25]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-[#FF7B25]">Website Analysis</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        id="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-[#FF7B25] focus:ring-1 focus:ring-[#FF7B25] outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Analysis Type
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="seoAnalyzer"
                                                checked={checks.seoAnalyzer}
                                                onChange={handleCheckChange}
                                                className="form-checkbox h-5 w-5 text-[#FF7B25] rounded focus:ring-[#FF7B25] border-gray-600 bg-gray-700"
                                            />
                                            <span className="ml-2 text-gray-300">SEO Analyzer</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="pageSpeed"
                                                checked={checks.pageSpeed}
                                                onChange={handleCheckChange}
                                                className="form-checkbox h-5 w-5 text-[#FF7B25] rounded focus:ring-[#FF7B25] border-gray-600 bg-gray-700"
                                            />
                                            <span className="ml-2 text-gray-300">Page Speed Check</span>
                                        </label>
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-sm">{error}</div>
                                )}

                                <button
                                    onClick={analyzeSEO}
                                    disabled={loading}
                                    className="w-full bg-[#FF7B25] hover:bg-[#E56A1B] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </>
                                    ) : (
                                        "Run Analysis"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {pageSpeed  !== null? (
             <div className='w-full overflow-hidden mt-[5rem]'>
                <PageSpeedReport data={pageSpeed} />
             </div>
            ): (
                <div></div>
            )}

        </div>
    );
};

export default OptiScrapeHome;