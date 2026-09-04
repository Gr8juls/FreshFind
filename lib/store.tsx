'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Offer, 
  Business, 
  Order, 
  UserProfile, 
  Dispute,
  PlatformUser,
  PayoutRecord,
  AuditLog,
  SystemSettings,
  INITIAL_OFFERS, 
  INITIAL_BUSINESSES, 
  INITIAL_USER,
  INITIAL_DISPUTES,
  INITIAL_PLATFORM_USERS,
  INITIAL_PAYOUTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_SETTINGS
} from './mockData';
import { UserRole } from './types';
import { Language, Translations, TRANSLATIONS } from './translations';
import { GeoCoordinates, DEFAULT_KIGALI_CENTER, calculateDistanceKm, getCurrentUserLocation } from './geolocation';
import { Review, INITIAL_REVIEWS } from './reviews';
import { DropAlertSubscription, requestNotificationPermission, showAppNotification } from './pushNotifications';

export type { UserRole, Language, Translations };
export type ViewFrame = 'DESKTOP' | 'MOBILE_EMULATOR';
export type ThemeMode = 'light' | 'dark';
export type SortOption = 'DISTANCE' | 'DISCOUNT' | 'RATING' | 'DEMAND';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  role: UserRole;
  setRole: (role: UserRole) => void;
  viewFrame: ViewFrame;
  setViewFrame: (frame: ViewFrame) => void;
  
  // Geolocation & Live Distance
  userCoords: GeoCoordinates;
  isRealGps: boolean;
  userDistrict: string;
  requestGpsLocation: () => Promise<void>;
  
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (isOpen: boolean) => void;
  isQRScannerModalOpen: boolean;
  setIsQRScannerModalOpen: (isOpen: boolean) => void;
  
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  fetchSession: () => Promise<void>;
  logout: () => Promise<void>;
  
  offers: Offer[];
  businesses: Business[];
  orders: Order[];
  favorites: string[]; // businessIds
  
  // Reviews & Rating System
  reviews: Review[];
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'verifiedRescue'>) => void;
  isReviewModalOpen: boolean;
  reviewTargetOrder: Order | null;
  openReviewModal: (order: Order) => void;
  closeReviewModal: () => void;
  
  // Drop Alerts & Push Notifications
  dropSubscriptions: DropAlertSubscription[];
  subscribeToDropAlert: (businessId: string, businessName: string, offerId?: string) => Promise<boolean>;
  isSubscribedToDrop: (businessId: string) => boolean;
  
  // Admin Data & Management
  users: PlatformUser[];
  disputes: Dispute[];
  payouts: PayoutRecord[];
  auditLogs: AuditLog[];
  systemSettings: SystemSettings;
  
  // Search & Filters & Sorting
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
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
  checkoutOrder: (paymentMethod: 'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET', momoNumber?: string) => Promise<Order>;
  
  // AI & Monetization Modals
  isChefModalOpen: boolean;
  setIsChefModalOpen: (isOpen: boolean) => void;
  chefRescueOffer: Offer | null;
  setChefRescueOffer: (offer: Offer | null) => void;
  isVendorAssistantModalOpen: boolean;
  setIsVendorAssistantModalOpen: (isOpen: boolean) => void;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (isOpen: boolean) => void;
  isSnapListModalOpen: boolean;
  setIsSnapListModalOpen: (isOpen: boolean) => void;

  // Actions
  toggleFavorite: (businessId: string) => Promise<void>;
  verifyAndCollectQR: (qrToken: string) => Promise<{ success: boolean; message: string; order?: Order }>;
  createMerchantOffer: (newOffer: Omit<Offer, 'id' | 'businessLogo' | 'rating' | 'aiDemandScore' | 'aiPriceSuggestion'>) => Promise<void>;
  registerNewBusiness: (business: Omit<Business, 'id' | 'rating' | 'totalReviews' | 'distanceKm' | 'isVerified'>) => Promise<Business>;
  quickAdjustOfferStock: (offerId: string, delta: number) => void;
  cancelOfferAndRefund: (offerId: string) => Promise<void>;
  addWalletBalance: (amount: number) => Promise<void>;
  applyDynamicMarkdown: (offerId: string, newPrice: number) => void;
  upgradeBusinessSubscription: (businessId: string, tier: 'FREE' | 'PRO' | 'ENTERPRISE') => Promise<void>;
  boostOfferAsFeatured: (offerId: string, badge?: string) => Promise<void>;

  // Admin Super-Rights Actions
  approveBusiness: (businessId: string) => Promise<void>;
  suspendBusiness: (businessId: string) => Promise<void>;
  reactivateBusiness: (businessId: string) => Promise<void>;
  updateBusinessCommission: (businessId: string, commissionRate: number) => void;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  updateUserStatus: (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION') => Promise<void>;
  creditUserWallet: (userId: string, amount: number) => Promise<void>;
  resolveDispute: (disputeId: string, action: 'RESOLVED_REFUND' | 'REJECTED' | 'UNDER_REVIEW', notes?: string) => Promise<void>;
  deleteOfferByAdmin: (offerId: string) => Promise<void>;
  processMerchantPayout: (payoutId: string) => Promise<void>;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  addAuditLog: (action: string, target: string, type: AuditLog['type'], severity?: AuditLog['severity']) => void;
  updateUserProfile: (updates: { fullName?: string; phone?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [language, setLanguageState] = useState<Language>('EN');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [viewFrame, setViewFrame] = useState<ViewFrame>('DESKTOP');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isQRScannerModalOpen, setIsQRScannerModalOpen] = useState(false);
  const [isChefModalOpen, setIsChefModalOpen] = useState(false);
  const [chefRescueOffer, setChefRescueOffer] = useState<Offer | null>(null);
  const [isVendorAssistantModalOpen, setIsVendorAssistantModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSnapListModalOpen, setIsSnapListModalOpen] = useState(false);
  
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);

  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [favorites, setFavorites] = useState<string[]>(['b1', 'b4']);

  // Geolocation state
  const [userCoords, setUserCoords] = useState<GeoCoordinates>(DEFAULT_KIGALI_CENTER);
  const [isRealGps, setIsRealGps] = useState<boolean>(false);
  const [userDistrict, setUserDistrict] = useState<string>('Kigali Center');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewTargetOrder, setReviewTargetOrder] = useState<Order | null>(null);

  // Drop Alerts / Push Notifications state
  const [dropSubscriptions, setDropSubscriptions] = useState<DropAlertSubscription[]>([]);

  // Admin Data States
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_PLATFORM_USERS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('DISTANCE');
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

  // Theme and Language management and persistence
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('freshfind_theme') as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: ThemeMode = prefersDark ? 'dark' : 'light';
        setThemeState(initialTheme);
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const savedLang = localStorage.getItem('freshfind_language') as Language | null;
      if (savedLang === 'EN' || savedLang === 'FR' || savedLang === 'RW') {
        setLanguageState(savedLang);
      }

      const savedProfile = localStorage.getItem('freshfind_custom_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUser(prev => ({
            ...prev,
            fullName: parsed.fullName || prev.fullName,
            phone: parsed.phone || prev.phone,
            avatarUrl: parsed.avatarUrl || prev.avatarUrl,
          }));
        } catch (e) {}
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('freshfind_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('freshfind_language', lang);
    } catch (e) {}
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  const addAuditLog = (action: string, target: string, type: AuditLog['type'], severity: AuditLog['severity'] = 'INFO') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: user?.email || 'admin@freshfind.com',
      action,
      target,
      type,
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const fetchSession = useCallback(async () => {
    try {
      setIsLoadingSession(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setRole(data.user.role as UserRole);
          setUser(prev => ({
            ...prev,
            id: data.user.id,
            fullName: data.user.fullName || prev.fullName,
            phone: data.user.phone || prev.phone,
            avatarUrl: data.user.avatarUrl || prev.avatarUrl,
            email: data.user.email || prev.email,
            role: data.user.role,
            walletBalance: data.user.walletBalance ?? prev.walletBalance,
            points: data.user.points ?? prev.points,
            mealsRescued: data.user.mealsRescued ?? prev.mealsRescued,
            co2SavedKg: data.user.co2SavedKg ?? prev.co2SavedKg,
          }));

          // Fetch user favorites
          try {
            const favRes = await fetch('/api/favorites');
            if (favRes.ok) {
              const favData = await favRes.json();
              if (favData.favorites && favData.favorites.length > 0) {
                setFavorites(favData.favorites);
              }
            }
          } catch (e) {}

          return;
        }
      }
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Failed to fetch session', err);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  // Fetch offers dynamically from API
  const loadOffers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
      if (filterDietary.vegetarian) params.set('vegetarian', 'true');
      if (filterDietary.vegan) params.set('vegan', 'true');
      if (filterDietary.halal) params.set('halal', 'true');
      if (filterDietary.glutenFree) params.set('glutenFree', 'true');

      const res = await fetch(`/api/offers?${params.toString()}`);
      if (res.ok) {
        const payload = await res.json();
        if (payload.data && Array.isArray(payload.data) && payload.data.length > 0) {
          setOffers(payload.data);
        }
      }
    } catch (err) {
      console.error('Failed to load offers from API:', err);
    }
  }, [selectedCategory, filterDietary]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    setRole('CUSTOMER');
    window.location.href = '/login';
  };

  const addToCart = (offer: Offer) => {
    setCartOffer(offer);
    setCartQuantity(1);
  };

  const clearCart = () => {
    setCartOffer(null);
    setCartQuantity(1);
  };

  const checkoutOrder = async (
    paymentMethod: 'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET', 
    momoNumber?: string
  ): Promise<Order> => {
    if (!cartOffer) throw new Error("Cart is empty");

    const total = cartOffer.discountedPrice * cartQuantity;
    let newOrder: Order = {
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

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: cartOffer.id,
          quantity: cartQuantity,
          paymentMethod,
          phone: momoNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          newOrder = {
            ...newOrder,
            id: data.order.id || newOrder.id,
            orderNumber: data.order.orderNumber || newOrder.orderNumber,
            qrToken: data.order.qrToken || newOrder.qrToken,
          };
        }
      }
    } catch (apiErr) {
      console.warn('Orders API sync failed, continuing with optimistic state:', apiErr);
    }

    // Update inventory locally
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

  const toggleFavorite = async (businessId: string) => {
    setFavorites(prev => 
      prev.includes(businessId) ? prev.filter(id => id !== businessId) : [...prev, businessId]
    );

    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId }),
      });
    } catch (e) {
      console.warn('Favorite sync error:', e);
    }
  };

  // Geolocation methods
  const updateDistances = useCallback((coords: GeoCoordinates) => {
    setOffers(prev => prev.map(o => {
      if (o.lat && o.lng) {
        const dist = calculateDistanceKm(coords.lat, coords.lng, o.lat, o.lng);
        return { ...o, distanceKm: dist };
      }
      return o;
    }));
    setBusinesses(prev => prev.map(b => {
      if (b.lat && b.lng) {
        const dist = calculateDistanceKm(coords.lat, coords.lng, b.lat, b.lng);
        return { ...b, distanceKm: dist };
      }
      return b;
    }));
  }, []);

  const requestGpsLocation = useCallback(async () => {
    const loc = await getCurrentUserLocation();
    setUserCoords(loc.coords);
    setIsRealGps(loc.isRealGps);
    if (loc.districtName) setUserDistrict(loc.districtName);
    updateDistances(loc.coords);
  }, [updateDistances]);

  // Initial location request
  useEffect(() => {
    requestGpsLocation();
  }, [requestGpsLocation]);

  // Reviews methods
  const submitReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'verifiedRescue'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      verifiedRescue: true,
    };
    setReviews(prev => [newReview, ...prev]);

    // Update store average rating
    setBusinesses(prev => prev.map(b => {
      if (b.id === reviewData.businessId) {
        const allStoreReviews = [newReview, ...reviews.filter(r => r.businessId === b.id)];
        const avg = Number((allStoreReviews.reduce((sum, r) => sum + r.rating, 0) / allStoreReviews.length).toFixed(1));
        return { ...b, rating: avg, totalReviews: (b.totalReviews || 0) + 1 };
      }
      return b;
    }));

    // Update offer rating
    setOffers(prev => prev.map(o => {
      if (o.businessId === reviewData.businessId) {
        return { ...o, rating: Math.min(5, Number((o.rating * 0.8 + reviewData.rating * 0.2).toFixed(1))) };
      }
      return o;
    }));
  };

  const openReviewModal = (order: Order) => {
    setReviewTargetOrder(order);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewTargetOrder(null);
  };

  // Drop Alerts
  const subscribeToDropAlert = async (businessId: string, businessName: string, offerId?: string): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    const newSub: DropAlertSubscription = {
      id: `sub-${Date.now()}`,
      businessId,
      businessName,
      offerId,
      subscribedAt: new Date().toISOString(),
      active: true,
    };
    setDropSubscriptions(prev => [...prev.filter(s => s.businessId !== businessId), newSub]);
    
    showAppNotification(`🔔 Subscribed to ${businessName}!`, {
      body: `You'll be the first to know when ${businessName} drops new surprise bags.`,
    });
    return granted;
  };

  const isSubscribedToDrop = (businessId: string): boolean => {
    return dropSubscriptions.some(s => s.businessId === businessId && s.active);
  };

  // Business Onboarding
  const registerNewBusiness = async (businessData: Omit<Business, 'id' | 'rating' | 'totalReviews' | 'distanceKm' | 'isVerified'>): Promise<Business> => {
    const newBusiness: Business = {
      ...businessData,
      id: `b-${Date.now()}`,
      rating: 5.0,
      totalReviews: 1,
      distanceKm: businessData.lat && businessData.lng ? calculateDistanceKm(userCoords.lat, userCoords.lng, businessData.lat, businessData.lng) : 1.5,
      isVerified: true,
      status: 'APPROVED',
      isNewStore: true,
      totalRescuedBags: 0,
    };

    setBusinesses(prev => [newBusiness, ...prev]);
    addAuditLog('MERCHANT_SELF_ONBOARDED', newBusiness.name, 'APPROVAL', 'INFO');
    return newBusiness;
  };

  const verifyAndCollectQR = async (qrToken: string) => {
    try {
      const res = await fetch('/api/orders/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also update local list
        setOrders(prev => prev.map(o => o.qrToken.toLowerCase() === qrToken.trim().toLowerCase() ? { ...o, status: 'COMPLETED' } : o));
        return { success: true, message: data.message };
      }
    } catch (e) {}

    // Local fallback search
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

  const createMerchantOffer = async (newOfferData: Omit<Offer, 'id' | 'businessLogo' | 'rating' | 'aiDemandScore' | 'aiPriceSuggestion'>) => {
    const business = businesses.find(b => b.id === newOfferData.businessId) || businesses[0];
    
    // AI heuristic calculation
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

    try {
      await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfferData),
      });
    } catch (e) {
      console.warn('Create offer API sync failed:', e);
    }
  };

  const quickAdjustOfferStock = (offerId: string, delta: number) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        const newQty = Math.max(0, o.quantityAvailable + delta);
        return { ...o, quantityAvailable: newQty };
      }
      return o;
    }));
  };

  const cancelOfferAndRefund = async (offerId: string) => {
    const target = offers.find(o => o.id === offerId);
    setOffers(prev => prev.filter(o => o.id !== offerId));
    addAuditLog('MERCHANT_EMERGENCY_DROP_CANCELLED', target?.title || offerId, 'MODERATION', 'WARNING');
  };

  const addWalletBalance = async (amount: number) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));

    try {
      await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method: 'MTN_MOMO' }),
      });
    } catch (e) {
      console.warn('Wallet topup sync error:', e);
    }
  };

  // ================= ADMIN SUPER-RIGHTS ACTIONS =================

  const approveBusiness = async (businessId: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, isVerified: true, status: 'APPROVED' } : b));
    const target = businesses.find(b => b.id === businessId)?.name || businessId;
    addAuditLog('STORE_VERIFIED_AND_APPROVED', target, 'APPROVAL', 'INFO');

    try {
      await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true, status: 'APPROVED' }),
      });
    } catch (e) {
      console.error('Failed to sync business approval to DB', e);
    }
  };

  const suspendBusiness = async (businessId: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, isVerified: false, status: 'SUSPENDED' } : b));
    const target = businesses.find(b => b.id === businessId)?.name || businessId;
    addAuditLog('STORE_SUSPENDED', target, 'SECURITY', 'WARNING');

    try {
      await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: false, status: 'SUSPENDED' }),
      });
    } catch (e) {
      console.error('Failed to sync business suspension to DB', e);
    }
  };

  const reactivateBusiness = async (businessId: string) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, isVerified: true, status: 'APPROVED' } : b));
    const target = businesses.find(b => b.id === businessId)?.name || businessId;
    addAuditLog('STORE_REACTIVATED', target, 'APPROVAL', 'INFO');

    try {
      await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true, status: 'APPROVED' }),
      });
    } catch (e) {
      console.error('Failed to sync business reactivation to DB', e);
    }
  };

  const updateBusinessCommission = (businessId: string, commissionRate: number) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, commissionRate } : b));
    const target = businesses.find(b => b.id === businessId)?.name || businessId;
    addAuditLog(`COMMISSION_UPDATED_${commissionRate}%`, target, 'RBAC', 'INFO');
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const target = users.find(u => u.id === userId)?.email || userId;
    addAuditLog(`USER_ROLE_PROMOTED_${newRole}`, target, 'RBAC', 'WARNING');

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
    } catch (e) {
      console.error('Failed to sync role change to DB', e);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    const target = users.find(u => u.id === userId)?.email || userId;
    addAuditLog(`USER_STATUS_${newStatus}`, target, 'SECURITY', newStatus === 'SUSPENDED' ? 'CRITICAL' : 'INFO');

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error('Failed to sync user status to DB', e);
    }
  };

  const creditUserWallet = async (userId: string, amount: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalance: u.walletBalance + amount } : u));
    if (user.id === userId) {
      setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    }
    const target = users.find(u => u.id === userId)?.email || userId;
    addAuditLog(`ADMIN_WALLET_CREDIT_${amount.toLocaleString()}RWF`, target, 'REFUND', 'INFO');

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletCredit: amount }),
      });
    } catch (e) {
      console.error('Failed to sync wallet credit to DB', e);
    }
  };

  const resolveDispute = async (disputeId: string, action: 'RESOLVED_REFUND' | 'REJECTED' | 'UNDER_REVIEW', notes?: string) => {
    const targetDispute = disputes.find(d => d.id === disputeId);
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        const updatedStatus = action === 'RESOLVED_REFUND' ? 'RESOLVED' : action === 'REJECTED' ? 'REJECTED' : 'UNDER_REVIEW';
        return {
          ...d,
          status: updatedStatus,
          resolutionNotes: notes || (action === 'RESOLVED_REFUND' ? `Full refund of ${d.amount.toLocaleString()} RWF credited to customer wallet.` : 'Dispute reviewed and resolved.')
        };
      }
      return d;
    }));

    if (targetDispute) {
      if (action === 'RESOLVED_REFUND') {
        const targetUser = users.find(u => u.email.toLowerCase() === targetDispute.customerEmail.toLowerCase());
        if (targetUser) {
          creditUserWallet(targetUser.id, targetDispute.amount);
        }
        addAuditLog(`DISPUTE_REFUND_APPROVED_${targetDispute.amount}RWF`, `Order #${targetDispute.orderNumber}`, 'REFUND', 'WARNING');
      } else {
        addAuditLog(`DISPUTE_${action}`, `Order #${targetDispute.orderNumber}`, 'MODERATION', 'INFO');
      }

      try {
        await fetch(`/api/admin/disputes/${disputeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: action === 'RESOLVED_REFUND' ? 'RESOLVED' : action === 'REJECTED' ? 'REJECTED' : 'UNDER_REVIEW',
            resolution: notes,
            refundAmount: action === 'RESOLVED_REFUND' ? targetDispute.amount : undefined,
          }),
        });
      } catch (e) {
        console.error('Failed to sync dispute resolution to DB', e);
      }
    }
  };

  const deleteOfferByAdmin = async (offerId: string) => {
    const targetOffer = offers.find(o => o.id === offerId);
    setOffers(prev => prev.filter(o => o.id !== offerId));
    addAuditLog('OFFER_TAKEDOWN_MODERATION', targetOffer?.title || offerId, 'MODERATION', 'WARNING');

    try {
      await fetch(`/api/admin/offers/${offerId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to sync offer deletion to DB', e);
    }
  };

  const processMerchantPayout = async (payoutId: string) => {
    setPayouts(prev => prev.map(p => {
      if (p.id === payoutId) {
        return {
          ...p,
          status: 'PROCESSED',
          transactionRef: `MOMO-REF-${Math.floor(10000000 + Math.random() * 90000000)}`
        };
      }
      return p;
    }));
    const target = payouts.find(p => p.id === payoutId);
    addAuditLog(`PAYOUT_PROCESSED_${target?.netPayout?.toLocaleString()}RWF`, target?.businessName || payoutId, 'PAYOUT', 'INFO');

    try {
      await fetch(`/api/admin/payouts/${payoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSED' }),
      });
    } catch (e) {
      console.error('Failed to sync payout processing to DB', e);
    }
  };

  const updateSystemSettings = async (newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('GLOBAL_SYSTEM_SETTINGS_MODIFIED', JSON.stringify(newSettings), 'SECURITY', 'WARNING');

    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {
      console.error('Failed to sync system settings to DB', e);
    }
  };

  const applyDynamicMarkdown = (offerId: string, newPrice: number) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          discountedPrice: newPrice,
          aiPriceSuggestion: newPrice,
          aiDemandScore: Math.min(99, o.aiDemandScore + 6),
        };
      }
      return o;
    }));
    addAuditLog(`DYNAMIC_MARKDOWN_APPLIED_${newPrice}RWF`, offerId, 'SECURITY', 'INFO');
  };

  const upgradeBusinessSubscription = async (businessId: string, tier: 'FREE' | 'PRO' | 'ENTERPRISE') => {
    const commissionRates = { FREE: 22, PRO: 14, ENTERPRISE: 10 };
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          subscriptionTier: tier,
          commissionRate: commissionRates[tier],
          subscriptionExpiresAt: '2026-12-31',
        };
      }
      return b;
    }));
    addAuditLog(`SUBSCRIPTION_UPGRADED_${tier}`, businessId, 'RBAC', 'INFO');
  };

  const boostOfferAsFeatured = async (offerId: string, badge = '🔥 Featured Flash Drop') => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          isFeatured: true,
          featuredBadge: badge,
          aiDemandScore: 98,
        };
      }
      return o;
    }));
    addAuditLog('OFFER_BOOSTED_FEATURED', offerId, 'APPROVAL', 'INFO');
  };

  const updateUserProfile = async (updates: { fullName?: string; phone?: string; avatarUrl?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      setUser(prev => {
        const next = {
          ...prev,
          fullName: updates.fullName !== undefined ? updates.fullName : prev.fullName,
          phone: updates.phone !== undefined ? updates.phone : prev.phone,
          avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : prev.avatarUrl,
        };
        try {
          localStorage.setItem('freshfind_custom_profile', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      if (isAuthenticated) {
        const res = await fetch('/api/auth/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          const errData = await res.json();
          return { success: false, error: errData.error || 'Failed to update profile on server' };
        }
      }

      addAuditLog('USER_PROFILE_UPDATED', user?.email || 'user', 'SECURITY', 'INFO');
      return { success: true };
    } catch (err: any) {
      console.error('Failed to update user profile:', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme, toggleTheme,
      language, setLanguage, t,
      role, setRole,
      viewFrame, setViewFrame,
      userCoords, isRealGps, userDistrict, requestGpsLocation,
      isCheckoutModalOpen, setIsCheckoutModalOpen,
      isQRScannerModalOpen, setIsQRScannerModalOpen,
      isChefModalOpen, setIsChefModalOpen,
      chefRescueOffer, setChefRescueOffer,
      isVendorAssistantModalOpen, setIsVendorAssistantModalOpen,
      isSubscriptionModalOpen, setIsSubscriptionModalOpen,
      isSnapListModalOpen, setIsSnapListModalOpen,
      user, setUser,
      isAuthenticated, isLoadingSession, fetchSession, logout,
      offers, businesses, orders, favorites,
      reviews, submitReview, isReviewModalOpen, reviewTargetOrder, openReviewModal, closeReviewModal,
      dropSubscriptions, subscribeToDropAlert, isSubscribedToDrop,
      users, disputes, payouts, auditLogs, systemSettings,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      sortBy, setSortBy,
      filterDietary, setFilterDietary,
      maxDistanceKm, setMaxDistanceKm,
      cartOffer, cartQuantity, setCartQuantity, addToCart, clearCart, checkoutOrder,
      toggleFavorite, verifyAndCollectQR, createMerchantOffer, registerNewBusiness, quickAdjustOfferStock, cancelOfferAndRefund, addWalletBalance,
      applyDynamicMarkdown, upgradeBusinessSubscription, boostOfferAsFeatured,
      approveBusiness, suspendBusiness, reactivateBusiness, updateBusinessCommission,
      updateUserRole, updateUserStatus, creditUserWallet, resolveDispute,
      deleteOfferByAdmin, processMerchantPayout, updateSystemSettings, addAuditLog,
      updateUserProfile
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
