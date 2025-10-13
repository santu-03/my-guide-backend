
import createError from "http-errors";
import { z } from "zod";
import { Booking } from "../models/Booking.js";
import { Activity } from "../models/Activity.js";

const createSchema = z.object({
  placeId: z.string().length(24).optional(),
  activityId: z.string().length(24).optional(),
  activity: z.string().length(24).optional(),
  date: z.coerce.date(),
  time: z.string().optional(),
  participants: z.number().int().min(1).max(50).optional(),
  peopleCount: z.number().int().min(1).max(50).optional(),
  participantDetails: z.array(z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })).optional(),
  specialRequests: z.string().max(2000).optional(),
  notes: z.string().max(500).optional(),
  totalAmount: z.number().nonnegative().optional(),
}).refine((data) => data.placeId || data.activityId || data.activity, {
  message: "Either placeId, activityId, or activity must be provided.",
});

export const createBooking = async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);

    // Handle both field names
    const activityId = body.activity || body.activityId;
    const participants = body.participants || body.peopleCount || 1;

    // Calculate total amount if not provided
    let totalAmount = body.totalAmount;
    if (!totalAmount && activityId) {
      const activity = await Activity.findById(activityId);
      if (activity) {
        totalAmount = activity.price * participants;
      }
    }

    const booking = await Booking.create({
      user: req.user.id,
      place: body.placeId,
      activity: activityId,
      date: body.date,
      time: body.time,
      participants,
      peopleCount: participants,
      participantDetails: body.participantDetails || [],
      specialRequests: body.specialRequests || body.notes || "",
      notes: body.notes || body.specialRequests || "",
      totalAmount: totalAmount || 0,
      status: "pending",
      paymentStatus: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("place", "name location")
      .populate("activity", "title price category");

    res.status(201).json({ 
      message: "Booking created", 
      data: { booking: populatedBooking } 
    });
  } catch (err) {
    next(err);
  }
};

export const myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("place", "name location")
      .populate("activity", "title price city category")
      .sort({ createdAt: -1 });

    res.json({ data: { bookings } });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("activity", "title city price category")
      .populate("place", "name location")
      .populate("user", "name email");

    if (!booking) throw createError(404, "Booking not found");

    // Check authorization
    if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Not authorized");
    }

    res.json({ data: { booking } });
  } catch (err) {
    next(err);
  }
};

export const allBookings = async (_req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("place", "name")
      .populate("activity", "title price")
      .sort({ createdAt: -1 });

    res.json({ data: { bookings } });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = z
      .object({ status: z.enum(["pending", "confirmed", "cancelled", "completed"]) })
      .parse(req.body);

    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!booking) throw createError(404, "Booking not found");

    res.json({ message: "Status updated", data: { booking } });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) throw createError(404, "Booking not found");

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Not authorized");
    }

    if (booking.status === "cancelled") {
      throw createError(400, "Booking already cancelled");
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ 
      message: "Booking cancelled", 
      data: { booking } 
    });
  } catch (err) {
    next(err);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentId } = z.object({
      bookingId: z.string().length(24),
      paymentId: z.string(),
    }).parse(req.body);

    const booking = await Booking.findById(bookingId);

    if (!booking) throw createError(404, "Booking not found");

    if (booking.user.toString() !== req.user.id) {
      throw createError(403, "Not authorized");
    }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    await booking.save();

    res.json({ 
      message: "Payment confirmed", 
      data: { booking } 
    });
  } catch (err) {
    next(err);
  }
};