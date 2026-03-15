import { Car } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: '1',
    name: 'Tesla Model S Plaid',
    type: 'Electric',
    pricePerDay: 150,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
    transmission: 'Automatic',
    fuel: 'Electric',
    seats: 5,
    features: ['Autopilot', 'Ludicrous Mode', 'Premium Audio']
  },
  {
    id: '2',
    name: 'Porsche 911 Carrera',
    type: 'Sport',
    pricePerDay: 250,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000',
    transmission: 'PDK',
    fuel: 'Petrol',
    seats: 2,
    features: ['Sport Chrono', 'PASM', 'Bose Sound']
  },
  {
    id: '3',
    name: 'Range Rover Sport',
    type: 'SUV',
    pricePerDay: 180,
    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=1000',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 7,
    features: ['All-Wheel Drive', 'Panoramic Roof', 'Heated Seats']
  },
  {
    id: '4',
    name: 'Mercedes-Benz S-Class',
    type: 'Luxury',
    pricePerDay: 200,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    features: ['Massage Seats', 'Ambient Lighting', 'Soft Close Doors']
  }
];
