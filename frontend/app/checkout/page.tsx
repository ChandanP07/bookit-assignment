'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingApi, promoApi } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

interface BookingData {
  experienceId: string;
  experienceTitle: string;
  slotId: string;
  date: string;
  timeSlot: string;
  quantity: number;
  price: number;
  subtotal: number;
  tax: number;
  total: number;
}

export default function Checkout() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode || !bookingData) return;

    try {
      const result = await promoApi.validate(promoCode, bookingData.subtotal);
      setDiscount(result.discount);
      setPromoError('');
    } catch (error: any) {
      setPromoError(error.response?.data?.message || 'Invalid promo code');
      setDiscount(0);
    }
  };

  const isFormValid = formData.userName.trim() !== '' &&
    formData.userEmail.trim() !== '' &&
    agreedToTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData || !isFormValid) return;

    setLoading(true);
    try {
      const finalTotal = bookingData.total - discount;

      const response = await bookingApi.create({
        experienceId: bookingData.experienceId,
        slotId: bookingData.slotId,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: '0000000000',
        participants: bookingData.quantity,
        promoCode: promoCode || undefined,
        discount,
        originalPrice: bookingData.subtotal,
        totalPrice: finalTotal,
      });

      const confirmationData = {
        ...response.data,
        experienceTitle: bookingData.experienceTitle,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        quantity: bookingData.quantity,
        totalPrice: finalTotal
      };

      localStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
      localStorage.removeItem('bookingData');
      router.push('/success');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const finalTotal = bookingData.total - discount;

  return (
    <div className="h-screen bg-[#F9F9F9] py-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto px-4 flex-1 overflow-y-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[#656565] hover:text-[#161616] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-lg">Checkout</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Section - Form */}
          <div className="w-full lg:w-[800px] flex-shrink-0">
            <div className="bg-[#F0F0F0] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#161616] mb-4">Your Details</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#161616] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F0F0F0] border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#161616] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F0F0F0] border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="flex-1 px-4 py-3 bg-[#F0F0F0] border border-[#D6D6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder:text-[#838383]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-8 py-3 bg-[#161616] text-white font-semibold rounded-lg text-sm whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>

                {promoError && (
                  <p className="text-[#FF4C0A] text-xs mt-1">{promoError}</p>
                )}
                {discount > 0 && (
                  <p className="text-[#24AC39] text-xs mt-1">
                    Promo code applied! You saved ₹{discount}
                  </p>
                )}

                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-[#656565]">
                    I agree to the <span className="font-semibold text-[#161616]">terms and safety policy</span>
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section - Price Summary */}
          <div className="lg:min-w-[400px] flex-grow">
            <div className="bg-[#F0F0F0] rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-[#161616] mb-4">Booking Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#656565]">Experience</span>
                  <span className="font-semibold text-[#161616] text-right max-w-[180px]">
                    {bookingData.experienceTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">Date</span>
                  <span className="font-semibold text-[#161616]">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">Time</span>
                  <span className="font-semibold text-[#161616]">{bookingData.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">Qty</span>
                  <span className="font-semibold text-[#161616]">{bookingData.quantity}</span>
                </div>

                <div className="border-t border-[#D6D6D6] pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#656565]">Subtotal</span>
                    <span className="font-semibold text-[#161616]">₹{bookingData.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#656565]">Taxes</span>
                    <span className="font-semibold text-[#161616]">₹{bookingData.tax}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#24AC39]">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#D6D6D6] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#161616]">Total</span>
                    <span className="font-bold text-xl text-[#161616]">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className={`w-full py-3 rounded-lg font-bold text-sm mt-6 ${isFormValid && !loading
                  ? 'bg-[#FFD643] text-black cursor-pointer'
                  : 'bg-[#D6D6D6] text-[#838383] cursor-not-allowed'
                  }`}
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}