import rateLimit from "express-rate-limit";
// General API limiter - 120 requests per minute
export const limiter = rateLimit({
  windowMs: 60 * 1000,  // ✅ FIXED: 1 minute (was 10 minutes)
  max: 120,             // ✅ FIXED: 120 requests (was 1 million!)
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    status: 429, 
    message: "Too many requests. Please try again later." 
  },
});

// Stricter limiter for auth endpoints - 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // ✅ FIXED: 15 minutes
  max: 5,                     // ✅ FIXED: 5 attempts
  message: { 
    status: 429, 
    message: "Too many login attempts. Please try again later." 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});