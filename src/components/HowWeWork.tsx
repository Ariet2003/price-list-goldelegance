'use client';

import { motion } from 'framer-motion';
import { FaWpforms, FaHandshake, FaMagic, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    title: 'Оставляете заявку',
    icon: <FaWpforms className="text-2xl sm:text-3xl" />,
  },
  {
    id: 2,
    title: 'Согласовываем',
    icon: <FaHandshake className="text-2xl sm:text-3xl" />,
  },
  {
    id: 3,
    title: 'Изготавливаем',
    icon: <FaMagic className="text-2xl sm:text-3xl" />,
  },
  {
    id: 4,
    title: 'Реализуем',
    icon: <FaCheckCircle className="text-2xl sm:text-3xl" />,
  },
];

const HowWeWork = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black" id="how-we-work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gold-gradient mb-4 sm:mb-6">
            Как мы работаем
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4">
            Простой и эффективный процесс работы для воплощения ваших идей в реальность
          </p>
        </motion.div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 scrollbar-hide">
          <div className="flex flex-nowrap gap-4 sm:gap-6 lg:gap-8 min-w-full sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group flex-none w-[260px] sm:w-auto"
              >
                <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-6 sm:p-8 border border-[#976726]/20 hover:border-[#976726]/40 transition-all duration-500 before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-500 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-[#976726]/5 before:via-[#e8b923]/5 before:to-[#976726]/5 before:-z-10">
                  <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#976726] to-[#e8b923] text-black mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-medium text-[#caa545] mb-2 transition-all duration-300 group-hover:text-[#e8b923]">
                      {step.title}
                    </h3>
                    {/* Стрелка для десктопа */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5">
                        <div className="w-full h-full bg-gradient-to-r from-[#976726] to-transparent"></div>
                      </div>
                    )}
                    {/* Стрелка для мобильных */}
                    {index < steps.length - 1 && (
                      <div className="block sm:hidden absolute top-1/2 -right-2 transform -translate-y-1/2">
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="text-[#976726]"
                        >
                          <path 
                            d="M5 12h14m-4-4l4 4-4 4" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork; 