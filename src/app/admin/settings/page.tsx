'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [telegramData, setTelegramData] = useState({
    botToken: '',
    adminUserId: '',
  });
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [telegramSuccess, setTelegramSuccess] = useState(false);

  useEffect(() => {
    // Загружаем текущие настройки Telegram
    const fetchTelegramSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/telegram');
        if (!response.ok) throw new Error('Ошибка при загрузке настроек');
        const data = await response.json();
        setTelegramData({
          botToken: data.botToken,
          adminUserId: data.adminUserId,
        });
      } catch (err) {
        console.error('Error fetching Telegram settings:', err);
      }
    };

    fetchTelegramSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Новые пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при изменении пароля');
      }

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramLoading(true);
    setTelegramError(null);
    setTelegramSuccess(false);

    try {
      const response = await fetch('/api/admin/settings/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при обновлении настроек Telegram');
      }

      setTelegramSuccess(true);
    } catch (err) {
      setTelegramError(err instanceof Error ? err.message : 'Ошибка при обновлении настроек Telegram');
    } finally {
      setTelegramLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <motion.h1 
        className="text-3xl font-bold gold-gradient mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Настройки
      </motion.h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Форма изменения пароля */}
        <div className="bg-black/50 border border-[#976726]/20 rounded-xl backdrop-blur-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-[#e8b923] mb-6">Изменить пароль</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e8b923] mb-1">
                Текущий пароль
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8b923] mb-1">
                Новый пароль
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8b923] mb-1">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm">
                Пароль успешно изменен
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-lg btn-primary text-black font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8b923] disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </motion.button>
          </form>
        </div>

        {/* Форма настроек Telegram */}
        <div className="bg-black/50 border border-[#976726]/20 rounded-xl backdrop-blur-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8b923] mb-6">Настройки Telegram</h2>
          
          <form onSubmit={handleTelegramSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e8b923] mb-1">
                Токен бота
              </label>
              <input
                type="text"
                value={telegramData.botToken}
                onChange={(e) => setTelegramData({ ...telegramData, botToken: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white"
                placeholder="Введите токен бота"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8b923] mb-1">
                ID администратора
              </label>
              <input
                type="text"
                value={telegramData.adminUserId}
                onChange={(e) => setTelegramData({ ...telegramData, adminUserId: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white"
                placeholder="Введите ID администратора"
                required
              />
            </div>

            {telegramError && (
              <div className="text-red-500 text-sm">
                {telegramError}
              </div>
            )}

            {telegramSuccess && (
              <div className="text-green-500 text-sm">
                Настройки Telegram успешно обновлены
              </div>
            )}

            <motion.button
              type="submit"
              disabled={telegramLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-lg btn-primary text-black font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8b923] disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {telegramLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
