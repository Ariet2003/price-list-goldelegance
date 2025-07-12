'use client';

import { motion } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaTelegram, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Если мы на главной странице и кликаем на "Главная"
    if (href === '/' && pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    // Если мы на другой странице и кликаем на "Главная"
    if (href === '/') {
      router.push('/');
      return;
    }

    // Если это якорная ссылка
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else if (pathname !== '/') {
        // Если элемента нет и мы не на главной странице,
        // переходим на главную и добавляем якорь в URL
        router.push('/' + href);
      }
    }
  };

  const navLinks = [
    { name: 'Главная', href: '/' },
    { name: 'О нас', href: '#about' },
    { name: 'Отзывы', href: '#reviews' },
    { name: 'Как мы работаем', href: '#how-we-work' },
    { name: 'FAQ', href: '#faq' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: <FaInstagram className="w-6 h-6" />, href: 'https://instagram.com' },
    { name: 'WhatsApp', icon: <FaWhatsapp className="w-6 h-6" />, href: 'https://wa.me/+996500123456' },
    { name: 'Telegram', icon: <FaTelegram className="w-6 h-6" />, href: 'https://t.me/goldelegance' },
  ];

  const contactInfo = [
    { icon: <FaPhone className="w-5 h-5" />, text: '+996 (500) 123-456', href: 'tel:+996500123456' },
    { icon: <FaMapMarkerAlt className="w-5 h-5" />, text: 'г. Бишкек, ул. Примерная 123', href: 'https://maps.google.com' },
    { icon: <FaEnvelope className="w-5 h-5" />, text: 'info@goldelegance.kg', href: 'mailto:info@goldelegance.kg' },
  ];

  return (
    <footer className="bg-black border-t border-[#976726]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <motion.a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image 
                src="/logo.png" 
                alt="Gold Elegance" 
                width={40} 
                height={40} 
                className="rounded-full"
              />
              <span className="text-2xl font-bold gold-gradient">
                GOLD ELEGANCE
              </span>
            </motion.a>
            <p className="text-gray-400 text-sm">
              Создаем незабываемую атмосферу для ваших мероприятий. Профессиональное оформление любых торжеств с безупречным вкусом и вниманием к деталям.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold gold-gradient mb-6">Навигация</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a 
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-400 hover:text-[#e8b923] transition-colors duration-300 cursor-pointer"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold gold-gradient mb-6">Контакты</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <span className="text-[#976726]">{info.icon}</span>
                  <a 
                    href={info.href}
                    className="text-gray-400 hover:text-[#e8b923] transition-colors duration-300"
                  >
                    {info.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold gold-gradient mb-6">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#976726]/10 text-[#976726] hover:bg-[#976726]/20 hover:text-[#e8b923] transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">График работы:</h4>
              <p className="text-gray-500">
                Пн-Сб: 9:00 - 18:00<br />
                Вс: Выходной
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#976726]/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} GOLD ELEGANCE. Все права защищены.
            </p>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/privacy"
                className="text-gray-500 hover:text-[#e8b923] text-sm transition-colors duration-300"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 