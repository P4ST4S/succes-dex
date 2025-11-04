import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting production migration...");

  const adminUsername = process.env.ADMIN_USERNAME || "josplay";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("❌ ADMIN_PASSWORD not set in environment variables");
    process.exit(1);
  }

  console.log(`📋 Migrating user: ${adminUsername}`);

  // Find existing user
  const existingUser = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingUser) {
    console.log("❌ User not found, creating new user...");
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        username: adminUsername,
        email: null,
        password: hashedPassword,
      },
    });

    console.log(`✅ Created new user: ${newUser.username} (ID: ${newUser.id})`);
  } else {
    console.log(`✅ User "${adminUsername}" found (ID: ${existingUser.id})`);

    // Update password if needed
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.update({
      where: { username: adminUsername },
      data: {
        password: hashedPassword,
      },
    });

    console.log(`✅ Updated password for user: ${adminUsername}`);
  }

  console.log("🔄 Migration completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
