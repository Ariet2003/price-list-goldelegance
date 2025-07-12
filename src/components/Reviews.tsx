'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=3');
        const data = await response.json();
        
        const reviewsData: Review[] = [
          {
            id: 1,
            name: 'Айдана Асанова',
            role: 'Организатор свадеб',
            content: 'Потрясающая работа команды GOLD ELEGANCE! Они превратили наше мероприятие в настоящую сказку. Каждая деталь была продумана до мелочей, а качество материалов превзошло все ожидания.',
            rating: 5,
            image: data.results[0].picture.large
          },
          {
            id: 2,
            name: 'Нурлан Бакиров',
            role: 'Ивент-менеджер',
            content: 'Профессионализм на высшем уровне! Команда GOLD ELEGANCE создала уникальную атмосферу для нашего корпоративного мероприятия. Все гости были в восторге от декора.',
            rating: 5,
            image: data.results[1].picture.large
          },
          {
            id: 3,
            name: 'Бермет Джумабаева',
            role: 'Частный клиент',
            content: 'Выражаю огромную благодарность GOLD ELEGANCE за оформление моего юбилея. Все было именно так, как я мечтала. Отдельное спасибо за внимание к деталям и индивидуальный подход.',
            rating: 5,
            image: data.results[2].picture.large
          }
        ];
        
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }).map((_, index) => (
      <motion.svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-[#976726]"
        viewBox="0 0 20 20"
        fill="currentColor"
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </motion.svg>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#976726]"></div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gold-gradient mb-4 sm:mb-6">
            Отзывы наших клиентов
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4">
            Мы гордимся тем, что создаем незабываемые моменты для наших клиентов. 
            Вот что они говорят о нашей работе.
          </p>
        </motion.div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 scrollbar-hide">
          <div className="flex flex-nowrap gap-4 sm:gap-6 min-w-full sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(151, 103, 38, 0.15)",
                }}
                className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-6 sm:p-8 relative group cursor-pointer border border-transparent transition-all duration-500 hover:border-[#976726]/30 before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-500 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-[#976726]/5 before:via-[#e8b923]/5 before:to-[#976726]/5 before:-z-10 flex-none w-[280px] sm:w-auto"
              >
                <motion.div 
                  className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(45deg, rgba(151, 103, 38, 0.2), rgba(232, 185, 35, 0.2))',
                  }}
                />
                
                <div className="flex items-center mb-4 sm:mb-6">
                  <motion.div 
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#976726]/20 transition-all duration-500 group-hover:border-[#976726]/40 group-hover:shadow-lg group-hover:shadow-[#976726]/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      sizes="(max-width: 640px) 48px, 56px"
                      className="object-cover rounded-full transition-all duration-500 group-hover:scale-110"
                    />
                  </motion.div>
                  <div className="ml-3 sm:ml-4">
                    <motion.h3 
                      className="text-sm sm:text-base font-medium text-[#caa545] transition-all duration-300"
                      whileHover={{ color: "#e8b923" }}
                    >
                      {review.name}
                    </motion.h3>
                    <p className="text-xs sm:text-sm text-gray-500 transition-all duration-300 group-hover:text-gray-400">
                      {review.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-3 sm:mb-4 space-x-1">{renderStars(review.rating)}</div>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed transition-all duration-300 group-hover:text-gray-300">
                  {review.content}
                </p>

                <motion.div
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-10 transition-all duration-300 group-hover:opacity-30"
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-[#976726] group-hover:text-[#caa545] transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 