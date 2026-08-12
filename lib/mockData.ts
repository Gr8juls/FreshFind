export interface Business {
  id: string;
  name: string;
  slug: string;
  category: 'Bakery' | 'Supermarket' | 'Restaurant' | 'Hotel' | 'Cafe';
  description: string;
  address: string;
  district: string;
  rating: number;
  totalReviews: number;
  distanceKm: number;
  logoUrl: string;
  bannerUrl: string;
  openingHours: string;
  isVerified: boolean;
  phone: string;
}

export interface Offer {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  quantityTotal: number;
  quantityAvailable: number;
  pickupStart: string; // e.g. "17:30"
  pickupEnd: string;   // e.g. "19:00"
  imageUrl: string;
  distanceKm: number;
  rating: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isHalal: boolean;
  isGlutenFree: boolean;
  aiDemandScore: number; // 0-100%
  aiPriceSuggestion: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  offerId: string;
  offerTitle: string;
  businessName: string;
  quantity: number;
  totalPrice: number;
  status: 'RESERVED' | 'PAID' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  qrToken: string;
  createdAt: string;
  pickupWindow: string;
  paymentMethod: 'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN';
  walletBalance: number;
  points: number;
  badgeTier: string;
  mealsRescued: number;
  co2SavedKg: number;
  foodWeightKg: number;
}

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Kigali Artisan Bakery',
    slug: 'kigali-artisan-bakery',
    category: 'Bakery',
    description: 'Freshly baked sourdough, pastries, and French croissants crafted daily.',
    address: 'KG 9 Ave, Nyarutarama',
    district: 'Kigali',
    rating: 4.9,
    totalReviews: 128,
    distanceKm: 0.8,
    logoUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '07:00 - 20:00',
    isVerified: true,
    phone: '+250 788 123 456',
  },
  {
    id: 'b2',
    name: 'Bourbon Coffee & Bistro',
    slug: 'bourbon-coffee-bistro',
    category: 'Cafe',
    description: 'Premium Rwandan specialty coffee, gourmet sandwiches, and evening appetizers.',
    address: 'KN 4 Ave, UTC Building, Kiyovu',
    district: 'Kigali',
    rating: 4.8,
    totalReviews: 240,
    distanceKm: 1.2,
    logoUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '06:30 - 21:00',
    isVerified: true,
    phone: '+250 788 987 654',
  },
  {
    id: 'b3',
    name: 'Simba Supermarket Express',
    slug: 'simba-supermarket',
    category: 'Supermarket',
    description: 'Fresh produce, deli platters, artisan cheeses, and daily pre-packaged ready meals.',
    address: 'KG 7 Ave, Kacyiru',
    district: 'Kigali',
    rating: 4.7,
    totalReviews: 410,
    distanceKm: 2.1,
    logoUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '08:00 - 22:00',
    isVerified: true,
    phone: '+250 788 555 777',
  },
  {
    id: 'b4',
    name: 'Grand Legacy Hotel Buffet',
    slug: 'grand-legacy-hotel',
    category: 'Hotel',
    description: '5-Star continental & African buffet surplus featuring roasted meats, grilled fish, and salads.',
    address: 'KG 564 St, Remera',
    district: 'Kigali',
    rating: 4.95,
    totalReviews: 89,
    distanceKm: 3.4,
    logoUrl: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '06:00 - 22:30',
    isVerified: true,
    phone: '+250 788 222 333',
  },
  {
    id: 'b5',
    name: 'Green Leaf Organic Salad Bar',
    slug: 'green-leaf-salad-bar',
    category: 'Restaurant',
    description: 'Farm-to-table organic salad bowls, fresh avocado toast, and fruit juices.',
    address: 'KG 11 Ave, Kimihurura',
    district: 'Kigali',
    rating: 4.85,
    totalReviews: 165,
    distanceKm: 1.5,
    logoUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '09:00 - 20:30',
    isVerified: true,
    phone: '+250 788 444 888',
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    businessId: 'b1',
    businessName: 'Kigali Artisan Bakery',
    businessLogo: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Surprise Artisan Pastry Box',
    description: 'Assorted fresh pastries including almond croissants, pain au chocolat, fruit tarts, and whole grain baguettes.',
    category: 'Bakery',
    originalPrice: 15000,
    discountedPrice: 4500,
    currency: 'RWF',
    quantityTotal: 8,
    quantityAvailable: 3,
    pickupStart: '18:00',
    pickupEnd: '19:30',
    imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 0.8,
    rating: 4.9,
    isVegetarian: true,
    isVegan: false,
    isHalal: true,
    isGlutenFree: false,
    aiDemandScore: 94,
    aiPriceSuggestion: 4800,
  },
  {
    id: 'off-2',
    businessId: 'b2',
    businessName: 'Bourbon Coffee & Bistro',
    businessLogo: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Gourmet Sandwich & Snack Bundle',
    description: 'Grilled chicken panini, avocado toast, fresh fruit cup, and cold brew coffee.',
    category: 'Cafe',
    originalPrice: 18000,
    discountedPrice: 6000,
    currency: 'RWF',
    quantityTotal: 6,
    quantityAvailable: 4,
    pickupStart: '19:00',
    pickupEnd: '20:30',
    imageUrl: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 1.2,
    rating: 4.8,
    isVegetarian: false,
    isVegan: false,
    isHalal: true,
    isGlutenFree: false,
    aiDemandScore: 88,
    aiPriceSuggestion: 5800,
  },
  {
    id: 'off-3',
    businessId: 'b3',
    businessName: 'Simba Supermarket Express',
    businessLogo: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Fresh Grocery & Deli Rescue Bag',
    description: 'Pre-packaged roasted chicken meal, organic Greek yogurt, berries, and artisan sourdough loaf.',
    category: 'Supermarket',
    originalPrice: 24000,
    discountedPrice: 7500,
    currency: 'RWF',
    quantityTotal: 10,
    quantityAvailable: 5,
    pickupStart: '20:00',
    pickupEnd: '21:30',
    imageUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 2.1,
    rating: 4.7,
    isVegetarian: false,
    isVegan: false,
    isHalal: true,
    isGlutenFree: true,
    aiDemandScore: 91,
    aiPriceSuggestion: 7200,
  },
  {
    id: 'off-4',
    businessId: 'b4',
    businessName: 'Grand Legacy Hotel Buffet',
    businessLogo: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Executive Buffet Feast Box',
    description: 'Generous tray of grilled tilapia, coconut rice, roasted vegetables, and tiramisu dessert.',
    category: 'Hotel',
    originalPrice: 35000,
    discountedPrice: 9500,
    currency: 'RWF',
    quantityTotal: 5,
    quantityAvailable: 2,
    pickupStart: '21:00',
    pickupEnd: '22:15',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 3.4,
    rating: 4.95,
    isVegetarian: false,
    isVegan: false,
    isHalal: true,
    isGlutenFree: true,
    aiDemandScore: 97,
    aiPriceSuggestion: 9800,
  },
  {
    id: 'off-5',
    businessId: 'b5',
    businessName: 'Green Leaf Organic Salad Bar',
    businessLogo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Superfood Vegan Protein Bowl',
    description: 'Quinoa, roasted sweet potato, kale, edamame, avocado hummus, and raw cold-pressed juice.',
    category: 'Restaurant',
    originalPrice: 16000,
    discountedPrice: 5000,
    currency: 'RWF',
    quantityTotal: 7,
    quantityAvailable: 6,
    pickupStart: '18:30',
    pickupEnd: '20:00',
    imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 1.5,
    rating: 4.85,
    isVegetarian: true,
    isVegan: true,
    isHalal: true,
    isGlutenFree: true,
    aiDemandScore: 85,
    aiPriceSuggestion: 4900,
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-101',
  fullName: 'Jean-Luc Rutagangwa',
  email: 'jeanluc@freshfind.rw',
  phone: '+250 788 333 444',
  avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
  role: 'CUSTOMER',
  walletBalance: 24500,
  points: 480,
  badgeTier: 'Waste Warrior 🌿',
  mealsRescued: 18,
  co2SavedKg: 45.2,
  foodWeightKg: 18.5,
};
