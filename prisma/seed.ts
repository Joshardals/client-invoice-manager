import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "mary@prisma.io",
      password,
      name: "Mary",
    },
    {
      email: "josh@prisma.io",
      password,
      name: "Josh",
    },
  ];

  for (const user of users) {
    try {
      console.log(`Creating user: ${user.email}`);
      await prisma.user.create({ data: user });
      console.log(`✅ Created user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user: ${user.email}`, error);
    }
  }

  console.log("✅ Seeded users.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
