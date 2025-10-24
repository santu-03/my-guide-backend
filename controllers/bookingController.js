
// import createError from "http-errors";
// import { z } from "zod";
// import { Booking } from "../models/Booking.js";
// import { Activity } from "../models/Activity.js";

// const createSchema = z.object({
//   placeId: z.string().length(24).optional(),
//   activityId: z.string().length(24).optional(),
//   activity: z.string().length(24).optional(),
//   date: z.coerce.date(),
//   time: z.string().optional(),
//   participants: z.number().int().min(1).max(50).optional(),
//   peopleCount: z.number().int().min(1).max(50).optional(),
//   participantDetails: z.array(z.object({
//     name: z.string().optional(),
//     email: z.string().email().optional(),
//     phone: z.string().optional(),
//   })).optional(),
//   specialRequests: z.string().max(2000).optional(),
//   notes: z.string().max(500).optional(),
//   totalAmount: z.number().nonnegative().optional(),
// }).refine((data) => data.placeId || data.activityId || data.activity, {
//   message: "Either placeId, activityId, or activity must be provided.",
// });

// export const createBooking = async (req, res, next) => {
//   try {
//     const body = createSchema.parse(req.body);

//     // Handle both field names
//     const activityId = body.activity || body.activityId;
//     const participants = body.participants || body.peopleCount || 1;

//     // Calculate total amount if not provided
//     let totalAmount = body.totalAmount;
//     if (!totalAmount && activityId) {
//       const activity = await Activity.findById(activityId);
//       if (activity) {
//         totalAmount = activity.price * participants;
//       }
//     }

//     const booking = await Booking.create({
//       user: req.user.id,
//       place: body.placeId,
//       activity: activityId,
//       date: body.date,
//       time: body.time,
//       participants,
//       peopleCount: participants,
//       participantDetails: body.participantDetails || [],
//       specialRequests: body.specialRequests || body.notes || "",
//       notes: body.notes || body.specialRequests || "",
//       totalAmount: totalAmount || 0,
//       status: "pending",
//       paymentStatus: "pending",
//     });

//     const populatedBooking = await Booking.findById(booking._id)
//       .populate("place", "name location")
//       .populate("activity", "title price category");

//     res.status(201).json({ 
//       message: "Booking created", 
//       data: { booking: populatedBooking } 
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const myBookings = async (req, res, next) => {
//   try {
//     const bookings = await Booking.find({ user: req.user.id })
//       .populate("place", "name location")
//       .populate("activity", "title price city category")
//       .sort({ createdAt: -1 });

//     res.json({ data: { bookings } });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getBookingById = async (req, res, next) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate("activity", "title city price category")
//       .populate("place", "name location")
//       .populate("user", "name email");

//     if (!booking) throw createError(404, "Booking not found");

//     // Check authorization
//     if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
//       throw createError(403, "Not authorized");
//     }

//     res.json({ data: { booking } });
//   } catch (err) {
//     next(err);
//   }
// };

// export const allBookings = async (_req, res, next) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email role")
//       .populate("place", "name")
//       .populate("activity", "title price")
//       .sort({ createdAt: -1 });

//     res.json({ data: { bookings } });
//   } catch (err) {
//     next(err);
//   }
// };

// export const updateBookingStatus = async (req, res, next) => {
//   try {
//     const { status } = z
//       .object({ status: z.enum(["pending", "confirmed", "cancelled", "completed"]) })
//       .parse(req.body);

//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id, 
//       { status }, 
//       { new: true }
//     );

//     if (!booking) throw createError(404, "Booking not found");

//     res.json({ message: "Status updated", data: { booking } });
//   } catch (err) {
//     next(err);
//   }
// };

// export const cancelBooking = async (req, res, next) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) throw createError(404, "Booking not found");

//     if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
//       throw createError(403, "Not authorized");
//     }

//     if (booking.status === "cancelled") {
//       throw createError(400, "Booking already cancelled");
//     }

//     booking.status = "cancelled";
//     await booking.save();

//     res.json({ 
//       message: "Booking cancelled", 
//       data: { booking } 
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const confirmPayment = async (req, res, next) => {
//   try {
//     const { bookingId, paymentId } = z.object({
//       bookingId: z.string().length(24),
//       paymentId: z.string(),
//     }).parse(req.body);

//     const booking = await Booking.findById(bookingId);

//     if (!booking) throw createError(404, "Booking not found");

//     if (booking.user.toString() !== req.user.id) {
//       throw createError(403, "Not authorized");
//     }

//     booking.status = "confirmed";
//     booking.paymentStatus = "paid";
//     booking.paymentId = paymentId;
//     await booking.save();

//     res.json({ 
//       message: "Payment confirmed", 
//       data: { booking } 
//     });
//   } catch (err) {
//     next(err);
//   }
// };
import createError from "http-errors";
import { Booking } from "../models/Booking.js";
import { Activity } from "../models/Activity.js";
import { Place } from "../models/Place.js";

// Create Booking
export const createBooking = async (req, res, next) => {
  try {
    console.log("📦 Creating booking for user:", req.user.id);
    
    const body = req.body;
    
    // Validate required fields
    if (!body.date) {
      throw createError(400, "Date is required");
    }
    if (!body.activityId && !body.placeId) {
      throw createError(400, "Either activityId or placeId is required");
    }

    const participants = body.participants || body.peopleCount || 1;
    
    // Calculate pricing
    let totalAmount = body.totalAmount;
    let pricing = body.pricing || {};
    
    if (!totalAmount && (body.activityId || body.placeId)) {
      let item;
      if (body.activityId) {
        item = await Activity.findById(body.activityId);
      } else {
        item = await Place.findById(body.placeId);
      }
      
      if (item) {
        const basePrice = item.price || item.basePrice || 99;
        const subtotal = basePrice * participants;
        const tax = Math.round(subtotal * 0.18);
        const serviceFee = Math.round(subtotal * 0.05);
        const promoOff = pricing.promoOff || 0;
        totalAmount = Math.max(0, subtotal + tax + serviceFee - promoOff);
        
        pricing = {
          basePrice,
          subtotal,
          tax,
          serviceFee,
          promoOff,
          total: totalAmount,
        };
      }
    }

    // Get customer data
    const customerData = body.customer || (body.participantDetails && body.participantDetails[0]) || {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || "",
    };

    const booking = await Booking.create({
      user: req.user.id,
      place: body.placeId,
      activity: body.activityId,
      date: new Date(body.date),
      time: body.time,
      participants,
      peopleCount: participants,
      participantDetails: body.participantDetails || [customerData],
      customer: customerData,
      specialRequests: body.specialRequests || "",
      totalAmount: totalAmount || 0,
      pricing: pricing,
      status: "confirmed",
      paymentStatus: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("place", "name title location city images rating")
      .populate("activity", "title name price basePrice city duration images rating category");

    console.log("✅ Booking created:", populatedBooking._id);

    res.status(201).json({ 
      message: "Booking created successfully", 
      data: { booking: populatedBooking } 
    });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    next(err);
  }
};

// Get User's Bookings
export const myBookings = async (req, res, next) => {
  try {
    console.log("📋 Fetching bookings for user:", req.user.id);
    
    const bookings = await Booking.find({ user: req.user.id })
      .populate("place", "name title location city images rating")
      .populate("activity", "title name price basePrice city duration images rating category")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${bookings.length} bookings for user`);

    res.json({ 
      data: { bookings } 
    });
  } catch (err) {
    console.error("❌ Get bookings error:", err);
    next(err);
  }
};

// Get Booking by ID
export const getBookingById = async (req, res, next) => {
  try {
    console.log("🔍 Fetching booking:", req.params.id);
    
    const booking = await Booking.findById(req.params.id)
      .populate("activity", "title name price basePrice city duration images rating category")
      .populate("place", "name title location city images rating")
      .populate("user", "name email phone");

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Not authorized to view this booking");
    }

    res.json({ 
      data: { booking } 
    });
  } catch (err) {
    console.error("❌ Get booking error:", err);
    next(err);
  }
};

// Get All Bookings (Admin)
export const allBookings = async (req, res, next) => {
  try {
    console.log("👑 Admin fetching all bookings");
    
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("place", "name title")
      .populate("activity", "title name price")
      .sort({ createdAt: -1 });

    res.json({ 
      data: { bookings } 
    });
  } catch (err) {
    console.error("❌ Get all bookings error:", err);
    next(err);
  }
};

// Update Booking Status (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      throw createError(400, "Invalid status");
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    )
    .populate("activity", "title name")
    .populate("place", "name title");

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    res.json({ 
      message: "Booking status updated successfully", 
      data: { booking } 
    });
  } catch (err) {
    console.error("❌ Update status error:", err);
    next(err);
  }
};

// Cancel Booking
export const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Not authorized to cancel this booking");
    }

    if (booking.status === "cancelled") {
      throw createError(400, "Booking is already cancelled");
    }

    // Check cancellation time (24 hours before)
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      throw createError(400, "Cancellation must be done at least 24 hours before the booking date");
    }

    booking.status = "cancelled";
    booking.cancellationReason = reason || "Cancelled by user";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("activity", "title name")
      .populate("place", "name title");

    console.log("✅ Booking cancelled:", booking._id);

    res.json({ 
      message: "Booking cancelled successfully", 
      data: { booking: populatedBooking } 
    });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    next(err);
  }
};

// Update Booking
export const updateBooking = async (req, res, next) => {
  try {
    const { date, participants, specialRequests } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    if (booking.user.toString() !== req.user.id) {
      throw createError(403, "Not authorized to update this booking");
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw createError(400, "Can only update pending or confirmed bookings");
    }

    if (date) booking.date = new Date(date);
    if (participants) {
      booking.participants = participants;
      booking.peopleCount = participants;
    }
    if (specialRequests) booking.specialRequests = specialRequests;

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("activity", "title name price city duration images rating category")
      .populate("place", "name title location city images rating");

    res.json({ 
      message: "Booking updated successfully", 
      data: { booking: populatedBooking } 
    });
  } catch (err) {
    console.error("❌ Update booking error:", err);
    next(err);
  }
};

// Delete Booking
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Not authorized to delete this booking");
    }

    // Only allow deletion of cancelled or past bookings
    const canDelete = booking.status === 'cancelled' || new Date(booking.date) < new Date();
    if (!canDelete) {
      throw createError(400, "Only cancelled or past bookings can be deleted");
    }

    // Soft delete
    booking.deleted = true;
    booking.deletedAt = new Date();
    await booking.save();

    console.log("✅ Booking deleted:", booking._id);

    res.json({ 
      message: "Booking deleted successfully" 
    });
  } catch (err) {
    console.error("❌ Delete booking error:", err);
    next(err);
  }
};

// Quick Status Update
export const quickUpdateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      throw createError(400, "Invalid status");
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Not authorized to update this booking");
    }

    // Validate status transition
    const allowedTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!allowedTransitions[booking.status]?.includes(status)) {
      throw createError(400, `Cannot change status from ${booking.status} to ${status}`);
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("activity", "title name")
      .populate("place", "name title");

    res.json({ 
      message: `Booking ${status} successfully`, 
      data: { booking: populatedBooking } 
    });
  } catch (err) {
    console.error("❌ Quick status update error:", err);
    next(err);
  }
};

// Confirm Payment
export const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentId, amount } = req.body;

    if (!bookingId || !paymentId) {
      throw createError(400, "Booking ID and payment ID are required");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    if (booking.user.toString() !== req.user.id) {
      throw createError(403, "Not authorized to confirm payment for this booking");
    }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    
    if (amount) {
      booking.totalAmount = amount;
    }
    
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("activity", "title name")
      .populate("place", "name title");

    res.json({ 
      message: "Payment confirmed successfully", 
      data: { booking: populatedBooking } 
    });
  } catch (err) {
    console.error("❌ Confirm payment error:", err);
    next(err);
  }
};