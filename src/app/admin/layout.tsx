'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-black/50 backdrop-blur-lg border border-[#976726]/20"
      >
        <Menu className="w-6 h-6 text-[#e8b923]" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main content */}
      <main className={`lg:ml-64 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'brightness-50 lg:brightness-100' : ''}`}>
        {children}
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-[45]"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  );
} 