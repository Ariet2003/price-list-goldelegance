'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import OrderModal from '@/components/OrderModal';

interface Product {
  id: number;
  name: string;
  images: { url: string }[];
  description: string;
  price: number;
  inStock: boolean;
  categoryId: number;
  category: {
    name: string;
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const router = useRouter();

  const handlePrevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    preventScrollOnSwipe: true,
    trackMouse: false
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`);
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#e8b923]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#e8b923]">
        <p className="text-xl mb-4">Услуга не найдена</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-1">
      {/* Hero Section - Desktop Only */}
      <section className="hidden lg:block relative h-[20vh] flex items-center">
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center">
            <motion.h1 
              className="text-3xl font-bold gold-gradient text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Подробная информация
            </motion.h1>
            <motion.button
              onClick={() => router.back()}
              className="mt-6 px-4 py-2 border border-[#976726] text-[#976726] hover:text-[#e8b923] hover:border-[#e8b923] rounded-lg flex items-center gap-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к каталогу
            </motion.button>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="lg:flex lg:gap-4">
            {/* Thumbnail Gallery - Desktop */}
            {product.images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-3 w-24">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#e8b923]'
                        : 'border-[#976726]/20 hover:border-[#976726]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} - изображение ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1">
              <motion.div
                className="relative max-w-3xl lg:max-w-4xl mx-auto aspect-[4/3] rounded-xl overflow-hidden border border-[#976726]/20 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsImageModalOpen(true)}
              >
                <Image
                  src={product.images[selectedImage]?.url || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Thumbnail Gallery - Mobile */}
              {product.images.length > 1 && (
                <div className="lg:hidden grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4 mt-4">
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-[#e8b923]'
                          : 'border-[#976726]/20 hover:border-[#976726]'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} - изображение ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex flex-col lg:block">
              <div className="flex items-start justify-between gap-4">
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold gold-gradient mb-2 flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {product.name}
                </motion.h1>
                <motion.button
                  className="lg:hidden shrink-0 px-4 py-2 bg-gradient-to-r from-[#976726] to-[#e8b923] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#976726]/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setIsOrderModalOpen(true)}
                >
                  Оставить заявку
                </motion.button>
              </div>
              <motion.p
                className="text-[#976726]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Категория: {product.category.name}
              </motion.p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <motion.div
                className="text-xl sm:text-2xl lg:text-3xl font-bold gold-gradient"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.price.toLocaleString()} сом
              </motion.div>

              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.inStock
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </motion.div>
            </div>

            <motion.div
              className="prose prose-invert max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-[#e8b923] mb-4">Описание</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{product.description}</p>
            </motion.div>

            <motion.button
              className="hidden lg:block w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#976726] to-[#e8b923] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#976726]/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => setIsOrderModalOpen(true)}
            >
              Оставить заявку
            </motion.button>
          </div>
        </div>
      </section>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.button
              className="absolute top-4 right-4 text-white/80 hover:text-white z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Navigation Buttons - Desktop */}
            <div className="hidden md:block absolute inset-x-0 top-0 bottom-0 pointer-events-none">
              <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between pointer-events-none">
                <motion.button
                  className="pointer-events-auto text-white/80 hover:text-white z-50 bg-black/50 rounded-full p-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>

                <motion.button
                  className="pointer-events-auto text-white/80 hover:text-white z-50 bg-black/50 rounded-full p-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
              </div>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              {...swipeHandlers}
            >
              <Image
                src={product.images[selectedImage]?.url || '/images/placeholder.jpg'}
                alt={product.name}
                className="object-contain max-h-[90vh] w-auto h-auto"
                width={1920}
                height={1080}
                priority
              />

              {/* Swipe Hint - Mobile */}
              <motion.div
                className="md:hidden absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                Проведите влево или вправо для просмотра фото
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productName={product?.name || ''}
        productCategory={product?.category?.name}
        productPrice={product?.price}
      />
    </main>
  );
} 