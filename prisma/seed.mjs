import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freshfind';

// ─── Inline Schemas for Seed Script ──────────────────────────────────────────
const UserWalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'RWF' },
}, { _id: true });

const LoyaltyAccountSchema = new mongoose.Schema({
  points: { type: Number, default: 0 },
  badgeTier: { type: String, default: 'Eco Novice' },
  mealsRescued: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: String,
  fullName: { type: String, required: true },
  role: { type: String, default: 'CUSTOMER', index: true },
  status: { type: String, default: 'ACTIVE' },
  emailVerified: { type: Boolean, default: true },
  phoneVerified: { type: Boolean, default: false },
  wallet: { type: UserWalletSchema, default: null },
  loyaltyAccount: { type: LoyaltyAccountSchema, default: null },
}, { timestamps: true });

const BusinessSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  logoUrl: String,
  bannerUrl: String,
  phone: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'APPROVED' },
  isVerified: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8 },
  totalReviews: { type: Number, default: 12 },
  location: {
    addressLine1: String,
    city: String,
    district: String,
    country: { type: String, default: 'Rwanda' },
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas\n');

  const salt = await bcrypt.genSalt(10);

  // 1. Admin / Super Admin
  const adminEmail = 'admin@freshfind.com';
  const adminPassword = 'Admin@123456';
  const adminHash = await bcrypt.hash(adminPassword, salt);

  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        passwordHash: adminHash,
        fullName: 'Super Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        wallet: { balance: 0, currency: 'RWF' },
        loyaltyAccount: { points: 5000, badgeTier: 'Impact Hero', mealsRescued: 50, co2SavedKg: 125 },
      },
    },
    { upsert: true, new: true }
  );

  // 2. Business Owner (Merchant)
  const businessEmail = 'business@freshfind.com';
  const businessPassword = 'Business@123';
  const businessHash = await bcrypt.hash(businessPassword, salt);

  const businessOwner = await User.findOneAndUpdate(
    { email: businessEmail },
    {
      $set: {
        passwordHash: businessHash,
        fullName: 'Kigali Artisan Bakery',
        role: 'BUSINESS_OWNER',
        status: 'ACTIVE',
        emailVerified: true,
        wallet: { balance: 45000, currency: 'RWF' },
        loyaltyAccount: { points: 500, badgeTier: 'Eco Warrior', mealsRescued: 20, co2SavedKg: 50 },
      },
    },
    { upsert: true, new: true }
  );

  // Ensure Business Record for Business Owner
  await Business.findOneAndUpdate(
    { ownerId: businessOwner._id.toString() },
    {
      $set: {
        name: 'Kigali Artisan Bakery',
        slug: 'kigali-artisan-bakery',
        description: 'Fresh organic sourdough breads, gourmet pastries, and healthy treats at surplus discount prices.',
        phone: '+250788123456',
        email: businessEmail,
        status: 'APPROVED',
        isVerified: true,
        rating: 4.9,
        totalReviews: 38,
        location: {
          addressLine1: 'KN 3 Ave, Kiyovu',
          city: 'Kigali',
          district: 'Nyarugenge',
          country: 'Rwanda',
        },
      },
    },
    { upsert: true, new: true }
  );

  // 3. Customer (Consumer)
  const customerEmail = 'customer@freshfind.com';
  const customerPassword = 'Customer@123';
  const customerHash = await bcrypt.hash(customerPassword, salt);

  const customer = await User.findOneAndUpdate(
    { email: customerEmail },
    {
      $set: {
        passwordHash: customerHash,
        fullName: 'Alice Mukamana',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        emailVerified: true,
        wallet: { balance: 15000, currency: 'RWF' },
        loyaltyAccount: { points: 350, badgeTier: 'Eco Champion', mealsRescued: 14, co2SavedKg: 35 },
      },
    },
    { upsert: true, new: true }
  );

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  CREDENTIALS CREATED & SYNCED IN MONGODB ATLAS:');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('👑 1. ADMIN / SUPER ADMIN');
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role:     ${admin.role}`);
  console.log(`   Portal:   /admin\n`);
  console.log('🏪 2. BUSINESS OWNER (MERCHANT)');
  console.log(`   Email:    ${businessOwner.email}`);
  console.log(`   Password: ${businessPassword}`);
  console.log(`   Role:     ${businessOwner.role}`);
  console.log(`   Portal:   /business\n`);
  console.log('🛍️  3. CUSTOMER (CONSUMER)');
  console.log(`   Email:    ${customer.email}`);
  console.log(`   Password: ${customerPassword}`);
  console.log(`   Role:     ${customer.role}`);
  console.log(`   Portal:   / (Marketplace)`);
  console.log('═══════════════════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected cleanly from MongoDB Atlas');
  });
