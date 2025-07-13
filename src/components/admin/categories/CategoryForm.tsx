import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    name: string;
  };
}

export default function CategoryForm({ onClose, onSuccess, initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData 
        ? `/api/admin/categories/${initialData.id}` 
        : '/api/admin/categories';

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData ? { ...formData, id: initialData.id } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error instanceof Error ? error.message : 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gold-gradient">
          {initialData ? 'Редактировать категорию' : 'Добавить категорию'}
        </h2>
        <motion.button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-[#976726]/10 rounded-full transition-colors text-gray-400 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e8b923] mb-1">
          Название
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white placeholder-gray-500"
          placeholder="Введите название категории"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <motion.button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-[#e8b923] hover:bg-[#976726]/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Отмена
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-lg btn-primary text-black font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8b923] disabled:opacity-50"
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
      </div>
    </form>
  );
} 