import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@freshfind.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = 'FreshFind Administrator';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  console.log(`Checking if admin user exists (${adminEmail})...`);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      fullName: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash,
      fullName: adminName,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      wallet: {
        create: {
          balance: 0,
          currency: 'RWF',
        },
      },
      loyaltyAccount: {
        create: {
          points: 1000,
          badgeTier: 'Impact Hero',
          mealsRescued: 0,
          co2SavedKg: 0,
        },
      },
    },
  });

  console.log('✅ Admin user created/updated successfully:');
  console.log(`   Email:    ${user.email}`);
  console.log(`   Role:     ${user.role}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
