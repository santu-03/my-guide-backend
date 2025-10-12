
// middleware/auth.js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [scheme, headerToken] = auth.split(" ");
    const cookieToken = req.cookies?.accessToken;

    const token =
      (scheme === "Bearer" && headerToken) ? headerToken
      : (typeof cookieToken === "string" ? cookieToken : null);

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // 👇 CRITICAL DEBUG LOGS
    console.log("✅ Token decoded successfully:");
    console.log("   - User ID:", decoded.id);
    console.log("   - User Role:", decoded.role); // This should show the role!
    console.log("   - Full decoded:", decoded);
    
    req.user = decoded;
    return next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    // 👇 CRITICAL DEBUG LOGS
    console.log("🔐 Checking role authorization:");
    console.log("   - Required roles:", roles);
    console.log("   - User role from token:", req.user?.role);
    console.log("   - Full req.user:", req.user);
    
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("❌ FORBIDDEN: User role doesn't match required roles");
      return res.status(403).json({ message: "Forbidden" });
    }
    
    console.log("✅ Role check passed");
    next();
  };
}