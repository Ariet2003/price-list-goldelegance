'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2, Search, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  products: { id: number }[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  inStock: boolean;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInStock, setShowInStock] = useState(true);
  const [sortOption, setSortOption] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        const sortedCategories = data.categories.sort((a: Category, b: Category) => 
          b.products.length - a.products.length
        );
        setCategories(sortedCategories);
        if (sortedCategories.length > 0) {
          setSelectedCategory(sortedCategories[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      try {
        const response = await fetch('/api/admin/products');
        const data = await response.json();
        const categoryProducts = data.products.filter(
          (product: Product) => product.categoryId === selectedCategory
        );
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply in stock filter
    if (showInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, showInStock, sortOption]);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[20vh] flex items-center justify-center">
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-[2] text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gold-gradient mb-3">
            Наши услуги
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 px-4">
            Выберите категорию и найдите идеальное решение для вашего мероприятия
          </p>
        </motion.div>
      </section>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-[#976726]/20 p-4 space-y-4">
        {/* Mobile Categories */}
        <div className="flex overflow-x-auto pb-4 gap-3 
          [&::-webkit-scrollbar]:h-2 
          [&::-webkit-scrollbar-track]:rounded-full 
          [&::-webkit-scrollbar-track]:bg-black/20
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-thumb]:bg-gradient-to-r 
          [&::-webkit-scrollbar-thumb]:from-[#976726] 
          [&::-webkit-scrollbar-thumb]:to-[#e8b923]">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-2 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap flex items-center gap-1.5 sm:gap-2 flex-shrink-0 text-sm sm:text-base
                ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#976726] to-[#e8b923] text-black font-bold'
                  : 'bg-[#976726]/10 text-[#e8b923] hover:bg-[#976726]/20'
                }
              `}
            >
              <span>{category.name}</span>
              <span className={`
                px-1.5 py-0.5 sm:px-2 rounded-full text-xs sm:text-sm
                ${selectedCategory === category.id
                  ? 'bg-black/20 text-black'
                  : 'bg-[#976726]/20 text-[#e8b923]'
                }
              `}>
                {category.products.length}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Search with Filter Button */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#976726]/10 border border-[#976726]/20 rounded-lg px-4 py-2 pl-10 text-[#e8b923] placeholder-[#976726]/50 focus:outline-none focus:border-[#976726] transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#976726]" />
          </div>
          <button
            onClick={() => setIsFilterMenuOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#976726] to-[#e8b923] text-black font-medium rounded-lg"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Filter Menu */}
      <AnimatePresence>
        {isFilterMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
              onClick={() => setIsFilterMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-black border-l border-[#976726]/20 p-6 z-40 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#e8b923] text-xl font-semibold">Фильтры</h2>
                <button
                  onClick={() => setIsFilterMenuOpen(false)}
                  className="text-[#e8b923] hover:text-[#e8b923]/80"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filters */}
              <div>
                <h3 className="flex items-center gap-2 text-[#e8b923] font-semibold mb-4">
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#e8b923]/80 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showInStock}
                      onChange={(e) => setShowInStock(e.target.checked)}
                      className="
                        appearance-none w-5 h-5 rounded 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:bg-gradient-to-r checked:from-[#976726] checked:to-[#e8b923]
                        checked:border-0
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-full after:h-full after:absolute 
                        after:left-0 after:top-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMuNSA0TDYgMTEuNSAyLjUgOCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] 
                        after:bg-[length:80%_80%] after:bg-center after:bg-no-repeat after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="group-hover:text-[#e8b923] transition-colors">Только в наличии</span>
                  </label>
                </div>
              </div>

              {/* Sorting */}
              <div className="mt-8">
                <h3 className="flex items-center gap-2 text-[#e8b923] font-semibold mb-4">
                  <ArrowUpDown className="w-4 h-4" />
                  Сортировка
                </h3>
                <div className="space-y-2">
                  <label className="block cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === 'name'}
                      onChange={() => setSortOption('name')}
                      className="
                        appearance-none w-5 h-5 rounded-full 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:border-[#e8b923]
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-2.5 after:h-2.5 after:absolute 
                        after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                        after:rounded-full after:bg-gradient-to-r after:from-[#976726] after:to-[#e8b923]
                        after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="ml-2 text-[#e8b923]/80 group-hover:text-[#e8b923] transition-colors">По названию</span>
                  </label>
                  <label className="block cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === 'price-asc'}
                      onChange={() => setSortOption('price-asc')}
                      className="
                        appearance-none w-5 h-5 rounded-full 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:border-[#e8b923]
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-2.5 after:h-2.5 after:absolute 
                        after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                        after:rounded-full after:bg-gradient-to-r after:from-[#976726] after:to-[#e8b923]
                        after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="ml-2 text-[#e8b923]/80 group-hover:text-[#e8b923] transition-colors">Сначала дешевле</span>
                  </label>
                  <label className="block cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === 'price-desc'}
                      onChange={() => setSortOption('price-desc')}
                      className="
                        appearance-none w-5 h-5 rounded-full 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:border-[#e8b923]
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-2.5 after:h-2.5 after:absolute 
                        after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                        after:rounded-full after:bg-gradient-to-r after:from-[#976726] after:to-[#e8b923]
                        after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="ml-2 text-[#e8b923]/80 group-hover:text-[#e8b923] transition-colors">Сначала дороже</span>
                  </label>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Categories Section */}
      <section className="hidden lg:block sticky top-0 z-10 bg-black py-6 border-b border-[#976726]/20">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex overflow-x-auto pb-4 gap-4 
            [&::-webkit-scrollbar]:h-2 
            [&::-webkit-scrollbar-track]:rounded-full 
            [&::-webkit-scrollbar-track]:bg-black/20
            [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-gradient-to-r 
            [&::-webkit-scrollbar-thumb]:from-[#976726] 
            [&::-webkit-scrollbar-thumb]:to-[#e8b923]">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#976726] to-[#e8b923] text-black font-bold'
                    : 'bg-[#976726]/10 text-[#e8b923] hover:bg-[#976726]/20'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.name}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-sm
                  ${selectedCategory === category.id
                    ? 'bg-black/20 text-black'
                    : 'bg-[#976726]/20 text-[#e8b923]'
                  }
                `}>
                  {category.products.length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar and Products */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex gap-8 relative">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-[120px] bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-[#976726]/20">
              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#976726]/10 border border-[#976726]/20 rounded-lg px-4 py-2 pl-10 text-[#e8b923] placeholder-[#976726]/50 focus:outline-none focus:border-[#976726] transition-colors"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#976726]" />
                </div>
              </div>

              {/* Filters */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-[#e8b923] font-semibold mb-4">
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#e8b923]/80 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showInStock}
                      onChange={(e) => setShowInStock(e.target.checked)}
                      className="
                        appearance-none w-5 h-5 rounded 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:bg-gradient-to-r checked:from-[#976726] checked:to-[#e8b923]
                        checked:border-0
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-full after:h-full after:absolute 
                        after:left-0 after:top-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMuNSA0TDYgMTEuNSAyLjUgOCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] 
                        after:bg-[length:80%_80%] after:bg-center after:bg-no-repeat after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="group-hover:text-[#e8b923] transition-colors">Только в наличии</span>
                  </label>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="flex items-center gap-2 text-[#e8b923] font-semibold mb-4">
                  <ArrowUpDown className="w-4 h-4" />
                  Сортировка
                </h3>
                <div className="space-y-2">
                  <label className="block cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === 'name'}
                      onChange={() => setSortOption('name')}
                      className="
                        appearance-none w-5 h-5 rounded-full 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:border-[#e8b923]
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-2.5 after:h-2.5 after:absolute 
                        after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                        after:rounded-full after:bg-gradient-to-r after:from-[#976726] after:to-[#e8b923]
                        after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="ml-2 text-[#e8b923]/80 group-hover:text-[#e8b923] transition-colors">По названию</span>
                  </label>
                  <label className="block cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === 'price-asc'}
                      onChange={() => setSortOption('price-asc')}
                      className="
                        appearance-none w-5 h-5 rounded-full 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:border-[#e8b923]
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-2.5 after:h-2.5 after:absolute 
                        after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                        after:rounded-full after:bg-gradient-to-r after:from-[#976726] after:to-[#e8b923]
                        after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="ml-2 text-[#e8b923]/80 group-hover:text-[#e8b923] transition-colors">Сначала дешевле</span>
                  </label>
                  <label className="block cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === 'price-desc'}
                      onChange={() => setSortOption('price-desc')}
                      className="
                        appearance-none w-5 h-5 rounded-full 
                        border-2 border-[#976726] 
                        bg-black/40
                        checked:border-[#e8b923]
                        relative
                        cursor-pointer
                        transition-all
                        focus:ring-2 focus:ring-[#976726]/50
                        after:content-[''] after:w-2.5 after:h-2.5 after:absolute 
                        after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                        after:rounded-full after:bg-gradient-to-r after:from-[#976726] after:to-[#e8b923]
                        after:opacity-0
                        checked:after:opacity-100
                        hover:border-[#e8b923]
                      "
                    />
                    <span className="ml-2 text-[#e8b923]/80 group-hover:text-[#e8b923] transition-colors">Сначала дороже</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#e8b923]" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-sm rounded-xl border border-[#976726]/20 overflow-hidden hover:border-[#976726]/40 transition-all duration-500 group"
                  >
                    <div className="relative h-32 xs:h-40 sm:h-56 lg:h-64 overflow-hidden">
                      <Image
                        src={product.images[0]?.url || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-sm sm:text-lg font-medium">
                            Нет в наличии
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-2 sm:p-4 lg:p-6">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#e8b923] mb-2 group-hover:text-[#e8b923]/80 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400 mb-3 sm:mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <span className="text-base sm:text-xl lg:text-2xl font-bold gold-gradient">
                          {product.price.toLocaleString()} сом
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/catalog/${product.id}`)}
                          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#976726] to-[#e8b923] text-black text-sm sm:text-base font-medium rounded-lg hover:shadow-lg hover:shadow-[#976726]/20 transition-shadow"
                        >
                          Посмотреть
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 min-h-[400px] flex flex-col items-center justify-center"
              >
                <p>Товары не найдены</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 