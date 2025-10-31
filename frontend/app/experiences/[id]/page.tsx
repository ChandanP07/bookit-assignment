'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { experienceApi, Slot, Experience } from '@/lib/api';
import { format, addDays } from 'date-fns';
import { ArrowLeft, Minus, Plus } from 'lucide-react';

export default function ExperienceDetails() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  });

  useEffect(() => {
    fetchExperience();
    if (dates[0]) {
      setSelectedDate(dates[0]);
    }
  }, [experienceId]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  const fetchExperience = async () => {
    try {
      const data = await experienceApi.getById(experienceId);
      setExperience(data);
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const data = await experienceApi.getSlots(experienceId, selectedDate);
      setSlots(data);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot || !experience) return;

    const subtotal = experience.price * quantity;
    const tax = Math.round(subtotal * 0.06);
    const total = subtotal + tax;

    const bookingData = {
      experienceId: experience.id,
      experienceTitle: experience.title,
      slotId: selectedSlot.id,
      date: selectedDate,
      timeSlot: selectedSlot.timeSlot,
      quantity,
      price: experience.price,
      subtotal,
      tax,
      total,
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/checkout');
  };

  const formatTimeSlot = (timeSlot: string) => {
    const startTime = timeSlot.split(' - ')[0];
    return startTime.replace(/^0/, '').toLowerCase();
  };

  if (loading || !experience) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subtotal = experience.price * quantity;
  const tax = Math.round(subtotal * 0.06);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen lg:h-screen bg-[#F9F9F9] py-2 lg:py-2 overflow-auto lg:overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 h-full flex flex-col">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[#656565] hover:text-[#161616] mb-2 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 lg:overflow-hidden">
          {/* Left Section - Image on Top */}
          <div className="lg:col-span-2 overflow-hidden">
            <div className="bg-[#F9F9F9] rounded-lg h-full overflow-y-auto">
              <div className="space-y-2.5">
                <div className="relative h-64 sm:h-72 w-full lg:w-4/5 rounded-lg overflow-hidden">
                  <Image
                    src={experience.images[0]}
                    alt={experience.title}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                </div>

                {/* Title & Description */}
                <div className="pr-2">
                  <h1 className="text-xl sm:text-lg font-bold text-[#161616] mb-1">{experience.title}</h1>
                  <p className="text-[#656565] text-sm sm:text-xs leading-relaxed">{experience.description}</p>
                </div>

                <div className="pr-2">
                  <h2 className="text-base sm:text-sm font-bold text-[#161616] mb-2">Choose date</h2>
                  <div className="flex space-x-1.5 overflow-x-auto pb-1">
                    {dates.map((date) => {
                      const dateObj = new Date(date);
                      const isSelected = date === selectedDate;
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 px-4 py-2 sm:px-3 sm:py-1.5 rounded-md border text-sm sm:text-xs font-semibold ${
                            isSelected
                              ? 'bg-[#FFD643] border-[#FFD643]'
                              : 'bg-white border-[#D6D6D6] hover:border-[#BDBDBD]'
                          }`}
                        >
                          {format(dateObj, 'MMM dd')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pr-2">
                  <h2 className="text-base sm:text-sm font-bold text-[#161616] mb-2">Choose time</h2>
                  {slots.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          const isSoldOut = slot.bookedSeats >= slot.availableSeats;
                          const remainingSeats = slot.availableSeats - slot.bookedSeats;
                          return (
                            <button
                              key={slot.id}
                              onClick={() => !isSoldOut && setSelectedSlot(slot)}
                              disabled={isSoldOut}
                              className={`p-2 rounded-md border text-left text-xs ${
                                isSelected
                                  ? 'bg-[#BDBDBD] border-[#BDBDBD]'
                                  : isSoldOut
                                  ? 'bg-[#EFEFEF] border-[#E3E3E3] cursor-not-allowed opacity-60'
                                  : 'bg-white border-[#D6D6D6] hover:border-[#BDBDBD]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#161616]">
                                  {formatTimeSlot(slot.timeSlot)}
                                </span>
                                <span className="text-[#FF4C0A] font-semibold ml-1">
                                  {isSoldOut ? 'Sold out' : `${remainingSeats} left`}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-[#838383] mt-1">All times are in IST (GMT +5:30)</p>
                    </>
                  ) : (
                    <p className="text-[#838383] text-center py-2 text-xs">No slots available</p>
                  )}
                </div>

                <div className="pr-2 pb-2">
                  <h2 className="text-base sm:text-sm font-bold text-[#161616] mb-2">About</h2>
                  <div className="bg-[#F0F0F0] p-3 sm:p-2.5 rounded-lg">
                    <p className="text-[#656565] text-sm sm:text-xs leading-relaxed">
                      {experience.highlights.join('. ')}. Minimum age 10.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#F0F0F0] rounded-xl p-4 sm:p-6 shadow-sm h-fit">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#656565] text-xs sm:text-sm">Starts at</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#161616]">₹{experience.price}</span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 border-y border-[#D6D6D6]">
                  <span className="text-[#656565] font-medium text-xs sm:text-sm">Quantity</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-full border border-[#BDBDBD] flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Minus size={14} className="text-[#656565]" />
                    </button>
                    <span className="font-bold text-sm sm:text-base w-6 text-center text-[#161616]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-full border border-[#BDBDBD] flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus size={14} className="text-[#656565]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs sm:text-sm text-[#656565]">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-[#656565]">
                    <span>Taxes</span>
                    <span>₹{tax}</span>
                  </div>
                </div>

                <div className="border-t border-[#D6D6D6] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#161616] text-sm sm:text-base">Total</span>
                    <span className="font-bold text-lg sm:text-xl text-[#161616]">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  className={`w-full py-2.5 sm:py-3 rounded-lg font-bold text-sm ${
                    selectedSlot
                      ? 'bg-[#FFD643] text-black cursor-pointer'
                      : 'bg-[#D6D6D6] text-[#838383] cursor-not-allowed'
                  }`}
                >
                  {selectedSlot ? 'Confirm' : 'Select a time slot'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}