
import rateLimit from "express-rate-limit";

// General API limiter - 120 requests per minute
export const limiter = rateLimit({
  windowMs: 60 * 1000,  
  max: 120,             
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    status: 429, 
    message: "Too many requests. Please try again later." 
  },
});

// Stricter limiter for auth endpoints - 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 5,                     
  message: { 
    status: 429, 
    message: "Too many login attempts. Please try again later." 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
