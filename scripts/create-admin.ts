import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@seotools.com";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const name = process.env.ADMIN_NAME || "Admin User";

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists with email:", email);
      return;
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: "ADMIN",
        plan: "ENTERPRISE",
        emailVerified: true,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", password);
    console.log("👤 Name:", admin.name);
    console.log("🎭 Role:", admin.role);
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
