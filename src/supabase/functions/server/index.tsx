import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { registerUser, getUserProfile, updateUserProfile, verifyUser, supabaseAdmin } from "./auth.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d44693b7/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ROUTES =============

/**
 * POST /make-server-d44693b7/auth/register
 * Register a new user
 */
app.post("/make-server-d44693b7/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName, phone, role } = body;

    // Validate required fields
    if (!email || !password || !fullName || !phone || !role) {
      return c.json(
        { error: "Missing required fields: email, password, fullName, phone, role" },
        400
      );
    }

    // Validate role
    if (role !== "customer") {
      return c.json({ error: "Role must be 'customer'" }, 400);
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Validate password length
    if (password.length < 6) {
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    // Register user
    const result = await registerUser({ email, password, fullName, phone, role });

    return c.json({
      success: true,
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error: any) {
    console.error("Registration error in /auth/register:", error);
    
    // Handle specific Supabase errors
    if (error.message?.includes("already registered")) {
      return c.json({ error: "Email already registered" }, 409);
    }
    
    return c.json(
      { error: `Registration failed: ${error.message || "Unknown error"}` },
      500
    );
  }
});

/**
 * POST /make-server-d44693b7/auth/login
 * Login user (handled by Supabase client in frontend)
 * This endpoint is for reference - actual login uses Supabase client
 */
app.post("/make-server-d44693b7/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Note: Login should be handled by Supabase client in frontend
    // This is just for server-side login if needed
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Get user profile
    const profile = await getUserProfile(data.user.id);

    return c.json({
      success: true,
      session: data.session,
      user: {
        ...data.user,
        ...profile,
      },
    });
  } catch (error: any) {
    console.error("Login error in /auth/login:", error);
    return c.json({ error: `Login failed: ${error.message}` }, 500);
  }
});

/**
 * GET /make-server-d44693b7/auth/profile
 * Get current user profile (requires authentication)
 */
app.get("/make-server-d44693b7/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No authorization token provided" }, 401);
    }

    const user = await verifyUser(accessToken);
    if (!user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    return c.json({ success: true, user });
  } catch (error: any) {
    console.error("Error getting profile:", error);
    return c.json({ error: `Failed to get profile: ${error.message}` }, 500);
  }
});

/**
 * PUT /make-server-d44693b7/auth/profile
 * Update user profile (requires authentication)
 */
app.put("/make-server-d44693b7/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "No authorization token provided" }, 401);
    }

    const user = await verifyUser(accessToken);
    if (!user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    const body = await c.req.json();
    const { fullName, phone } = body;

    const updates: any = {};
    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;

    const result = await updateUserProfile(user.id, updates);

    return c.json({
      success: true,
      message: "Profile updated successfully",
      profile: result.profile,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return c.json({ error: `Failed to update profile: ${error.message}` }, 500);
  }
});

/**
 * POST /make-server-d44693b7/auth/create-admin
 * Create admin account - ONE TIME USE ONLY
 * Call this once to create the admin account, then you can remove this route
 */
app.post("/make-server-d44693b7/auth/create-admin", async (c) => {
  try {
    // Create admin account
    const result = await registerUser({
      email: "Admin@gmail.com",
      password: "123456",
      fullName: "Administrator",
      phone: "0000000000",
      role: "admin",
    });

    return c.json({
      success: true,
      message: "Admin account created successfully! You can now login with Admin@gmail.com",
      user: result.user,
    });
  } catch (error: any) {
    console.error("Error creating admin account:", error);
    
    // If account already exists, that's okay
    if (error.message?.includes("already")) {
      return c.json({
        success: true,
        message: "Admin account already exists. You can login with Admin@gmail.com",
      });
    }
    
    return c.json({ error: `Failed to create admin: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);