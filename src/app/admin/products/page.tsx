'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductForm from '@/components/admin/products/ProductForm';
import ProductList from '@/components/admin/products/ProductList';

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <motion.h1 
        className="text-3xl font-bold gold-gradient"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Товары
      </motion.h1>

      <div className="flex justify-end mb-6">
        <motion.button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg btn-primary text-black font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8b923]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Plus size={20} />
          <span>Добавить товар</span>
        </motion.button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-black/50 backdrop-blur-lg rounded-xl border border-[#976726]/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <ProductForm onClose={() => setIsFormOpen(false)} />
          </motion.div>
        </div>
      )}

      <div className="bg-black/50 border border-[#976726]/20 rounded-xl backdrop-blur-lg">
        <ProductList />
      </div>
    </motion.div>
  );
} 