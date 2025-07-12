import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartCardProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  delay?: number;
}

const COLORS = ['#F59E0B', '#B45309', '#92400E', '#78350F'];

export default function ChartCard({ title, data, delay = 0 }: ChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-black/80 to-black/60 rounded-xl p-6 border border-yellow-900/20 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-yellow-600/80 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="rgba(0,0,0,0.2)"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                color: '#F59E0B'
              }}
              formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-300">{item.name}</span>
            </div>
            <span className="text-yellow-600/80">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 