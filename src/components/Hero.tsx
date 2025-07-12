'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 mt-16 md:mt-0">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-6xl font-bold gold-gradient mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          GOLD ELEGANCE
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Создаем незабываемую атмосферу для ваших мероприятий
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <a
            href="#services"
            className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium inline-block text-black hover:scale-105 transition-transform"
          >
            Наши услуги
          </a>
        </motion.div>
      </div>
    </section>
  );
} 