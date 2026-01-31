import express from "express";
import { usersTable } from "../src/db/schema.js";
import { createusertoken } from "../utlis/token.js"; 
import db from "../src/index.js";
import { eq } from "drizzle-orm";

const router = express.Router();

/* ===================== SIGNUP ===================== */
router.post("/signup", async (req, res) => {
  const { name, email, password, role , age} = req.body;

  const [existingUser] = await db
    .select({
      email: usersTable.email,
      name: usersTable.name, 
      // ❌ MISTAKE (earlier): usersTable.username
      // ❌ WHY: username column does NOT exist in schema
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  // Check if user already exists
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered" });
    // ❌ MISTAKE (earlier): using 404
    // ❌ WHY: 404 = Not Found, but resource already exists → 409 Conflict
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password,
      role,
      age ,
      // ❌ MISTAKE (earlier): username used here
      // ❌ WHY: username variable + column do not exist
    })
    .returning({ user_id: usersTable.id });

  res.json({ id: user.user_id });
  // ❌ MISTAKE (earlier): res.json({ id: user_id })
  // ❌ WHY: user_id is NOT a variable, it is a property on `user`
});

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // ❌ MISTAKE (earlier): destructuring username
  // ❌ WHY: login query never uses username

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      password: usersTable.password,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
    // ❌ MISTAKE (earlier): vague error + wrong semantics
  }



  const token =  createusertoken(existingUser);
  // ❌ MISTAKE (earlier): token variable never assigned

  res.json({ token });
});

export default router;
