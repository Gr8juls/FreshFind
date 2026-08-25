import type { UserRole } from './types';
export type { UserRole };

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
  status?: 'APPROVED' | 'PENDING_APPROVAL' | 'SUSPENDED';
  commissionRate?: number;
  tinNumber?: string;
  payoutPhone?: string;
  lat?: number;
  lng?: number;
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
  bagType?: 'Surprise Pastry Bag' | 'Surprise Meal Box' | 'Surprise Groceries Box' | 'Buffet Feast Box' | 'Vegan Surplus Bowl' | 'General Magic Bag';
  guaranteedValue?: number;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  quantityTotal: number;
  quantityAvailable: number;
  pickupStart: string; // e.g. "18:00"
  pickupEnd: string;   // e.g. "19:30"
  pickupTiming?: 'TODAY' | 'TOMORROW';
  nextDropTime?: string; // e.g. "Tomorrow 16:30"
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
  collectionType?: 'SELF_PICKUP' | 'MOTARI_COURIER';
  courierPin?: string;
  co2SavedKg?: number;
  mealsRescued?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
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
    status: 'APPROVED',
    commissionRate: 15,
    tinNumber: 'TIN-88291024',
    payoutPhone: '+250 788 123 456',
    lat: -1.9355,
    lng: 30.0880,
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
    status: 'APPROVED',
    commissionRate: 15,
    tinNumber: 'TIN-44210982',
    payoutPhone: '+250 788 987 654',
    lat: -1.9536,
    lng: 30.0605,
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
    status: 'APPROVED',
    commissionRate: 12,
    tinNumber: 'TIN-11930291',
    payoutPhone: '+250 788 555 777',
    lat: -1.9440,
    lng: 30.0750,
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
    status: 'APPROVED',
    commissionRate: 15,
    tinNumber: 'TIN-55092183',
    payoutPhone: '+250 788 222 333',
    lat: -1.9560,
    lng: 30.1080,
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
    status: 'APPROVED',
    commissionRate: 15,
    tinNumber: 'TIN-77382910',
    payoutPhone: '+250 788 444 888',
    lat: -1.9520,
    lng: 30.0780,
    phone: '+250 788 444 888',
  },
  {
    id: 'b6',
    name: 'Inzora Rooftop Cafe',
    slug: 'inzora-rooftop-cafe',
    category: 'Cafe',
    description: 'Specialty teas, fresh gluten-free carrot cake, granola yogurt parfaits, and lemonade.',
    address: 'KG 5 Ave, Kacyiru Library Roof',
    district: 'Kigali',
    rating: 4.8,
    totalReviews: 54,
    distanceKm: 2.8,
    logoUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '08:30 - 20:00',
    isVerified: false,
    status: 'PENDING_APPROVAL',
    commissionRate: 15,
    tinNumber: 'TIN-99482710',
    payoutPhone: '+250 788 111 222',
    lat: -1.9410,
    lng: 30.0720,
    phone: '+250 788 111 222',
  },
  {
    id: 'b7',
    name: 'Kigali Delicacy Pizzeria',
    slug: 'kigali-delicacy-pizzeria',
    category: 'Restaurant',
    description: 'Authentic stone-oven pizzas and Italian pasta surplus batches.',
    address: 'KN 3 Rd, Downtown Kigali',
    district: 'Kigali',
    rating: 4.1,
    totalReviews: 32,
    distanceKm: 4.0,
    logoUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800',
    openingHours: '11:00 - 23:00',
    isVerified: false,
    status: 'PENDING_APPROVAL',
    commissionRate: 15,
    tinNumber: 'TIN-33201948',
    lat: -1.9480,
    lng: 30.0570,
    phone: '+250 788 777 999',
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    businessId: 'b1',
    businessName: 'Kigali Artisan Bakery',
    businessLogo: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Surprise Artisan Pastry Box',
    bagType: 'Surprise Pastry Bag',
    guaranteedValue: 15000,
    description: 'Assorted fresh surplus pastries including almond croissants, pain au chocolat, fruit tarts, and whole grain sourdough baguettes. Guaranteed min. 3.3x value!',
    category: 'Bakery',
    originalPrice: 15000,
    discountedPrice: 4500,
    currency: 'RWF',
    quantityTotal: 8,
    quantityAvailable: 3,
    pickupStart: '18:00',
    pickupEnd: '19:30',
    pickupTiming: 'TODAY',
    nextDropTime: 'Tomorrow 16:00',
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
    title: 'Gourmet Sandwich & Snack Magic Bag',
    bagType: 'Surprise Meal Box',
    guaranteedValue: 18000,
    description: 'Grilled chicken panini, avocado toast, fresh seasonal fruit bowl, and cold brew coffee combo.',
    category: 'Cafe',
    originalPrice: 18000,
    discountedPrice: 6000,
    currency: 'RWF',
    quantityTotal: 6,
    quantityAvailable: 4,
    pickupStart: '19:00',
    pickupEnd: '20:30',
    pickupTiming: 'TODAY',
    nextDropTime: 'Tomorrow 17:00',
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
    title: 'Fresh Grocery & Deli Rescue Box',
    bagType: 'Surprise Groceries Box',
    guaranteedValue: 24000,
    description: 'Pre-packaged roasted chicken meal, organic Greek yogurt, fresh berries, and artisan sourdough loaf.',
    category: 'Supermarket',
    originalPrice: 24000,
    discountedPrice: 7500,
    currency: 'RWF',
    quantityTotal: 10,
    quantityAvailable: 5,
    pickupStart: '20:00',
    pickupEnd: '21:30',
    pickupTiming: 'TODAY',
    nextDropTime: 'Tomorrow 18:00',
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
    title: 'Executive Buffet Feast Magic Box',
    bagType: 'Buffet Feast Box',
    guaranteedValue: 35000,
    description: 'Generous gourmet tray of grilled tilapia, coconut rice, roasted vegetables, and tiramisu dessert from evening banquet surplus.',
    category: 'Hotel',
    originalPrice: 35000,
    discountedPrice: 9500,
    currency: 'RWF',
    quantityTotal: 5,
    quantityAvailable: 2,
    pickupStart: '21:00',
    pickupEnd: '22:15',
    pickupTiming: 'TODAY',
    nextDropTime: 'Tomorrow 19:30',
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
    title: 'Superfood Vegan Surplus Bowl',
    bagType: 'Vegan Surplus Bowl',
    guaranteedValue: 16000,
    description: 'Quinoa, roasted sweet potato, organic kale, edamame, avocado hummus, and raw cold-pressed juice.',
    category: 'Restaurant',
    originalPrice: 16000,
    discountedPrice: 5000,
    currency: 'RWF',
    quantityTotal: 7,
    quantityAvailable: 6,
    pickupStart: '08:30',
    pickupEnd: '10:00',
    pickupTiming: 'TOMORROW',
    nextDropTime: 'Tomorrow 07:30',
    imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 1.5,
    rating: 4.85,
    isVegetarian: true,
    isVegan: true,
    isHalal: true,
    isGlutenFree: true,
    aiDemandScore: 85,
    aiPriceSuggestion: 4900,
  },
  {
    id: 'off-6',
    businessId: 'b6',
    businessName: 'Inzora Rooftop Cafe',
    businessLogo: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=150',
    title: 'Morning Bakery & Cold Tea Bag',
    bagType: 'Surprise Pastry Bag',
    guaranteedValue: 12000,
    description: 'Gluten-free spiced carrot cake, fresh granola yogurt parfait, and hibiscus iced tea.',
    category: 'Cafe',
    originalPrice: 12000,
    discountedPrice: 4000,
    currency: 'RWF',
    quantityTotal: 4,
    quantityAvailable: 0,
    pickupStart: '09:00',
    pickupEnd: '10:30',
    pickupTiming: 'TOMORROW',
    nextDropTime: 'Tomorrow 08:00',
    imageUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
    distanceKm: 2.8,
    rating: 4.8,
    isVegetarian: true,
    isVegan: false,
    isHalal: true,
    isGlutenFree: true,
    aiDemandScore: 92,
    aiPriceSuggestion: 4000,
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

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  reason: string;
  amount: number;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  resolutionNotes?: string;
}

export interface PlatformUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  walletBalance: number;
  createdAt: string;
  totalOrders: number;
}

export interface PayoutRecord {
  id: string;
  businessId: string;
  businessName: string;
  period: string;
  grossSales: number;
  commissionAmount: number;
  netPayout: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  paymentMethod: 'MTN_MOMO' | 'BANK_TRANSFER';
  payoutPhone: string;
  transactionRef?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  type: 'APPROVAL' | 'REFUND' | 'SECURITY' | 'MODERATION' | 'PAYOUT' | 'RBAC';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface SystemSettings {
  platformCommissionRate: number;
  reservationHoldMinutes: number;
  autoApproveVerifiedMerchants: boolean;
  maintenanceMode: boolean;
  smsNotificationsEnabled: boolean;
  auditLoggingEnabled: boolean;
}

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'dsp-101',
    orderId: 'ord-882',
    orderNumber: 'FF-2026-882',
    customerName: 'Aline Umutoni',
    customerEmail: 'aline.u@gmail.com',
    businessName: 'Kigali Artisan Bakery',
    reason: 'Store closed 15 minutes before the stated pickup window ended.',
    amount: 4500,
    status: 'OPEN',
    createdAt: '2026-08-19 09:15',
  },
  {
    id: 'dsp-102',
    orderId: 'ord-790',
    orderNumber: 'FF-2026-790',
    customerName: 'Eric Mugisha',
    customerEmail: 'eric.m@rwanda.com',
    businessName: 'Simba Supermarket Express',
    reason: 'Received standard groceries instead of the promised deli rescue package.',
    amount: 7500,
    status: 'UNDER_REVIEW',
    createdAt: '2026-08-18 19:40',
  },
  {
    id: 'dsp-103',
    orderId: 'ord-654',
    orderNumber: 'FF-2026-654',
    customerName: 'Claire Uwase',
    customerEmail: 'claire.u@yahoo.fr',
    businessName: 'Grand Legacy Hotel Buffet',
    reason: 'Duplicate payment deduction on MTN Mobile Money.',
    amount: 9500,
    status: 'RESOLVED',
    createdAt: '2026-08-17 21:10',
    resolutionNotes: 'Refund of 9,500 RWF credited directly to Customer Eco-Wallet.',
  }
];

export const INITIAL_PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'usr-101',
    fullName: 'Jean-Luc Rutagangwa',
    email: 'jeanluc@freshfind.rw',
    phone: '+250 788 333 444',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    walletBalance: 24500,
    createdAt: '2026-01-12',
    totalOrders: 18,
  },
  {
    id: 'usr-102',
    fullName: 'Kigali Bakery Merchant',
    email: 'manager@kigalibakery.rw',
    phone: '+250 788 123 456',
    role: 'BUSINESS_OWNER',
    status: 'ACTIVE',
    walletBalance: 142000,
    createdAt: '2026-02-01',
    totalOrders: 210,
  },
  {
    id: 'usr-103',
    fullName: 'FreshFind Administrator',
    email: 'admin@freshfind.com',
    phone: '+250 788 000 001',
    role: 'ADMIN',
    status: 'ACTIVE',
    walletBalance: 500000,
    createdAt: '2026-01-01',
    totalOrders: 0,
  },
  {
    id: 'usr-104',
    fullName: 'Aline Umutoni',
    email: 'aline.u@gmail.com',
    phone: '+250 788 444 555',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    walletBalance: 12000,
    createdAt: '2026-03-10',
    totalOrders: 6,
  },
  {
    id: 'usr-105',
    fullName: 'Simba Express Manager',
    email: 'ops@simbasupermarket.rw',
    phone: '+250 788 555 777',
    role: 'BUSINESS_OWNER',
    status: 'ACTIVE',
    walletBalance: 320000,
    createdAt: '2026-02-15',
    totalOrders: 410,
  },
  {
    id: 'usr-106',
    fullName: 'Inzora Rooftop Cafe Owner',
    email: 'owner@inzora.rw',
    phone: '+250 788 111 222',
    role: 'BUSINESS_OWNER',
    status: 'PENDING_VERIFICATION',
    walletBalance: 0,
    createdAt: '2026-08-15',
    totalOrders: 0,
  }
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-001',
    businessId: 'b1',
    businessName: 'Kigali Artisan Bakery',
    period: 'Aug 1 - Aug 15, 2026',
    grossSales: 640000,
    commissionAmount: 96000,
    netPayout: 544000,
    status: 'PENDING',
    paymentMethod: 'MTN_MOMO',
    payoutPhone: '+250 788 123 456',
  },
  {
    id: 'pay-002',
    businessId: 'b2',
    businessName: 'Bourbon Coffee & Bistro',
    period: 'Aug 1 - Aug 15, 2026',
    grossSales: 820000,
    commissionAmount: 123000,
    netPayout: 697000,
    status: 'PENDING',
    paymentMethod: 'MTN_MOMO',
    payoutPhone: '+250 788 987 654',
  },
  {
    id: 'pay-003',
    businessId: 'b4',
    businessName: 'Grand Legacy Hotel Buffet',
    period: 'Aug 1 - Aug 15, 2026',
    grossSales: 1250000,
    commissionAmount: 187500,
    netPayout: 1062500,
    status: 'PROCESSED',
    paymentMethod: 'BANK_TRANSFER',
    payoutPhone: '+250 788 222 333',
    transactionRef: 'BK-TRF-99201948',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-19 11:25:59',
    actor: 'admin@freshfind.com',
    action: 'ADMIN_SIGN_IN',
    target: 'System Command Center',
    type: 'SECURITY',
    severity: 'INFO',
  },
  {
    id: 'log-002',
    timestamp: '2026-08-19 10:45:12',
    actor: 'admin@freshfind.com',
    action: 'STORE_VERIFIED',
    target: 'Grand Legacy Hotel Buffet (b4)',
    type: 'APPROVAL',
    severity: 'INFO',
  },
  {
    id: 'log-003',
    timestamp: '2026-08-18 16:30:00',
    actor: 'admin@freshfind.com',
    action: 'DISPUTE_REFUND_ISSUED',
    target: 'Order #FF-2026-654 (Claire Uwase)',
    type: 'REFUND',
    severity: 'WARNING',
  },
  {
    id: 'log-004',
    timestamp: '2026-08-18 12:00:00',
    actor: 'admin@freshfind.com',
    action: 'COMMISSION_RATE_UPDATED',
    target: 'Simba Supermarket Express -> 12%',
    type: 'RBAC',
    severity: 'INFO',
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  platformCommissionRate: 15,
  reservationHoldMinutes: 15,
  autoApproveVerifiedMerchants: false,
  maintenanceMode: false,
  smsNotificationsEnabled: true,
  auditLoggingEnabled: true,
};

