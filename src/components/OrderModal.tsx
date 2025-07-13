import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productCategory?: string;
  productPrice?: number;
}

type ContactType = 'phone' | 'whatsapp';

export default function OrderModal({ 
  isOpen, 
  onClose, 
  productName,
  productCategory = '',
  productPrice
}: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventDate: '',
    comment: ''
  });
  const [contactType, setContactType] = useState<ContactType>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Здесь будет API запрос для отправки данных
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setFormData({ name: '', phone: '', eventDate: '', comment: '' });
        setContactType('phone');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-b from-black to-[#1a1a1a] rounded-xl p-6 w-full max-w-2xl border border-[#976726]/40 shadow-xl shadow-black/50 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gold-gradient">Оставить заявку</h2>
              <button
                onClick={onClose}
                className="text-[#976726] hover:text-[#e8b923] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#e8b923] mb-2">
                  ФИО *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-[#976726]/40 rounded-lg focus:outline-none focus:border-[#e8b923] text-white placeholder-[#976726]/60"
                  placeholder="Введите ваше ФИО"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8b923] mb-2">
                  Предпочитаемый способ связи *
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setContactType('phone')}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                      contactType === 'phone'
                        ? 'border-[#e8b923] bg-[#976726]/30 text-[#e8b923]'
                        : 'border-[#976726]/40 hover:border-[#976726] text-[#976726] hover:text-[#e8b923]'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                    Звонок
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactType('whatsapp')}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                      contactType === 'whatsapp'
                        ? 'border-[#e8b923] bg-[#976726]/30 text-[#e8b923]'
                        : 'border-[#976726]/40 hover:border-[#976726] text-[#976726] hover:text-[#e8b923]'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
                <div className="mt-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-[#e8b923] mb-2">
                    Номер телефона *
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="KG"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="phone-input"
                    required
                    placeholder="Введите номер телефона"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-[#e8b923] mb-2">
                  Дата мероприятия
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className={`w-full px-4 py-3 bg-black border border-[#976726]/40 rounded-lg focus:outline-none focus:border-[#e8b923] text-white ${!formData.eventDate && 'text-[#976726]/60'}`}
                    placeholder="Выберите дату"
                    onFocus={(e) => e.target.showPicker()}
                  />
                  {!formData.eventDate && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#976726]/60 pointer-events-none">
                      Выберите дату
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-[#e8b923] mb-2">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-[#976726]/40 rounded-lg focus:outline-none focus:border-[#e8b923] text-white resize-none placeholder-[#976726]/60"
                  placeholder="Дополнительная информация"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.phone}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#976726] to-[#e8b923] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#976726]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-[#e8b923] text-center font-medium">
                  Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                </p>
              )}

              {submitStatus === 'error' && (
                <p className="text-red-500 text-center">
                  Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 