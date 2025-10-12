import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { 
  getWishlist, 
  toggleWishlist, 
  checkWishlist 
} from "../controllers/wishlistController.js";

const r = Router();

r.get("/", requireAuth, getWishlist);
r.post("/toggle", requireAuth, toggleWishlist);
r.get("/check", requireAuth, checkWishlist);

export default r;