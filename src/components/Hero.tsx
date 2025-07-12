'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black pt-30">
      {/* Background with overlay */}
      <div className="absolute top-24 left-0 right-0 bottom-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-80">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold gold-gradient mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          GOLD ELEGANCE
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
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
            className="btn-primary px-8 py-3 rounded-full text-lg font-medium inline-block text-black hover:scale-105 transition-transform"
          >
            Наши услуги
          </a>
        </motion.div>
      </div>
    </section>
  );
} 