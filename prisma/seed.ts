import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freshfind';

// ─── Inline User schema for seed script ─────────────────────────────────────
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  fullName: String,
  role: { type: String, default: 'CUSTOMER' },
  status: { type: String, default: 'ACTIVE' },
  emailVerified: { type: Boolean, default: false },
  wallet: { balance: Number, currency: String },
  loyaltyAccount: { points: Number, badgeTier: String, mealsRescued: Number, co2SavedKg: Number },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@freshfind.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = 'FreshFind Administrator';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  console.log(`Checking if admin user exists (${adminEmail})...`);

  const result = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        passwordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        fullName: adminName,
        wallet: { balance: 0, currency: 'RWF' },
        loyaltyAccount: { points: 1000, badgeTier: 'Impact Hero', mealsRescued: 0, co2SavedKg: 0 },
      },
    },
    { upsert: true, new: true }
  );

  console.log('✅ Admin user created/updated successfully:');
  console.log(`   Email:    ${result.email}`);
  console.log(`   Role:     ${result.role}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  });
