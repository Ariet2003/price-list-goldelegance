import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryForm from './CategoryForm';
import ConfirmModal from '../shared/ConfirmModal';
import Pagination from '../shared/Pagination';

interface Category {
  id: number;
  name: string;
  products: {
    id: number;
  }[];
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

interface CategoryListProps {
  onRefresh?: () => void;
}

export interface CategoryListRef {
  fetchCategories: () => Promise<void>;
}

const CategoryList = forwardRef<CategoryListRef, CategoryListProps>(function CategoryList({ onRefresh }, ref) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 50,
  });

  const fetchCategories = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
      setPagination(data.pagination);
      onRefresh?.();
    } catch (error) {
      setError('Ошибка при загрузке категорий');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchCategories: () => fetchCategories(1) // Reset to first page on refresh
  }));

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      // Refresh the current page after deletion
      await fetchCategories(
        categories.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1 // Go to previous page if we deleted the last item
          : pagination.currentPage
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8b923]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Нет категорий</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#976726]/20">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Количество товаров
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#976726]/20">
            {categories.map((category, index) => (
              <motion.tr 
                key={category.id} 
                className="hover:bg-[#976726]/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">{category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {category.products.length} товаров
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      onClick={() => setEditingCategory(category)}
                      className="text-[#e8b923] hover:text-[#caa545] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => setDeletingCategory(category)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      </div>

      {editingCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl p-6 -mt-80 bg-black/50 backdrop-blur-lg rounded-xl border border-[#976726]/20 overflow-y-auto max-h-[85vh]"
            >
              <CategoryForm 
                initialData={editingCategory}
                onClose={() => setEditingCategory(null)}
                onSuccess={() => {
                  fetchCategories(pagination.currentPage);
                  setEditingCategory(null);
                }}
              />
            </motion.div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => {
          if (deletingCategory) {
            handleDelete(deletingCategory);
          }
          setDeletingCategory(null);
        }}
        title="Удаление категории"
        message={`Вы уверены, что хотите удалить категорию "${deletingCategory?.name}"? Все услуги в этой категории также будут удалены.`}
      />
    </>
  );
});

export default CategoryList; 