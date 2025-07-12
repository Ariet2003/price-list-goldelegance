import { motion } from 'framer-motion';

export default function ProductsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">
        Товары
      </h1>
      <div className="bg-black/50 border border-white/10 rounded-lg p-6">
        {/* Content will be added later */}
        <p className="text-gray-400">Здесь будет список товаров</p>
      </div>
    </motion.div>
  );
} 