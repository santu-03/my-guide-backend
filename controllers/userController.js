// import createError from "http-errors";
// import { z } from "zod";
// import bcrypt from "bcryptjs";
// import { User } from "../models/User.js";

// /* -------------------------- Admin: list all users ------------------------- */
// export const listUsers = async (_req, res, next) => {
//   try {
//     const users = await User.find().select("-password").sort({ createdAt: -1 });
//     res.json({ data: { users } });
//   } catch (err) { next(err); }
// };

// /* ---------------------------- Me: update profile -------------------------- */
// const updateMeSchema = z.object({
//   name: z.string().min(2).optional(),
//   avatarUrl: z.string().url().optional(),
// });
// export const updateMe = async (req, res, next) => {
//   try {
//     const data = updateMeSchema.parse(req.body);
//     const user = await User.findByIdAndUpdate(req.user._id, data, { new: true }).select("-password");
//     res.json({ message: "Profile updated", data: { user } });
//   } catch (err) { next(err); }
// };

// /* ---------------------------- Me: change password ------------------------- */
// const changePasswordSchema = z.object({
//   currentPassword: z.string().min(6),
//   newPassword: z.string().min(6),
// });
// export const changePassword = async (req, res, next) => {
//   try {
//     const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
//     const user = await User.findById(req.user._id).select("+password");
//     if (!user) throw createError(404, "User not found");
//     const ok = await bcrypt.compare(currentPassword, user.password);
//     if (!ok) throw createError(400, "Current password incorrect");
//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();
//     res.json({ message: "Password changed" });
//   } catch (err) { next(err); }
// };

// /* ---------------------------- Admin: create user -------------------------- */
// const adminCreateSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(6),
//   role: z.enum(["traveller", "guide", "instructor", "advisor", "admin"]),
// });
// export const adminCreateUser = async (req, res, next) => {
//   try {
//     const body = adminCreateSchema.parse(req.body);
//     const exists = await User.findOne({ email: body.email });
//     if (exists) throw createError(409, "Email already registered");
//     const hash = await bcrypt.hash(body.password, 10);
//     const user = await User.create({ ...body, password: hash });
//     res.status(201).json({ message: "User created", data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
//   } catch (err) { next(err); }
// };

// /* ----------------------------- Admin: set role ---------------------------- */
// const setRoleSchema = z.object({ role: z.enum(["traveller", "guide", "instructor", "advisor", "admin"]) });
// export const setUserRole = async (req, res, next) => {
//   try {
//     const { role } = setRoleSchema.parse(req.body);
//     const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
//     if (!user) throw createError(404, "User not found");
//     res.json({ message: "Role updated", data: { user } });
//   } catch (err) { next(err); }
// };

// /* ---------------------------- Admin: delete user -------------------------- */
// export const deleteUser = async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) throw createError(404, "User not found");
//     res.json({ message: "User deleted", data: { id: req.params.id } });
//   } catch (err) { next(err); }
// };
import createError from "http-errors";
import { z } from "zod";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.js";

/* ---------- Me: GET ---------- */
export const getMe = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    const user = await User.findById(uid).select("-password");
    if (!user) throw createError(404, "User not found");
    res.json({ data: { user } });
  } catch (err) { next(err); }
};

/* ---------- Me: UPDATE ---------- */
const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
});
export const updateMe = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    const data = updateMeSchema.parse(req.body ?? {});
    const user = await User.findByIdAndUpdate(uid, data, { new: true }).select("-password");
    if (!user) throw createError(404, "User not found");
    res.json({ message: "Profile updated", data: { user } });
  } catch (err) { next(err); }
};

/* ---------- Me: CHANGE PASSWORD (you already had; kept minimal) ---------- */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
export const changePassword = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body ?? {});
    const user = await User.findById(uid).select("+password");
    if (!user) throw createError(404, "User not found");
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw createError(400, "Current password incorrect");
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed" });
  } catch (err) { next(err); }
};

/* ---------- Me: UPLOAD AVATAR ---------- */
// expects multer memoryStorage -> req.file.buffer
export const uploadAvatar = async (req, res, next) => {
  try {
    const uid = req.user?.id || req.user?._id;
    if (!req.file) throw createError(400, "No file uploaded");

    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const s = cloudinary.uploader.upload_stream(
          {
            folder: "my-guide/avatars",
            resource_type: "image",
            transformation: [{ width: 512, height: 512, crop: "fill", gravity: "auto" }],
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        s.end(buffer);
      });

    const result = await streamUpload(req.file.buffer);
    if (!result?.secure_url) throw createError(500, "Upload failed");

    const user = await User.findByIdAndUpdate(
      uid,
      { avatarUrl: result.secure_url },
      { new: true }
    ).select("-password");

    res.json({ message: "Avatar updated", data: { user } });
  } catch (err) { next(err); }
};

/* ---------- Admin endpoints (keep your existing implementations) ---------- */
export const listUsers = async (_req, res, next) => {
  try { const users = await User.find().select("-password").sort({ createdAt: -1 }); res.json({ data: { users } }); } catch (e) { next(e); }
};
const adminCreateSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["traveller","guide","instructor","advisor","admin"]) });
export const adminCreateUser = async (req, res, next) => {
  try {
    const body = adminCreateSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email });
    if (exists) throw createError(409, "Email already registered");
    const hash = await bcrypt.hash(body.password, 10);
    const user = await User.create({ ...body, password: hash });
    res.status(201).json({ message: "User created", data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (e) { next(e); }
};
const setRoleSchema = z.object({ role: z.enum(["traveller","guide","instructor","advisor","admin"]) });
export const setUserRole = async (req, res, next) => {
  try {
    const { role } = setRoleSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) throw createError(404, "User not found");
    res.json({ message: "Role updated", data: { user } });
  } catch (e) { next(e); }
};
export const deleteUser = async (req, res, next) => {
  try { const user = await User.findByIdAndDelete(req.params.id); if (!user) throw createError(404,"User not found"); res.json({ message:"User deleted", data:{ id:req.params.id } }); } catch (e) { next(e); }
};

