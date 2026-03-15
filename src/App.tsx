import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Car, Phone, MapPin, Calendar, Star, ChevronRight, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { auth, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { INITIAL_CARS } from './data';
import { Car as CarType, Booking, Message } from './types';

// Navbar Component
const Navbar = ({ user, theme, toggleTheme }: { user: FirebaseUser | null; theme: string; toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Cars', href: '#cars' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? (theme === 'dark' ? 'bg-gray-900 shadow-md py-2' : 'bg-white shadow-md py-2') : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Car className={`h-8 w-8 ${scrolled ? 'text-blue-600' : 'text-white'}`} />
            <span className={`ml-2 text-2xl font-bold ${scrolled ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-white'}`}>DriveSelect</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors ${scrolled ? (theme === 'dark' ? 'text-gray-300 hover:text-blue-500' : 'text-gray-600 hover:text-blue-600') : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </a>
            ))}
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${scrolled ? (theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100') : 'text-white hover:bg-white/10'}`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <img src={user.photoURL || ''} alt="" className="h-8 w-8 rounded-full border-2 border-blue-600" />
                <button onClick={logout} className={`p-2 rounded-full ${scrolled ? (theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100') : 'text-white hover:bg-white/10'}`}>
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button onClick={login} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center">
                <LogIn className="h-4 w-4 mr-2" /> Login
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${scrolled ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-600') : 'text-white'}`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className={scrolled ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-white'}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden shadow-lg absolute top-full left-0 w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-blue-500' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {link.name}
              </a>
            ))}
            {!user && (
              <button onClick={login} className="w-full text-left px-3 py-2 text-blue-600 font-bold">Login</button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Hero Section with Parallax
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative h-screen overflow-hidden flex items-center justify-center">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-4"
      >
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6"
        >
          Premium Car Rentals <br />
          <span className="text-blue-500">For Your Journey</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Experience the thrill of driving the world's finest automobiles. 
          From luxury sedans to high-performance sports cars.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="#cars" className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all transform hover:scale-105 inline-flex items-center">
            Explore Fleet <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

// About Section
const About = () => (
  <section id="about" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: 'Premium Fleet', desc: 'We offer only the latest and most luxurious car models in the market.', icon: Car },
          { title: '24/7 Support', desc: 'Our customer support team is always available to assist you with any queries.', icon: Phone },
          { title: 'Best Prices', desc: 'Competitive pricing with no hidden charges. Transparent and fair.', icon: Star }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            whileInView={{ y: [50, 0], opacity: [0, 1] }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all text-center"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <item.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

interface CarCardProps {
  car: CarType;
  onBook: (car: CarType) => void;
}

// Car Card Component
const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 dark:border-gray-700"
  >
    <div className="relative h-64 overflow-hidden">
      <img 
        src={car.image} 
        alt={car.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
        ${car.pricePerDay}/day
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{car.name}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{car.type}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center">
          <User className="h-4 w-4 mb-1" />
          <span>{car.seats} Seats</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="h-4 w-4 mb-1" />
          <span>{car.transmission}</span>
        </div>
        <div className="flex flex-col items-center">
          <Phone className="h-4 w-4 mb-1" />
          <span>{car.fuel}</span>
        </div>
      </div>
      
      <button 
        onClick={() => onBook(car)}
        className="w-full bg-gray-900 dark:bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
      >
        Book Now
      </button>
    </div>
  </motion.div>
);

// Booking Modal
const BookingModal = ({ car, onClose, user }: { car: CarType | null; onClose: () => void; user: FirebaseUser | null }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!car) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to book a car');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          userId: user.uid,
          customerName: user.displayName,
          customerEmail: user.email,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
          totalPrice: car.pricePerDay
        })
      });

      if (!response.ok) throw new Error('Booking failed');

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg relative overflow-hidden"
      >
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400">We will contact you shortly to confirm your rental.</p>
          </div>
        ) : (
          <>
            <div className="h-48 relative">
              <img src={car.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book {car.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-6">${car.pricePerDay} per day</p>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pick-up Date</label>
                    <input type="date" required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Return Date</label>
                    <input type="date" required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Gallery Section
const Gallery = () => (
  <section id="gallery" className="py-24 bg-gray-900 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-4">Our Gallery</h2>
      <div className="w-20 h-1 bg-blue-600 mx-auto" />
    </div>
    
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      navigation
      className="pb-12 px-4"
    >
      {[
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399',
        'https://images.unsplash.com/photo-1606611013016-969c19ba27bb',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
        'https://images.unsplash.com/photo-1542362567-b055002b9134'
      ].map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="h-80 rounded-3xl overflow-hidden">
            <img src={`${img}?auto=format&fit=crop&q=80&w=800`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

// Contact Section
const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message')
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="name" required placeholder="Your Name" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-600 outline-none" />
                <input name="email" type="email" required placeholder="Your Email" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <input name="subject" required placeholder="Subject" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-600 outline-none" />
              <textarea name="message" required rows={5} placeholder="Your Message" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-600 outline-none resize-none" />
              <button 
                disabled={loading}
                className="bg-blue-600 text-white px-12 py-4 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
          
          <div className="h-[500px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="dark:grayscale dark:invert dark:opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [cars, setCars] = useState<CarType[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <Navbar user={user} theme={theme} toggleTheme={toggleTheme} />
      
      <Hero />
      
      <About />
      
      <section id="cars" className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Fleet</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} onBook={setSelectedCar} />
            ))}
          </div>
        </div>
      </section>
      
      <Gallery />
      
      <section id="testimonials" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Clients Say</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'John Doe', role: 'Business Traveler', content: 'The Tesla Model S was incredible. Seamless booking process and top-notch service.' },
              { name: 'Sarah Smith', role: 'Luxury Enthusiast', content: 'Best car rental experience I have ever had. The Porsche was in pristine condition.' },
              { name: 'Mike Johnson', role: 'Family Trip', content: 'The Range Rover was perfect for our family mountain trip. Highly recommended!' }
            ].map((t, idx) => (
              <motion.div 
                key={idx}
                whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic mb-6">"{t.content}"</p>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Contact />
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <Car className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold">DriveSelect</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                DriveSelect is the leading provider of luxury and performance car rentals. 
                We pride ourselves on offering an exceptional fleet and unparalleled customer service.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#home" className="hover:text-blue-600 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#cars" className="hover:text-blue-600 transition-colors">Fleet</a></li>
                <li><a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Contact Info</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Luxury Way, Beverly Hills</li>
                <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +1 (555) 000-1234</li>
                <li className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> Mon - Sun: 9am - 9pm</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} DriveSelect. All rights reserved.
          </div>
        </div>
      </footer>

      <BookingModal 
        car={selectedCar} 
        onClose={() => setSelectedCar(null)} 
        user={user}
      />
    </div>
  );
}
