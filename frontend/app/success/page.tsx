'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingConfirmation {
  id: string;
  experienceTitle: string;
  date: string;
  timeSlot: string;
  quantity: number;
  totalPrice: number;
}

export default function Success() {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('bookingConfirmation');
    if (data) {
      setBooking(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, []);

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const refId = booking.id.substring(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-[#24AC39] rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#161616] mb-2">Booking Confirmed!</h1>
        <p className="text-[#656565] mb-8">Reference ID: {refId}</p>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 text-left">
          <h2 className="font-bold text-lg text-[#161616] mb-4">Booking Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#656565]">Experience</span>
              <span className="font-semibold text-[#161616]">{booking.experienceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Date</span>
              <span className="font-semibold text-[#161616]">{booking.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Time</span>
              <span className="font-semibold text-[#161616]">{booking.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Guests</span>
              <span className="font-semibold text-[#161616]">{booking.quantity}</span>
            </div>
            <div className="border-t border-[#EDEDED] pt-3 flex justify-between">
              <span className="font-bold text-[#161616]">Total Paid</span>
              <span className="font-bold text-lg text-[#161616]">₹{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[#EDEDED] text-[#161616] font-semibold rounded-lg hover:bg-[#E3E3E3] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}