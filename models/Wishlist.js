// import mongoose from "mongoose";

// const wishlistSchema = new mongoose.Schema(
//   {
//     user: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "User", 
//       required: true, 
//       unique: true,
//       index: true 
//     },
//     places: [{ 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Place" 
//     }],
//     activities: [{ 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Activity" 
//     }],
//   },
//   { timestamps: true }
// );

// wishlistSchema.index({ user: 1 });

// wishlistSchema.set("toJSON", {
//   transform: (_doc, ret) => {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   },
// });

// export const Wishlist = mongoose.model("Wishlist", wishlistSchema);

import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place", index: true }],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity", index: true }],
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1 });

wishlistSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);