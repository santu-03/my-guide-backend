import rateLimit from "express-rate-limit";

// General API limiter (e.g., applied at /api/v1)
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000000,            // 120 requests/min
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints (optional)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 1000000,                  
  message: { status: 429, message: "Too many attempts. Please try later." },
  standardHeaders: true,
  legacyHeaders: false,
});
