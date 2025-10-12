// import { Router } from "express";
// import { requireAuth, requireRole } from "../middleware/auth.js";
// import { validateObjectIdParam } from "../middleware/objectIdParam.js";
// import {
//   listUsers,
//   updateMe,
//   changePassword,
//   adminCreateUser,
//   setUserRole,
//   deleteUser,
// } from "../controllers/userController.js";

// const r = Router();

// /* me */
// r.put("/me", requireAuth, updateMe);
// r.patch("/me/password", requireAuth, changePassword);

// /* admin */
// r.get("/", requireAuth, requireRole("admin"), listUsers);
// r.post("/admin-create", requireAuth, requireRole("admin"), adminCreateUser);
// r.patch("/:id/role", requireAuth, requireRole("admin"), validateObjectIdParam("id"), setUserRole);
// r.delete("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), deleteUser);

// export default r;
import { Router } from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import {
  listUsers,
  updateMe,
  changePassword,
  adminCreateUser,
  setUserRole,
  deleteUser,
  getMe,
  uploadAvatar,
} from "../controllers/userController.js";

const r = Router();
// in-memory upload for Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

/* me */
r.get("/me", requireAuth, getMe);                         // <-- used by UI
r.put("/me", requireAuth, updateMe);                      // <-- used by UI
r.patch("/me/password", requireAuth, changePassword);     // <-- used by UI
r.post("/me/avatar", requireAuth, upload.single("avatar"), uploadAvatar); // <-- used by UI

/* admin */
r.get("/", requireAuth, requireRole("admin"), listUsers);
r.post("/admin-create", requireAuth, requireRole("admin"), adminCreateUser);
r.patch("/:id/role", requireAuth, requireRole("admin"), validateObjectIdParam("id"), setUserRole);
r.delete("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), deleteUser);

export default r;