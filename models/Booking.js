

// export const Booking = mongoose.model("Booking", bookingSchema);
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    place: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Place", 
      index: true 
    },
    activity: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Activity", 
      index: true 
    },
    date: { 
      type: Date, 
      required: true, 
      index: true 
    },
    time: { 
      type: String 
    },
    participants: { 
      type: Number, 
      default: 1, 
      min: 1, 
      max: 50 
    },
    peopleCount: { 
      type: Number, 
      default: 1, 
      min: 1, 
      max: 50 
    },
    participantDetails: [{
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    }],
    specialRequests: { 
      type: String, 
      default: "" 
    },
    notes: { 
      type: String, 
      default: "" 
    },
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "pending", 
      index: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "refunded"], 
      default: "pending",
      index: true 
    },
    paymentId: { 
      type: String 
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

bookingSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);