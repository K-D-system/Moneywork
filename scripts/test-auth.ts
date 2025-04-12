import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return suppliedBuf.equals(hashedBuf);
}

async function main() {
  console.log("🔍 Testing database authentication flow...");
  
  // Clean up any test users from previous runs
  const testEmail = "test@example.com";
  await db.delete(users).where(eq(users.email, testEmail));
  
  console.log("✅ Deleted previous test user if existed");
  
  // Create a test user
  const password = "password123";
  const hashedPassword = await hashPassword(password);
  const familyId = randomUUID();
  
  console.log("📝 Creating test user...");
  const [newUser] = await db.insert(users).values({
    email: testEmail,
    password: hashedPassword,
    name: "maru",
    familyId
  }).returning();
  
  console.log("✅ Created test user:", {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    familyId: newUser.familyId
  });
  
  // Test retrieving the user
  const [retrievedUser] = await db.select().from(users).where(eq(users.id, newUser.id));
  
  console.log("✅ Retrieved user from database:", {
    id: retrievedUser.id,
    email: retrievedUser.email,
    name: retrievedUser.name,
    familyId: retrievedUser.familyId
  });
  
  // Test password verification
  const correctPasswordTest = await comparePasswords(password, retrievedUser.password);
  console.log("✅ Correct password verification:", correctPasswordTest);
  
  const wrongPasswordTest = await comparePasswords("wrongpassword", retrievedUser.password);
  console.log("✅ Wrong password verification:", wrongPasswordTest);
  
  // Clean up
  await db.delete(users).where(eq(users.id, newUser.id));
  console.log("✅ Test user deleted");
  
  console.log("✅ All authentication tests completed successfully!");
  
  // Exit the process
  process.exit(0);
}

main().catch(error => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});