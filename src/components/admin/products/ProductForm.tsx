import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: number;
  name: string;
}

interface ImageData {
  url: string;
  deleteUrl: string;
}

interface ProductFormProps {
  onClose: () => void;
  initialData?: {
    id: number;
    name: string;
    description: string;
    price: number;
    images: ImageData[];
    categoryId: number;
    inStock: boolean;
  };
}

export default function ProductForm({ onClose, initialData }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    categoryId: initialData?.categoryId || 0,
    inStock: initialData?.inStock ?? true,
    images: initialData?.images || [],
  });
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData 
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ошибка при сохранении товара');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploadLoading(true);
    setUploadError(null);

    const formDataUpload = new FormData();
    Array.from(files).forEach((file) => {
      formDataUpload.append('images', file);
    });
    formDataUpload.append('productName', formData.name || 'product');

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Failed to upload images');

      const { urls } = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageDelete = async (image: ImageData, index: number) => {
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteUrl: image.deleteUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index)
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gold-gradient">
          {initialData ? 'Редактировать товар' : 'Добавить новый товар'}
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#e8b923] mb-1">
            Название
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white placeholder-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#e8b923] mb-1">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white placeholder-gray-500 h-25"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#e8b923] mb-1">
              Цена
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white placeholder-gray-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e8b923] mb-1">
              Категория
            </label>
            <div className="relative">
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/30 border border-[#976726]/30 rounded-lg focus:ring-2 focus:ring-[#e8b923] focus:border-transparent text-white appearance-none"
                required
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e8b923'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="" className="bg-black text-gray-400">Выберите категорию</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                    className="bg-black text-white"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="relative flex items-center group">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 border-[#976726] rounded transition-colors 
              peer-checked:bg-[#976726] peer-checked:border-[#e8b923] 
              peer-focus:ring-2 peer-focus:ring-[#e8b923] peer-focus:ring-offset-0
              flex items-center justify-center relative"
            >
              <AnimatePresence>
                {formData.inStock && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-white"
                  >
                    <Check size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="ml-2 text-sm font-medium text-[#e8b923] select-none">
              В наличии
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#e8b923] mb-1">
            Изображения
          </label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <AnimatePresence>
              {formData.images.map((image, index) => (
                <motion.div
                  key={image.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square"
                >
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <motion.button
                    type="button"
                    onClick={() => handleImageDelete(image, index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <label 
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${uploadLoading ? 'border-[#e8b923] bg-[#976726]/20' : 'border-[#976726]/30 hover:border-[#e8b923] bg-black/30'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploadLoading ? (
                <Loader2 className="w-8 h-8 text-[#e8b923] animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-[#976726] mb-2" />
              )}
              <p className="text-sm text-[#976726]">
                {uploadLoading ? 'Загрузка...' : 'Нажмите или перетащите файлы'}
              </p>
              {uploadError && (
                <p className="text-sm text-red-500 mt-1">{uploadError}</p>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              disabled={uploadLoading}
            />
          </label>
        </div>
      </div>

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
          disabled={loading || uploadLoading}
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