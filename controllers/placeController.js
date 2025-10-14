// import createError from "http-errors";
// import { z } from "zod";
// import { Place } from "../models/Place.js";
// import { Activity } from "../models/Activity.js";

// const schema = z.object({
//   name: z.string().min(2).max(100),
//   description: z.string().max(2000).optional(),
//   location: z.object({
//     city: z.string().max(100).optional(),
//     country: z.string().max(100).optional(),
//     coordinates: z.tuple([z.number(), z.number()]).optional(),
//   }).optional(),
//   images: z.array(z.string().url()).max(10).optional(),
//   tags: z.array(z.string().min(1).max(50)).max(20).optional(),
//   isActive: z.boolean().optional(),
// });

// export const createPlace = async (req, res, next) => {
//   try {
//     const data = schema.parse(req.body);
//     const place = await Place.create(data);
//     res.status(201).json({ message: "Place created", data: { place } });
//   } catch (err) { next(err); }
// };

// export const listPlaces = async (req, res, next) => {
//   try {
//     const { 
//       q, country, tag, 
//       page = 1, limit = 20,
//       sortBy = 'createdAt', sortOrder = 'desc'
//     } = req.query;
    
//     const filter = { isActive: true };
    
//     if (q) {
//       filter.$or = [
//         { name: { $regex: String(q), $options: "i" } },
//         { description: { $regex: String(q), $options: "i" } }
//       ];
//     }
//     if (country) filter["country"] = { $regex: String(country), $options: "i" };
//     if (tag) filter.tags = String(tag);
    
//     const skip = (Number(page) - 1) * Number(limit);
//     const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [places, total] = await Promise.all([
//       Place.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(Number(limit)),
//       Place.countDocuments(filter)
//     ]);
    
//     res.json({ 
//       data: { 
//         places,
//         pagination: {
//           page: Number(page),
//           limit: Number(limit),
//           total,
//           pages: Math.ceil(total / Number(limit))
//         }
//       } 
//     });
//   } catch (err) { next(err); }
// };

// export const getPlace = async (req, res, next) => {
//   try {
//     const [place, activities] = await Promise.all([
//       Place.findById(req.params.id),
//       Activity.find({ place: req.params.id, isActive: true })
//         .select('title price durationMinutes images tags')
//     ]);
    
//     if (!place) throw createError(404, "Place not found");
    
//     res.json({ 
//       data: { 
//         place: {
//           ...place.toJSON(),
//           activities,
//           activityCount: activities.length
//         }
//       } 
//     });
//   } catch (err) { next(err); }
// };

// export const updatePlace = async (req, res, next) => {
//   try {
//     const data = schema.partial().parse(req.body);
//     const place = await Place.findByIdAndUpdate(req.params.id, data, { new: true });
//     if (!place) throw createError(404, "Place not found");
    
//     res.json({ message: "Place updated", data: { place } });
//   } catch (err) { next(err); }
// };

// export const deletePlace = async (req, res, next) => {
//   try {
//     // Check if place has activities
//     const activityCount = await Activity.countDocuments({ place: req.params.id });
//     if (activityCount > 0) {
//       throw createError(400, "Cannot delete place with existing activities");
//     }
    
//     const place = await Place.findByIdAndDelete(req.params.id);
//     if (!place) throw createError(404, "Place not found");
    
//     res.json({ message: "Place deleted", data: { id: place._id } });
//   } catch (err) { next(err); }
// };
import createError from "http-errors";
import { z } from "zod";
import { Place } from "../models/Place.js";
import { Activity } from "../models/Activity.js";

const schema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(2000).optional(),
  category: z.string().optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// ✅ FIXED: Handle FormData with coordinates
export const createPlace = async (req, res, next) => {
  try {
    // Parse lat/lng from FormData (comes as strings)
    const lat = req.body.latitude ? Number(req.body.latitude) : 22.5726; // Default Kolkata
    const lng = req.body.longitude ? Number(req.body.longitude) : 88.3639;

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError(400, "Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180");
    }

    // Parse featured from string "true"/"false" to boolean
    const featured = req.body.featured === 'true' || req.body.featured === true;

    // Handle tags array (from FormData comes as 'tags[]')
    let tags = [];
    if (req.body['tags[]']) {
      tags = Array.isArray(req.body['tags[]']) 
        ? req.body['tags[]'] 
        : [req.body['tags[]']];
    } else if (req.body.tags) {
      tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : [req.body.tags];
    }

    // Handle images from multer (req.files if using multer, or req.body.images if URLs)
    let images = [];
    if (req.files && req.files.length > 0) {
      // If multer processed files, you'd have uploaded URLs here
      // Assuming you have a cloudinary upload handler elsewhere
      images = req.files.map(file => file.path || file.secure_url || file.url);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // Build place data with GeoJSON location
    const placeData = {
      name: req.body.name,
      description: req.body.description || "",
      category: req.body.category || "",
      city: req.body.city || "",
      country: req.body.country || "",
      featured: featured,
      tags: tags.filter(Boolean).slice(0, 20), // Limit to 20 tags
      images: images,
      location: {
        type: "Point",
        coordinates: [lng, lat] // [longitude, latitude] - GeoJSON format
      },
      isActive: true
    };

    console.log('📍 Creating place with data:', JSON.stringify(placeData, null, 2));

    const place = await Place.create(placeData);
    
    res.status(201).json({ 
      message: "Place created", 
      data: { place } 
    });
  } catch (err) { 
    console.error('❌ Place creation error:', err);
    next(err); 
  }
};

export const listPlaces = async (req, res, next) => {
  try {
    const { 
      q, country, tag, 
      page = 1, limit = 20,
      sortBy = 'createdAt', sortOrder = 'desc',
      // ✅ Add geospatial query support
      lat, lng, maxDistance = 50000 // 50km default
    } = req.query;
    
    const filter = { isActive: true };
    
    if (q) {
      filter.$or = [
        { name: { $regex: String(q), $options: "i" } },
        { description: { $regex: String(q), $options: "i" } }
      ];
    }
    if (country) filter.country = { $regex: String(country), $options: "i" };
    if (tag) filter.tags = String(tag);

    // ✅ Add nearby search if lat/lng provided
    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(maxDistance)
        }
      };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [places, total] = await Promise.all([
      Place.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Place.countDocuments(filter)
    ]);
    
    res.json({ 
      data: { 
        places,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      } 
    });
  } catch (err) { next(err); }
};

export const getPlace = async (req, res, next) => {
  try {
    const [place, activities] = await Promise.all([
      Place.findById(req.params.id),
      Activity.find({ place: req.params.id, isActive: true })
        .select('title price durationMinutes images tags')
    ]);
    
    if (!place) throw createError(404, "Place not found");
    
    res.json({ 
      data: { 
        place: {
          ...place.toJSON(),
          activities,
          activityCount: activities.length
        }
      } 
    });
  } catch (err) { next(err); }
};

export const updatePlace = async (req, res, next) => {
  try {
    // Handle coordinate updates
    const updateData = { ...req.body };
    
    if (req.body.latitude && req.body.longitude) {
      const lat = Number(req.body.latitude);
      const lng = Number(req.body.longitude);
      
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw createError(400, "Invalid coordinates");
      }
      
      updateData.location = {
        type: "Point",
        coordinates: [lng, lat]
      };
      
      delete updateData.latitude;
      delete updateData.longitude;
    }

    const place = await Place.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!place) throw createError(404, "Place not found");
    
    res.json({ message: "Place updated", data: { place } });
  } catch (err) { next(err); }
};

export const deletePlace = async (req, res, next) => {
  try {
    // Check if place has activities
    const activityCount = await Activity.countDocuments({ place: req.params.id });
    if (activityCount > 0) {
      throw createError(400, "Cannot delete place with existing activities");
    }
    
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) throw createError(404, "Place not found");
    
    res.json({ message: "Place deleted", data: { id: place._id } });
  } catch (err) { next(err); }
};