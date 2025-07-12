'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    id: 1,
    question: 'Сколько стоят ваши услуги?',
    answer: 'Стоимость наших услуг зависит от масштаба мероприятия, выбранных материалов и сложности оформления. Мы разрабатываем индивидуальные предложения под ваш бюджет. Минимальная стоимость оформления начинается от 50 000 сом.',
  },
  {
    id: 2,
    question: 'Как заказать оформление мероприятия?',
    answer: 'Процесс заказа прост: оставьте заявку на сайте или позвоните нам, мы обсудим ваши пожелания, согласуем концепцию и бюджет, заключим договор и приступим к реализации. Рекомендуем обращаться минимум за 2-3 недели до мероприятия.',
  },
  {
    id: 3,
    question: 'Работаете ли вы за пределами города?',
    answer: 'Да, мы оформляем мероприятия не только в городе, но и в других регионах. Стоимость выезда обсуждается индивидуально и зависит от расстояния и масштаба оформления.',
  },
  {
    id: 4,
    question: 'Какие виды мероприятий вы оформляете?',
    answer: 'Мы оформляем все виды мероприятий: свадьбы, дни рождения, корпоративные события, презентации, открытия, выставки, детские праздники, юбилеи и другие торжественные события. Каждый проект уникален и разрабатывается индивидуально.',
  },
  {
    id: 5,
    question: 'Предоставляете ли вы эскизы оформления?',
    answer: 'Да, после обсуждения концепции мы разрабатываем детальные эскизы оформления. Это помогает наглядно представить конечный результат и внести необходимые корректировки до начала работ.',
  },
  {
    id: 6,
    question: 'Можно ли внести изменения в оформление после утверждения?',
    answer: 'Да, мы гибко подходим к пожеланиям клиентов. Изменения можно внести до начала монтажных работ. Однако существенные изменения могут повлиять на сроки и стоимость.',
  }
];

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gold-gradient mb-4 sm:mb-6">
            Часто задаваемые вопросы
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4">
            Ответы на популярные вопросы о наших услугах и процессе работы
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 text-left border border-[#976726]/20 hover:border-[#976726]/40 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-[#976726]/5 group-hover:via-[#e8b923]/5 group-hover:to-[#976726]/5"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-medium text-[#caa545] group-hover:text-[#e8b923] transition-colors duration-300 pr-8">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 absolute right-4 sm:right-6"
                  >
                    <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#976726]" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 