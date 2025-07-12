'use client';

import { motion } from 'framer-motion';
import { FaWpforms, FaHandshake, FaMagic, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    title: 'Оставляете заявку',
    icon: <FaWpforms className="text-3xl" />,
  },
  {
    id: 2,
    title: 'Согласовываем',
    icon: <FaHandshake className="text-3xl" />,
  },
  {
    id: 3,
    title: 'Изготавливаем',
    icon: <FaMagic className="text-3xl" />,
  },
  {
    id: 4,
    title: 'Реализуем',
    icon: <FaCheckCircle className="text-3xl" />,
  },
];

const HowWeWork = () => {
  return (
    <section className="py-20 bg-black" id="how-we-work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold gold-gradient mb-6">
            Как мы работаем
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Простой и эффективный процесс работы для воплощения ваших идей в реальность
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-[#976726]/20 hover:border-[#976726]/40 transition-all duration-500 before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-500 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-[#976726]/5 before:via-[#e8b923]/5 before:to-[#976726]/5 before:-z-10">
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div 
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#976726] to-[#e8b923] text-black mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-xl font-medium text-[#caa545] mb-2 transition-all duration-300 group-hover:text-[#e8b923]">
                    {step.title}
                  </h3>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5">
                      <div className="w-full h-full bg-gradient-to-r from-[#976726] to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork; 