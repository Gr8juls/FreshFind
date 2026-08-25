import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/freshfind";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  fullName: String,
  role: { type: String, default: "CUSTOMER" },
  status: { type: String, default: "ACTIVE" },
  emailVerified: { type: Boolean, default: false },
  wallet: { balance: Number, currency: String },
  loyaltyAccount: { points: Number, badgeTier: String, mealsRescued: Number, co2SavedKg: Number },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const salt = await bcrypt.genSalt(10);

  // Business Owner
  const businessEmail    = "business@freshfind.com";
  const businessPassword = "Business@123";
  const businessHash     = await bcrypt.hash(businessPassword, salt);

  const businessOwner = await User.findOneAndUpdate(
    { email: businessEmail },
    {
      $set: {
        passwordHash: businessHash,
        fullName: "Demo Business Owner",
        role: "BUSINESS_OWNER",
        status: "ACTIVE",
        emailVerified: true,
        wallet: { balance: 0, currency: "RWF" },
        loyaltyAccount: { points: 0, badgeTier: "Eco Novice", mealsRescued: 0, co2SavedKg: 0 },
      },
    },
    { upsert: true, new: true }
  );

  // Customer
  const customerEmail    = "customer@freshfind.com";
  const customerPassword = "Customer@123";
  const customerHash     = await bcrypt.hash(customerPassword, salt);

  const customer = await User.findOneAndUpdate(
    { email: customerEmail },
    {
      $set: {
        passwordHash: customerHash,
        fullName: "Demo Customer",
        role: "CUSTOMER",
        status: "ACTIVE",
        emailVerified: true,
        wallet: { balance: 500, currency: "RWF" },
        loyaltyAccount: { points: 100, badgeTier: "Eco Novice", mealsRescued: 0, co2SavedKg: 0 },
      },
    },
    { upsert: true, new: true }
  );

  console.log("\n✅ Demo credentials created/updated:\n");
  console.log("📦 Business Portal");
  console.log("   Email:    " + businessOwner.email);
  console.log("   Password: " + businessPassword);
  console.log("   Role:     " + businessOwner.role + "\n");
  console.log("🛍️  Customer");
  console.log("   Email:    " + customer.email);
  console.log("   Password: " + customerPassword);
  console.log("   Role:     " + customer.role + "\n");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  });
