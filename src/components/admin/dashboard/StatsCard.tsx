import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  delay?: number;
}

export default function StatsCard({ title, value, icon, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-black/80 to-black/60 rounded-xl p-6 border border-yellow-900/20 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-yellow-600/80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {value}
          </h3>
        </div>
        <div className="text-yellow-600/60 w-10 h-10">
          {icon}
        </div>
      </div>
    </motion.div>
  );
} 