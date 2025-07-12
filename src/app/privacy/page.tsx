'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaFileAlt, FaCookieBite, FaEnvelope, FaLock, FaHandshake } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sections = [
  {
    id: 1,
    title: 'Общие положения',
    icon: <FaShieldAlt className="w-6 h-6" />,
    content: `Настоящая политика конфиденциальности описывает принципы обработки и защиты информации о физических лицах, которые могут быть получены при посещении сайта GOLD ELEGANCE. Используя наш сайт, вы соглашаетесь с условиями данной политики конфиденциальности.`
  },
  {
    id: 2,
    title: 'Персональные данные',
    icon: <FaUserLock className="w-6 h-6" />,
    content: `Мы собираем следующие типы персональных данных:
    • Имя и контактная информация
    • Электронная почта
    • Номер телефона
    • Адрес (при необходимости доставки)
    Эти данные используются исключительно для обработки заказов и улучшения качества обслуживания.`
  },
  {
    id: 3,
    title: 'Цели обработки данных',
    icon: <FaFileAlt className="w-6 h-6" />,
    content: `Ваши персональные данные обрабатываются в следующих целях:
    • Оформление и выполнение заказов
    • Информирование о статусе заказа
    • Ответы на ваши запросы и вопросы
    • Улучшение качества обслуживания
    • Отправка информационных материалов (с вашего согласия)`
  },
  {
    id: 4,
    title: 'Использование cookies',
    icon: <FaCookieBite className="w-6 h-6" />,
    content: `Мы используем файлы cookies для улучшения работы сайта и персонализации вашего опыта. Cookies помогают нам анализировать взаимодействие пользователей с сайтом и совершенствовать его функциональность. Вы можете отключить использование cookies в настройках вашего браузера.`
  },
  {
    id: 5,
    title: 'Защита информации',
    icon: <FaLock className="w-6 h-6" />,
    content: `Мы принимаем все необходимые технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения. Доступ к персональным данным имеют только уполномоченные сотрудники компании.`
  },
  {
    id: 6,
    title: 'Связь с нами',
    icon: <FaEnvelope className="w-6 h-6" />,
    content: `По всем вопросам, касающимся обработки персональных данных, вы можете связаться с нами:
    • По электронной почте: info@goldelegance.kg
    • По телефону: +996 (500) 123-456
    • Через форму обратной связи на сайте`
  },
  {
    id: 7,
    title: 'Изменения политики',
    icon: <FaHandshake className="w-6 h-6" />,
    content: `Мы оставляем за собой право вносить изменения в данную политику конфиденциальности. Все изменения будут опубликованы на этой странице. Продолжая использовать наш сайт после внесения изменений, вы соглашаетесь с обновленными условиями.`
  }
];

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="bg-black min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-6">
              Политика конфиденциальности
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Мы ценим ваше доверие и заботимся о защите ваших персональных данных
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-[#976726]/20 hover:border-[#976726]/40 transition-all duration-500 group"
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#976726] to-[#e8b923] flex items-center justify-center text-black"
                  >
                    {section.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#caa545] mb-4 group-hover:text-[#e8b923] transition-colors duration-300">
                      {section.title}
                    </h2>
                    <div className="text-gray-400 space-y-2 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 text-center text-gray-400 text-sm"
          >
            Последнее обновление: {new Date().toLocaleDateString()}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
} 