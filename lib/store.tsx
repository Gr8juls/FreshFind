'use client';

import React, { createContext, useContext, useState } from 'react';
import { Offer, Business, Order, UserProfile, INITIAL_OFFERS, INITIAL_BUSINESSES, INITIAL_USER } from './mockData';

export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN';
export type ViewFrame = 'DESKTOP' | 'MOBILE_EMULATOR';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  viewFrame: ViewFrame;
  setViewFrame: (frame: ViewFrame) => void;
  
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  
  offers: Offer[];
  businesses: Business[];
  orders: Order[];
  favorites: string[]; // businessIds
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filterDietary: {
    vegetarian: boolean;
    vegan: boolean;
    halal: boolean;
    glutenFree: boolean;
  };
  setFilterDietary: React.Dispatch<React.SetStateAction<{
    vegetarian: boolean;
    vegan: boolean;
    halal: boolean;
    glutenFree: boolean;
  }>>;
  maxDistanceKm: number;
  setMaxDistanceKm: (dist: number) => void;
  
  // Cart & Orders
  cartOffer: Offer | null;
  cartQuantity: number;
  setCartQuantity: (qty: number) => void;
  addToCart: (offer: Offer) => void;
  clearCart: () => void;
  checkoutOrder: (paymentMethod: 'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET', momoNumber?: string) => Order;
  
  // Actions
  toggleFavorite: (businessId: string) => void;
  verifyAndCollectQR: (qrToken: string) => { success: boolean; message: string; order?: Order };
  createMerchantOffer: (newOffer: Omit<Offer, 'id' | 'businessLogo' | 'rating' | 'aiDemandScore' | 'aiPriceSuggestion'>) => void;
  approveBusiness: (businessId: string) => void;
  addWalletBalance: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [viewFrame, setViewFrame] = useState<ViewFrame>('DESKTOP');
  
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [favorites, setFavorites] = useState<string[]>(['b1', 'b4']);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterDietary, setFilterDietary] = useState({
    vegetarian: false,
    vegan: false,
    halal: false,
    glutenFree: false,
  });
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  
  // Cart
  const [cartOffer, setCartOffer] = useState<Offer | null>(null);
  const [cartQuantity, setCartQuantity] = useState(1);

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-901',
      orderNumber: 'FF-2026-901',
      offerId: 'off-1',
      offerTitle: 'Surprise Artisan Pastry Box',
      businessName: 'Kigali Artisan Bakery',
      quantity: 1,
      totalPrice: 4500,
      status: 'PAID',
      qrToken: 'QR-FF-901-KIGALI-BAKERY',
      createdAt: new Date().toISOString(),
      pickupWindow: 'Today 18:00 - 19:30',
      paymentMethod: 'MTN_MOMO',
    }
  ]);

  const addToCart = (offer: Offer) => {
    setCartOffer(offer);
    setCartQuantity(1);
  };

  const clearCart = () => {
    setCartOffer(null);
    setCartQuantity(1);
  };

  const checkoutOrder = (paymentMethod: 'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET', momoNumber?: string): Order => {
    if (!cartOffer) throw new Error("Cart is empty");

    const total = cartOffer.discountedPrice * cartQuantity;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `FF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      offerId: cartOffer.id,
      offerTitle: cartOffer.title,
      businessName: cartOffer.businessName,
      quantity: cartQuantity,
      totalPrice: total,
      status: 'PAID',
      qrToken: `QR-FF-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      pickupWindow: `Today ${cartOffer.pickupStart} - ${cartOffer.pickupEnd}`,
      paymentMethod,
    };

    // Update inventory
    setOffers(prev => prev.map(o => o.id === cartOffer.id ? { ...o, quantityAvailable: Math.max(0, o.quantityAvailable - cartQuantity) } : o));
    
    // Update user impact & wallet if used
    setUser(prev => ({
      ...prev,
      walletBalance: paymentMethod === 'WALLET' ? Math.max(0, prev.walletBalance - total) : prev.walletBalance,
      mealsRescued: prev.mealsRescued + cartQuantity,
      co2SavedKg: Number((prev.co2SavedKg + (cartQuantity * 2.5)).toFixed(1)),
      points: prev.points + (cartQuantity * 50),
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const toggleFavorite = (businessId: string) => {
    setFavorites(prev => 
      prev.includes(businessId) ? prev.filter(id => id !== businessId) : [...prev, businessId]
    );
  };

  const verifyAndCollectQR = (qrToken: string) => {
    const orderIndex = orders.findIndex(o => o.qrToken.toLowerCase() === qrToken.trim().toLowerCase());
    if (orderIndex === -1) {
      return { success: false, message: 'Invalid or unrecognized QR Code token.' };
    }
    
    const targetOrder = orders[orderIndex];
    if (targetOrder.status === 'COMPLETED') {
      return { success: false, message: `Order #${targetOrder.orderNumber} has ALREADY been collected.` };
    }

    const updatedOrder: Order = { ...targetOrder, status: 'COMPLETED' };
    setOrders(prev => prev.map(o => o.id === targetOrder.id ? updatedOrder : o));
    return { success: true, message: `Order #${targetOrder.orderNumber} successfully verified & marked as COMPLETED!`, order: updatedOrder };
  };

  const createMerchantOffer = (newOfferData: Omit<Offer, 'id' | 'businessLogo' | 'rating' | 'aiDemandScore' | 'aiPriceSuggestion'>) => {
    const business = businesses.find(b => b.id === newOfferData.businessId) || businesses[0];
    
    // Simple AI heuristic calculation
    const discountRatio = (newOfferData.originalPrice - newOfferData.discountedPrice) / newOfferData.originalPrice;
    const aiDemandScore = Math.min(99, Math.round(60 + (discountRatio * 40)));
    const aiPriceSuggestion = Math.round(newOfferData.originalPrice * 0.35);

    const createdOffer: Offer = {
      ...newOfferData,
      id: `off-${Date.now()}`,
      businessLogo: business.logoUrl,
      rating: business.rating,
      aiDemandScore,
      aiPriceSuggestion,
    };

    setOffers(prev => [createdOffer, ...prev]);
  };

  const approveBusiness = (businessId: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, isVerified: true } : b));
  };

  const addWalletBalance = (amount: number) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      viewFrame, setViewFrame,
      user, setUser,
      offers, businesses, orders, favorites,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      filterDietary, setFilterDietary,
      maxDistanceKm, setMaxDistanceKm,
      cartOffer, cartQuantity, setCartQuantity, addToCart, clearCart, checkoutOrder,
      toggleFavorite, verifyAndCollectQR, createMerchantOffer, approveBusiness, addWalletBalance,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
