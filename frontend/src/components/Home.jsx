import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const OptiScrapeHome = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [mouseStart, setMouseStart] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef(null);

  const texts = [
    "Optimize Your Website's SEO",
    "AI-Powered Meta Tag Analysis",
    "Get Actionable SEO Insights"
  ];

  // Handle swipe up/down for touch devices
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleSwipe(touchStart, touchEnd);
  };

  // Handle mouse swipe up/down
  const handleMouseDown = (e) => {
    setMouseStart(e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    setTouchEnd(e.clientY);
  };

  const handleMouseUp = () => {
    handleSwipe(mouseStart, touchEnd);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Common swipe handler
  const handleSwipe = (start, end) => {
    if (start - end > 50) {
      // Swipe up
      changeText(1);
    } else if (end - start > 50) {
      // Swipe down
      changeText(-1);
    }
  };

  // Animated text change
  const changeText = (direction) => {
    controls.start({
      y: direction > 0 ? -20 : 20,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
      setCurrentTextIndex(prev => 
        (prev + direction + texts.length) % texts.length
      );
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      });
    });
  };

  // Auto-rotate text
  useEffect(() => {
    const interval = setInterval(() => {
      changeText(1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#FFF8F2] to-[#FFE8D9] flex flex-col items-center justify-center p-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div className="max-w-4xl w-full text-center">
        {/* Animated Headline */}
        <div className="h-24 md:h-32 flex items-center justify-center mb-8 overflow-hidden">
          <motion.h1
            animate={controls}
            className="text-3xl md:text-5xl font-bold text-[#333] cursor-ns-resize"
          >
            {texts[currentTextIndex]}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-[#555] mb-12 max-w-2xl mx-auto"
        >
          Transform your website's performance with our AI-powered SEO analyzer. Get professional, tailored recommendations in minutes.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FF7B25] hover:bg-[#E56A1B] text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-colors"
        >
          Analyze Your Site
        </motion.button>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-[#777]"
        >
          <p>Swipe up/down or click and drag to see more</p>
          <p className="mt-4">Who built this?</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OptiScrapeHome;