'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBoxes, FaList, FaCog, FaHome } from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'] });

const menuItems = [
  { href: '/admin', icon: FaHome, label: 'Дашборд' },
  { href: '/admin/products', icon: FaBoxes, label: 'Товары' },
  { href: '/admin/categories', icon: FaList, label: 'Категории' },
  { href: '/admin/settings', icon: FaCog, label: 'Настройки' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="w-64 min-h-screen bg-black text-white fixed left-0 top-0"
    >
      <div className="mb-8 p-6 border-b border-yellow-900/20">
        <Link href="/admin" className="block">
          <motion.div 
            className="flex justify-center items-center mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Image
              src="/logo.svg"
              alt="Gold Elegance"
              width={120}
              height={40}
              className="object-contain"
            />
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-yellow-600/80 font-light">
              Панель управления
            </span>
          </motion.div>
        </Link>
      </div>

      <nav className="px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.li 
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link 
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3 rounded-lg relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-yellow-950/50 to-yellow-900/30 border border-yellow-600/30' 
                      : 'hover:bg-yellow-950/20 border border-transparent hover:border-yellow-900/20'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 bg-gradient-to-r from-yellow-950/50 to-yellow-900/30 rounded-lg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  
                  <div className="relative flex items-center w-full">
                    <Icon 
                      className={`
                        w-5 h-5 transition-transform duration-300 group-hover:scale-110
                        ${isActive ? 'text-yellow-400' : 'text-yellow-600/80'}
                      `} 
                    />
                    <span 
                      className={`
                        ml-3 ${playfair.className} tracking-wide
                        ${isActive ? 'text-yellow-400' : 'text-gray-300 group-hover:text-yellow-500/80'}
                      `}
                    >
                      {item.label}
                    </span>

                    <div className="absolute right-0 h-full flex items-center">
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.div 
        className="absolute bottom-4 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className={`text-xs text-yellow-600/60 ${playfair.className}`}>
          © Gold Elegance {new Date().getFullYear()}
        </div>
      </motion.div>
    </motion.div>
  );
} 