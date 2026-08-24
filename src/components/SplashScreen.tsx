import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RinoLogo } from './RinoLogo';

interface SplashScreenProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, onDismiss }) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2200);

    return () => clearTimeout(timer);
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="rinoxpress-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-900 select-none px-6"
        >
          {/* Subtle clean background light aura */}
          <div className="absolute w-96 h-96 bg-red-50/60 rounded-full blur-3xl pointer-events-none"></div>

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center max-w-sm"
          >
            {/* Official Logo */}
            <div className="p-4 rounded-3xl bg-white shadow-xl shadow-red-500/5 border border-gray-100 flex items-center justify-center mb-6">
              <RinoLogo size="2xl" variant="red" />
            </div>

            {/* Official Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg sm:text-xl font-medium tracking-wide text-gray-700 font-sans"
            >
              Aromas que dejan huella
            </motion.p>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-xs uppercase tracking-[0.25em] text-red-600 font-bold mt-2"
            >
              Córdoba • Argentina
            </motion.span>
          </motion.div>

          {/* Minimalist loading indicator bar at the bottom */}
          <div className="absolute bottom-12 flex flex-col items-center gap-3">
            <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full bg-red-600 rounded-full"
              />
            </div>
            <button
              onClick={onDismiss}
              className="text-xs text-gray-400 hover:text-red-600 transition-colors font-medium cursor-pointer"
            >
              Saltar intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
