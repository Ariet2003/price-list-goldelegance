'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBoxes, FaList, FaCog, FaHome } from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'] });

const menuItems = [
  { href: '/admin', icon: FaHome, label: 'Главная' },
  { href: '/admin/products', icon: FaBoxes, label: 'Товары' },
  { href: '/admin/categories', icon: FaList, label: 'Категории' },
  { href: '/admin/settings', icon: FaCog, label: 'Настройки' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-[#976726]/20 z-50">
      <div className="flex justify-around items-center px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center py-2 px-3 min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavBackground"
                  className="absolute inset-0 bg-[#976726]/20 rounded-lg"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              <Icon 
                className={`w-6 h-6 mb-1 relative z-10 transition-transform duration-200 ${
                  isActive ? 'text-[#e8b923] scale-110' : 'text-[#976726]'
                }`}
              />
              <span 
                className={`text-xs relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-[#e8b923]' : 'text-[#976726]'
                } ${playfair.className}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 