import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Ensure we always show 5 pages if possible
    if (endPage - startPage < 4) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(startPage + 4, totalPages);
      } else {
        startPage = Math.max(endPage - 4, 1);
      }
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <PaginationButton
          key={1}
          page={1}
          currentPage={currentPage}
          onClick={() => onPageChange(1)}
        />
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          page={i}
          currentPage={currentPage}
          onClick={() => onPageChange(i)}
        />
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <PaginationButton
          key={totalPages}
          page={totalPages}
          currentPage={currentPage}
          onClick={() => onPageChange(totalPages)}
        />
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-[#e8b923] hover:bg-[#976726]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={20} />
      </motion.button>

      {renderPageNumbers()}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-[#e8b923] hover:bg-[#976726]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={20} />
      </motion.button>
    </div>
  );
}

function PaginationButton({ page, currentPage, onClick }: { page: number; currentPage: number; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg transition-colors ${
        page === currentPage
          ? 'bg-[#976726] text-white'
          : 'text-[#e8b923] hover:bg-[#976726]/10'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {page}
    </motion.button>
  );
} 