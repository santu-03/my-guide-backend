// import createError from "http-errors";
// import { z } from "zod";
// import { Wishlist } from "../models/Wishlist.js";

// const toggleSchema = z.object({
//   itemId: z.string().length(24),
//   type: z.enum(["place", "activity"]),
// });

// export const getWishlist = async (req, res, next) => {
//   try {
//     let wishlist = await Wishlist.findOne({ user: req.user.id })
//       .populate("places", "name title city location images featured")
//       .populate("activities", "title city price category featured images");

//     if (!wishlist) {
//       wishlist = await Wishlist.create({ 
//         user: req.user.id, 
//         places: [], 
//         activities: [] 
//       });
//     }

//     res.json({ 
//       data: { 
//         places: wishlist.places, 
//         activities: wishlist.activities 
//       } 
//     });
//   } catch (err) { 
//     next(err); 
//   }
// };

// export const toggleWishlist = async (req, res, next) => {
//   try {
//     const { itemId, type } = toggleSchema.parse(req.body);

//     let wishlist = await Wishlist.findOne({ user: req.user.id });
    
//     if (!wishlist) {
//       wishlist = await Wishlist.create({ 
//         user: req.user.id, 
//         places: [], 
//         activities: [] 
//       });
//     }

//     const field = type === "place" ? "places" : "activities";
//     const itemIndex = wishlist[field].findIndex(id => id.toString() === itemId);

//     if (itemIndex > -1) {
//       wishlist[field].splice(itemIndex, 1);
//     } else {
//       wishlist[field].push(itemId);
//     }

//     await wishlist.save();

//     res.json({ 
//       message: itemIndex > -1 ? "Removed from wishlist" : "Added to wishlist",
//       data: { inWishlist: itemIndex === -1 }
//     });
//   } catch (err) { 
//     next(err); 
//   }
// };

// export const checkWishlist = async (req, res, next) => {
//   try {
//     const { itemId, type } = z.object({
//       itemId: z.string().length(24),
//       type: z.enum(["place", "activity"]),
//     }).parse(req.query);
    
//     const wishlist = await Wishlist.findOne({ user: req.user.id });

//     if (!wishlist) {
//       return res.json({ data: { inWishlist: false } });
//     }

//     const field = type === "place" ? "places" : "activities";
//     const inWishlist = wishlist[field].some(id => id.toString() === itemId);

//     res.json({ data: { inWishlist } });
//   } catch (err) { 
//     next(err); 
//   }
// };

import createError from "http-errors";
import mongoose from "mongoose";
import { z } from "zod";
import { Wishlist } from "../models/Wishlist.js";

const asObjectId = (id) => {
  try { return new mongoose.Types.ObjectId(id); } catch { return null; }
};

const toggleSchema = z.object({
  itemId: z.string().length(24),
  type: z.enum(["place", "activity"]),
});

export const getWishlist = async (req, res, next) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user.id })
      .populate("places", "name title city location images featured")
      .populate("activities", "title city basePrice price category featured images");

    if (!wl) {
      wl = await Wishlist.create({ user: req.user.id, places: [], activities: [] });
    }

    res.json({
      data: {
        places: wl.places ?? [],
        activities: wl.activities ?? [],
      },
    });
  } catch (err) {
    next(err);
  }
};

export const checkWishlist = async (req, res, next) => {
  try {
    const { itemId, type } = z.object({
      itemId: z.string().length(24),
      type: z.enum(["place", "activity"]),
    }).parse(req.query);

    const oid = asObjectId(itemId);
    if (!oid) throw createError(400, "Invalid itemId");

    const field = type === "place" ? "places" : "activities";
    const exists = await Wishlist.exists({ user: req.user.id, [field]: oid });

    res.json({ data: { inWishlist: Boolean(exists) } });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { itemId, type } = toggleSchema.parse(req.body);
    const oid = asObjectId(itemId);
    if (!oid) throw createError(400, "Invalid itemId");
    const field = type === "place" ? "places" : "activities";

    // Ensure wishlist shell exists to avoid racing on first write
    await Wishlist.updateOne(
      { user: req.user.id },
      { $setOnInsert: { user: req.user.id, places: [], activities: [] } },
      { upsert: true }
    );

    // Check membership then atomically update (no .save(), no __v race)
    const exists = await Wishlist.exists({ user: req.user.id, [field]: oid });

    if (exists) {
      await Wishlist.updateOne({ user: req.user.id }, { $pull: { [field]: oid } });
      return res.json({ message: "Removed from wishlist", data: { inWishlist: false } });
    } else {
      await Wishlist.updateOne({ user: req.user.id }, { $addToSet: { [field]: oid } });
      return res.json({ message: "Added to wishlist", data: { inWishlist: true } });
    }

    /* One-shot pipeline alternative (MongoDB 4.2+):
    await Wishlist.updateOne(
      { user: req.user.id },
      [
        {
          $set: {
            [field]: {
              $cond: [
                { $in: [oid, `$${field}`] },
                { $setDifference: [`$${field}`, [oid]] },
                { $setUnion: [`$${field}`, [oid]] },
              ],
            },
          },
        },
      ]
    );
    const nowExists = await Wishlist.exists({ user: req.user.id, [field]: oid });
    return res.json({ data: { inWishlist: Boolean(nowExists) } });
    */
  } catch (err) {
    next(err);
  }
};