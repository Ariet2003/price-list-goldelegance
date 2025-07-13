import { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ConfirmModal from '../shared/ConfirmModal';
import ProductForm from './ProductForm';
import Pagination from '../shared/Pagination';

interface ImageData {
  url: string;
  deleteUrl: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: ImageData[];
  categoryId: number;
  category: {
    name: string;
  };
  inStock: boolean;
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 50,
  });

  const fetchProducts = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products?page=${page}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to fetch products: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw data from server:', data);

      // Преобразуем строки JSON в объекты
      const processedData = data.products.map((product: any) => {
        console.log('Processing product:', product);
        try {
          return {
            ...product,
            images: Array.isArray(product.images) 
              ? product.images.map((img: any) => {
                  if (typeof img === 'string') {
                    try {
                      return JSON.parse(img);
                    } catch (parseError) {
                      console.error('Error parsing image JSON:', img, parseError);
                      return { url: '', deleteUrl: '' };
                    }
                  }
                  return img;
                })
              : []
          };
        } catch (processError) {
          console.error('Error processing product:', product, processError);
          return product;
        }
      });

      console.log('Processed data:', processedData);
      setProducts(processedData);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Full error details:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete product: ${errorData.error || response.statusText}`);
      }

      setProducts(products.filter(p => p.id !== product.id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ошибка при удалении товара');
    }
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page);
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
      <div className="flex flex-col items-center justify-center h-64 text-red-400">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-center">{error}</p>
        <button 
          onClick={() => fetchProducts()}
          className="mt-4 px-4 py-2 bg-[#976726]/20 hover:bg-[#976726]/30 rounded-lg transition-colors text-[#e8b923]"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Нет товаров</p>
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
                Изображения
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#e8b923] uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#976726]/20">
            {products.map((product, index) => (
              <motion.tr 
                key={product.id} 
                className="hover:bg-[#976726]/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex -space-x-3">
                    {product.images.slice(0, 3).map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="h-12 w-12 relative rounded-full overflow-hidden border-2 border-[#976726]/20 hover:border-[#e8b923]/50 transition-all duration-300 hover:z-10"
                      >
                        <Image
                          src={image.url}
                          alt={`${product.name} image ${imgIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {product.images.length === 0 && (
                      <div className="h-12 w-12 relative rounded-full overflow-hidden border-2 border-[#976726]/20 bg-[#976726]/10 flex items-center justify-center">
                        <ImageIcon size={20} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">{product.name}</div>
                  <div className="text-sm text-gray-400 truncate max-w-xs">
                    {product.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {product.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {product.price.toLocaleString('ru-RU')} сом
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.inStock
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-red-900/20 text-red-400'
                    }`}
                  >
                    {product.inStock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      onClick={() => setEditingProduct(product)}
                      className="text-[#e8b923] hover:text-[#caa545] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => setDeletingProduct(product)}
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
      </div>

      <ConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) {
            handleDelete(deletingProduct);
          }
          setDeletingProduct(null);
        }}
        title="Удаление товара"
        message={`Вы уверены, что хотите удалить товар "${deletingProduct?.name}"? Это действие нельзя отменить.`}
      />

      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl p-6 -mt-80 bg-black/50 backdrop-blur-lg rounded-xl border border-[#976726]/20 overflow-y-auto max-h-[85vh]"
            >
              <ProductForm 
                initialData={editingProduct}
                onClose={() => {
                  setEditingProduct(null);
                  fetchProducts();
                }}
              />
            </motion.div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
} 