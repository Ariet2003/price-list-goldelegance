'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    } else {
      // Для обычных ссылок
      router.push(href);
    }
  };

  const navItems = [
    { name: 'Главная', href: '/' },
    { name: 'О нас', href: '#about' },
    { name: 'Отзывы', href: '#reviews' },
    { name: 'Как мы работаем', href: '#how-we-work' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <motion.header
        className="fixed w-full z-[999] bg-black/90 backdrop-blur-md py-4 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="text-2xl font-bold gold-gradient cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              GOLD ELEGANCE
            </motion.a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="nav-gold-underline text-white hover:text-white/90 transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Contact Button */}
            <div className="flex items-center space-x-4">
              <motion.a
                href="/catalog"
                onClick={(e) => handleNavClick(e, '/catalog')}
                className="hidden md:block btn-primary px-6 py-2 rounded-full text-black hover:scale-105 transition-transform cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Оставить заявку
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 focus:outline-none bg-black/50 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6 text-[#e8b923]" />
                ) : (
                  <FaBars className="h-6 w-6 text-[#e8b923]" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[998] md:hidden"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-black/95 backdrop-blur-md shadow-xl"
            >
              <div className="flex flex-col h-full pt-20 pb-6 px-4">
                <div className="flex-1 space-y-2">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="block py-3 text-white hover:text-[#e8b923] transition-colors border-b border-[#976726]/20"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
                
                <motion.a
                  href="/catalog"
                  onClick={(e) => handleNavClick(e, '/catalog')}
                  className="btn-primary w-full text-center py-3 rounded-full text-black mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Оставить заявку
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 