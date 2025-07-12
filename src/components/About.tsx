'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const features = [
    {
      title: "Индивидуальный подход",
      description: "Создаем уникальные концепции под каждое мероприятие",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
    },
    {
      title: "Профессиональная команда",
      description: "Опытные декораторы и дизайнеры с многолетним стажем",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
    },
    {
      title: "Премиальные материалы",
      description: "Используем только высококачественные материалы для декора",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-black" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold gold-gradient mb-6">
                О компании GOLD ELEGANCE
              </h2>
              <p className="text-lg text-gray-300">
                Мы специализируемся на создании уникального декора для всех видов мероприятий. 
                Наша команда профессионалов превращает любое пространство в волшебное место, 
                где каждая деталь продумана до мелочей.
              </p>
            </div>

            <div className="grid gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl gold-border p-[1px] bg-gradient-to-br from-[#976726] to-[#e8b923]">
                      <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium gold-gradient">{feature.title}</h3>
                    <p className="mt-2 text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div 
                className="aspect-square relative rounded-lg overflow-hidden gold-border p-[1px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/decoration-1.jpg"
                    alt="Декорация мероприятия"
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="aspect-square relative rounded-lg overflow-hidden gold-border p-[1px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/decoration-2.jpg"
                    alt="Оформление праздника"
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </motion.div>
            </div>
            <div className="space-y-4 mt-8">
              <motion.div 
                className="aspect-square relative rounded-lg overflow-hidden gold-border p-[1px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/decoration-3.jpg"
                    alt="Свадебная декорация"
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="aspect-square relative rounded-lg overflow-hidden gold-border p-[1px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/decoration-4.jpg"
                    alt="Праздничное оформление"
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 