import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);

  // Business Owner
  const businessEmail    = "business@freshfind.com";
  const businessPassword = "Business@123";

  const businessOwner = await prisma.user.upsert({
    where: { email: businessEmail },
    update: {
      passwordHash: await bcrypt.hash(businessPassword, salt),
      role: Role.BUSINESS_OWNER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    create: {
      email: businessEmail,
      passwordHash: await bcrypt.hash(businessPassword, salt),
      fullName: "Demo Business Owner",
      role: Role.BUSINESS_OWNER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      wallet: { create: { balance: 0, currency: "RWF" } },
      loyaltyAccount: {
        create: { points: 0, badgeTier: "Eco Novice", mealsRescued: 0, co2SavedKg: 0 },
      },
    },
  });

  // Customer
  const customerEmail    = "customer@freshfind.com";
  const customerPassword = "Customer@123";

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      passwordHash: await bcrypt.hash(customerPassword, salt),
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    create: {
      email: customerEmail,
      passwordHash: await bcrypt.hash(customerPassword, salt),
      fullName: "Demo Customer",
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      wallet: { create: { balance: 500, currency: "RWF" } },
      loyaltyAccount: {
        create: { points: 100, badgeTier: "Eco Novice", mealsRescued: 0, co2SavedKg: 0 },
      },
    },
  });

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
  .finally(async () => { await prisma.$disconnect(); });
