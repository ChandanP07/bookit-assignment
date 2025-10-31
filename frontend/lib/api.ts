import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  category: string;
  duration: string;
  highlights: string[];
  maxParticipants: number;
}

export interface Slot {
  id: string;
  experienceId: string;
  date: string;
  timeSlot: string;
  availableSeats: number;
  bookedSeats: number;
  isAvailable?: boolean;
  remainingSeats?: number;
}

export interface BookingData {
  experienceId: string;
  slotId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  participants: number;
  promoCode?: string;
  discount?: number;
  originalPrice: number;
  totalPrice: number;
}

export const experienceApi = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: Experience[] }>('/experiences');
    return data.data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: Experience }>(`/experiences/${id}`);
    return data.data;
  },
  
  getSlots: async (id: string, date?: string) => {
    const { data } = await api.get<{ success: boolean; data: Slot[] }>(
      `/experiences/${id}/slots${date ? `?date=${date}` : ''}`
    );
    return data.data;
  },
};

export const bookingApi = {
  create: async (bookingData: BookingData) => {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data;
  },
};

export const promoApi = {
  validate: async (code: string, price: number) => {
    const { data } = await api.post('/promo/validate', { code, price });
    return data.data;
  },
};

export default api;