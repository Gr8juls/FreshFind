export interface Review {
  id: string;
  businessId: string;
  orderId?: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  tags?: string[];
  offerTitle?: string;
  helpfulCount: number;
  verifiedRescue: boolean;
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    businessId: 'b1',
    userName: 'Aline Umutoni',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Incredible value! Got 3 warm almond croissants, 2 pain au chocolat, and a full sourdough loaf. Everything tasted fresh like morning bake!',
    createdAt: '2026-08-28',
    tags: ['Generous Portion', 'Super Fresh', 'Friendly Staff'],
    offerTitle: 'Surprise Artisan Pastry Box',
    helpfulCount: 14,
    verifiedRescue: true,
  },
  {
    id: 'rev-2',
    businessId: 'b1',
    userName: 'Kevine Gasana',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'The pickup was so smooth with the QR code. The staff knew FreshFind immediately and handed me a packed surprise bag within 30 seconds.',
    createdAt: '2026-08-26',
    tags: ['Fast Pickup', 'Great Value'],
    offerTitle: 'Surprise Artisan Pastry Box',
    helpfulCount: 9,
    verifiedRescue: true,
  },
  {
    id: 'rev-3',
    businessId: 'b2',
    userName: 'Eric Mugisha',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'The grilled chicken panini was huge and still warm. Also came with delicious cold brew coffee and fresh pineapple slices. 10/10.',
    createdAt: '2026-08-29',
    tags: ['Generous Portion', 'Eco Friendly'],
    offerTitle: 'Gourmet Sandwich & Snack Magic Bag',
    helpfulCount: 12,
    verifiedRescue: true,
  },
  {
    id: 'rev-4',
    businessId: 'b4',
    userName: 'Claire Uwase',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Five-star hotel quality food for 9,500 RWF! Tilapia was perfectly cooked with coconut rice and tiramisu. Fed two of us for dinner.',
    createdAt: '2026-08-27',
    tags: ['Delicious Feast', 'Luxury Rescue', 'Huge Savings'],
    offerTitle: 'Executive Buffet Feast Magic Box',
    helpfulCount: 21,
    verifiedRescue: true,
  },
  {
    id: 'rev-5',
    businessId: 'b3',
    userName: 'Fabrice Ndahiro',
    userAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    comment: 'Great deli groceries rescue. Fresh berries, Greek yogurt, and whole chicken. Saved over 16,000 RWF compared to shelf prices.',
    createdAt: '2026-08-25',
    tags: ['Great Savings', 'Healthy Options'],
    offerTitle: 'Fresh Grocery & Deli Rescue Box',
    helpfulCount: 6,
    verifiedRescue: true,
  },
  {
    id: 'rev-6',
    businessId: 'b5',
    userName: 'Divine Mukamana',
    userAvatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Best vegan surprise bowl in Kigali. Quinoa, hummus, organic avocado and cold-pressed orange juice. Clean and super healthy!',
    createdAt: '2026-08-30',
    tags: ['100% Vegan', 'Clean Eating', 'Fresh Juice'],
    offerTitle: 'Superfood Vegan Surplus Bowl',
    helpfulCount: 8,
    verifiedRescue: true,
  }
];

export const POPULAR_REVIEW_TAGS = [
  'Generous Portion 🥐',
  'Super Fresh 🥗',
  'Fast Pickup ⚡',
  'Huge Savings 💰',
  'Friendly Staff 😊',
  'Eco Hero 🌿',
  'Would Rescue Again ⭐',
];
