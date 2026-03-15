export interface Car {
  id: string;
  name: string;
  type: string;
  pricePerDay: number;
  image: string;
  transmission: string;
  fuel: string;
  seats: number;
  features: string[];
}

export interface Booking {
  id?: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
