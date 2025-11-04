import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const adminUsername = process.env.ADMIN_USERNAME || "josplay";
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    process.exit(1);
  }

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (existingUser) {
    console.log(`✅ Admin user "${adminUsername}" already exists`);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      username: adminUsername,
      email: null, // Josplay doesn't have an email
      password: hashedPassword,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.username} (ID: ${adminUser.id})`);
  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
