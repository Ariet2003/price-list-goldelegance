'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CubeIcon, 
  TagIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import ChartCard from '@/components/admin/dashboard/ChartCard';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  inactiveProducts: number;
  categoryData: Array<{ name: string; value: number }>;
  stockStatusData: Array<{ name: string; value: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-yellow-900/20 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-yellow-900/20 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-96 bg-yellow-900/20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 text-red-400">
          Ошибка загрузки данных: {error}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <motion.h1 
        className="text-3xl font-bold gold-gradient mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Панель управления
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Всего товаров"
          value={stats.totalProducts}
          icon={<CubeIcon />}
          delay={0.1}
        />
        <StatsCard
          title="Категорий"
          value={stats.totalCategories}
          icon={<TagIcon />}
          delay={0.2}
        />
        <StatsCard
          title="В наличии"
          value={stats.activeProducts}
          icon={<CheckCircleIcon />}
          delay={0.3}
        />
        <StatsCard
          title="Нет в наличии"
          value={stats.inactiveProducts}
          icon={<XCircleIcon />}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard
          title="Товары по категориям"
          data={stats.categoryData}
          delay={0.5}
        />
        <ChartCard
          title="Статус наличия"
          data={stats.stockStatusData}
          delay={0.6}
        />
      </div>
    </div>
  );
} 