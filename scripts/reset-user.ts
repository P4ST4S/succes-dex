import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Deleting josplay user...");

  await prisma.user.delete({
    where: { username: "josplay" },
  });

  console.log("✅ Deleted user: josplay");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
