// // scripts/seedCompleteData.js
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Place } from '../models/Place.js';
// import { Activity } from '../models/Activity.js';
// import { User }   from '../models/User.js';
// import { Booking } from '../models/Booking.js';
// import bcrypt from 'bcryptjs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, '../.env') });

// const MONGO = process.env.MONGO_URL;
// if (!MONGO) {
//   console.error('❌ MONGO_URL missing in .env');
//   process.exit(1);
// }

// // -------------------- Sample Data --------------------
// // NOTE: 'location' is set as GeoJSON Point. city/country remain at root.
// const PLACES = [
//   { id: '1', name: 'Victoria Memorial', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Iconic marble building and museum dedicated to Queen Victoria' },
//   { id: '2', name: 'Howrah Bridge', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41'], description: 'Famous cantilever bridge over Hooghly River' },
//   { id: '3', name: 'Prinsep Ghat', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Scenic riverside ghat with colonial architecture' },
//   { id: '4', name: 'Marble Palace', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Neoclassical mansion with art collection' },
//   { id: '5', name: 'Jorasanko Thakur Bari', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Birthplace of Rabindranath Tagore' },
//   { id: '6', name: 'Indian Museum', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest and largest museum in India' },
//   { id: '7', name: 'Dakshineswar Kali Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Hindu temple dedicated to Goddess Kali' },
//   { id: '8', name: 'Belur Math', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Headquarters of Ramakrishna Mission' },
//   { id: '9', name: 'College Street', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Famous street of books and educational institutions' },
//   { id: '10', name: 'Park Street', category: 'food', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Popular street for restaurants and nightlife' },
//   { id: '11', name: 'Metropolitan Building', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic colonial-era building' },
//   { id: '12', name: 'St. Paul\'s Cathedral', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Anglican cathedral with Gothic architecture' },
//   { id: '13', name: 'Town Hall', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic building in Greek Revival style' },
//   { id: '14', name: 'Writers\' Building', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Former office of the Chief Minister of West Bengal' },
//   { id: '15', name: 'Kalighat Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Hindu temple dedicated to Goddess Kali' },
//   { id: '16', name: 'Pareshnath Jain Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Beautiful Jain temple with intricate glasswork' },
//   { id: '17', name: 'Armenian Church of Nazareth', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest Armenian church in Kolkata' },
//   { id: '18', name: 'Academy of Fine Arts', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Premier art institution in Kolkata' },
//   { id: '19', name: 'Nandan & Rabindra Sadan', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Cultural complex for films and performances' },
//   { id: '20', name: 'Birla Planetarium', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Largest planetarium in Asia' },
//   { id: '21', name: 'Science City', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Science museum and educational center' },
//   { id: '22', name: 'Kolkata Tram Ride', category: 'adventure', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Heritage tram ride through the city' },
//   { id: '23', name: 'Maidan', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Large urban park in central Kolkata' },
//   { id: '24', name: 'Botanical Garden (Shibpur)', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Botanical gardens with the Great Banyan Tree' },
//   { id: '25', name: 'Alipore Zoo', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest zoological park in India' },
//   { id: '26', name: 'Eco Park (New Town)', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Urban ecological park with recreational facilities' },
//   { id: '27', name: 'Nicco Park', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Amusement park with rides and attractions' },
//   { id: '28', name: 'New Market', category: 'shopping', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic shopping destination' },
//   { id: '29', name: 'Burrabazar', category: 'shopping', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'One of the largest wholesale markets in India' },
//   { id: '30', name: 'Chinatown (Tiretta Bazaar & Tangra)', category: 'food', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic Chinese neighborhood with authentic cuisine' },
// ].map(({ id, category, featured, ...rest }) => ({
//   ...rest, // name, city, country, images, description
//   location: {
//     type: 'Point',
//     coordinates: [getRandomLongitude(), getRandomLatitude()], // [lng, lat]
//   },
//   tags: [category, ...(featured ? ['featured'] : [])],
//   isActive: true,
// }));

// const ACTIVITIES = [
//    {
//     id: '1',
//     title: 'Victoria Memorial Heritage Walk',
//     category: 'cultural',
//     price: 549,
//     durationMinutes: 60,
//     placeId: '1',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Heritage Walk at the iconic Victoria Memorial'
//   },
//   {
//     id: '2',
//     title: 'Howrah Bridge Sunrise Photo Tour',
//     category: 'cultural',
//     price: 899,
//     durationMinutes: 60,
//     placeId: '2',
//     featured: true,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Sunrise Photo Tour at the iconic Howrah Bridge'
//   },
//   {
//     id: '3',
//     title: 'Prinsep Ghat Sunset Boat Ride',
//     category: 'nature',
//     price: 699,
//     durationMinutes: 60,
//     placeId: '3',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Sunset Boat Ride at the iconic Prinsep Ghat'
//   },
//   {
//     id: '4',
//     title: 'Marble Palace Art & Architecture Tour',
//     category: 'art',
//     price: 599,
//     durationMinutes: 120,
//     placeId: '5',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Art & Architecture Tour at the iconic Marble Palace'
//   },
//   {
//     id: '5',
//     title: 'College Street Book-Hunting with Chai',
//     category: 'cultural',
//     price: 499,
//     durationMinutes: 120,
//     placeId: '6',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Book-Hunting with Chai at the iconic College Street'
//   },
//   {
//     id: '6',
//     title: 'Park Street Food Crawl',
//     category: 'food',
//     price: 999,
//     durationMinutes: 90,
//     placeId: '7',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Food Crawl at the iconic Park Street'
//   },
//   {
//     id: '7',
//     title: 'Belur Math Spiritual Evening Aarti',
//     category: 'spiritual',
//     price: 399,
//     durationMinutes: 120,
//     placeId: '8',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Spiritual Evening Aarti at the iconic Belur Math'
//   },
//   {
//     id: '8',
//     title: 'Dakshineswar Temple Morning Darshan',
//     category: 'spiritual',
//     price: 599,
//     durationMinutes: 120,
//     placeId: '9',
//     featured: true,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Morning Darshan at the iconic Dakshineswar Temple'
//   },
//   {
//     id: '9',
//     title: 'Kolkata Tram Heritage Ride',
//     category: 'adventure',
//     price: 699,
//     durationMinutes: 90,
//     placeId: '10',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Heritage Ride at the iconic Kolkata Tram'
//   },
//   {
//     id: '10',
//     title: 'Eco Park Cycling Loop',
//     category: 'nature',
//     price: 599,
//     durationMinutes: 45,
//     placeId: '11',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Cycling Loop at the iconic Eco Park'
//   },
//   {
//     id: '11',
//     title: 'Science City Curious Minds Tour',
//     category: 'entertainment',
//     price: 899,
//     durationMinutes: 120,
//     placeId: '12',
//     featured: true,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Curious Minds Tour at the iconic Science City'
//   },
//   {
//     id: '12',
//     title: 'New Market Old-World Shopping Tour',
//     category: 'shopping',
//     price: 799,
//     durationMinutes: 90,
//     placeId: '13',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Old-World Shopping Tour at the iconic New Market'
//   },
//   {
//     id: '13',
//     title: 'Kumartuli Clay Idol Making Workshop',
//     category: 'cultural',
//     price: 999,
//     durationMinutes: 75,
//     placeId: '14',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Clay Idol Making Workshop at the iconic Kumartuli'
//   },
//   {
//     id: '14',
//     title: 'Alipore Zoo Family Animal Adventure',
//     category: 'entertainment',
//     price: 599,
//     durationMinutes: 120,
//     placeId: '15',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Family Animal Adventure at the iconic Alipore Zoo'
//   },
//   {
//     id: '15',
//     title: 'Rabindra Sarobar Morning Nature Walk',
//     category: 'nature',
//     price: 549,
//     durationMinutes: 45,
//     placeId: '16',
//     featured: true,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Morning Nature Walk at the iconic Rabindra Sarobar'
//   },
//   {
//     id: '16',
//     title: 'South City Mall Shopping Spree',
//     category: 'shopping',
//     price: 549,
//     durationMinutes: 120,
//     placeId: '17',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Shopping Spree at the iconic South City Mall'
//   },
//   {
//     id: '17',
//     title: 'Birla Planetarium Star Gazing Show',
//     category: 'entertainment',
//     price: 599,
//     durationMinutes: 45,
//     placeId: '18',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Star Gazing Show at the iconic Birla Planetarium'
//   },
//   {
//     id: '18',
//     title: 'Jorasanko Thakur Bari Tagore Heritage Tour',
//     category: 'cultural',
//     price: 599,
//     durationMinutes: 90,
//     placeId: '19',
//     featured: true,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Tagore Heritage Tour at the iconic Jorasanko Thakur Bari'
//   },
//   {
//     id: '19',
//     title: 'Indian Museum History Mystery Hunt',
//     category: 'cultural',
//     price: 999,
//     durationMinutes: 45,
//     placeId: '20',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'History Mystery Hunt at the iconic Indian Museum'
//   },
//   {
//     id: '20',
//     title: 'Salt Lake Stadium Football Fan Experience',
//     category: 'sports',
//     price: 799,
//     durationMinutes: 75,
//     placeId: '21',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Football Fan Experience at the iconic Salt Lake Stadium'
//   },
//   {
//     id: '21',
//     title: 'St. Pauls Cathedral Architectural Photo Tour',
//     category: 'art',
//     price: 549,
//     durationMinutes: 60,
//     placeId: '22',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Architectural Photo Tour at the iconic St. Pauls Cathedral'
//   },
//   {
//     id: '22',
//     title: 'Millennium Park Evening Riverside Stroll',
//     category: 'nature',
//     price: 399,
//     durationMinutes: 90,
//     placeId: '23',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Evening Riverside Stroll at the iconic Millennium Park'
//   },
//   {
//     id: '23',
//     title: 'Elliot Park Picnic & Games',
//     category: 'recreation',
//     price: 999,
//     durationMinutes: 75,
//     placeId: '24',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Picnic & Games at the iconic Elliot Park'
//   },
//   {
//     id: '24',
//     title: 'Nicco Park Adventure Rides Day',
//     category: 'entertainment',
//     price: 799,
//     durationMinutes: 60,
//     placeId: '25',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Adventure Rides Day at the iconic Nicco Park'
//   },
//   {
//     id: '25',
//     title: 'Mother House Mother Teresa Legacy Tour',
//     category: 'spiritual',
//     price: 549,
//     durationMinutes: 75,
//     placeId: '26',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Mother Teresa Legacy Tour at the iconic Mother House'
//   },
//   {
//     id: '26',
//     title: 'Sealdah Market Morning Bazaar Walk',
//     category: 'shopping',
//     price: 899,
//     durationMinutes: 120,
//     placeId: '27',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Morning Bazaar Walk at the iconic Sealdah Market'
//   },
//   {
//     id: '27',
//     title: 'Sovabazar Rajbari Zamindar Palace Tour',
//     category: 'cultural',
//     price: 499,
//     durationMinutes: 45,
//     placeId: '28',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Zamindar Palace Tour at the iconic Sovabazar Rajbari'
//   },
//   {
//     id: '28',
//     title: 'Metcalfe Hall Colonial Archives Tour',
//     category: 'history',
//     price: 999,
//     durationMinutes: 90,
//     placeId: '29',
//     featured: true,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Colonial Archives Tour at the iconic Metcalfe Hall'
//   },
//   {
//     id: '29',
//     title: 'Nandan Bengali Film Lovers Meetup',
//     category: 'entertainment',
//     price: 499,
//     durationMinutes: 90,
//     placeId: '30',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Bengali Film Lovers Meetup at the iconic Nandan'
//   },
//   {
//     id: '30',
//     title: 'Deshapriya Park Morning Yoga & Wellness',
//     category: 'wellness',
//     price: 599,
//     durationMinutes: 45,
//     placeId: '31',
//     featured: false,
//     isPublished: true,
//     images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
//     description: 'Morning Yoga & Wellness at the iconic Deshapriya Park'
//   }
//   // ...add the remaining activities...
// ].map(({ id, category, placeId, featured, isPublished, ...rest }) => ({
//   ...rest,
//   placeId, // keep for mapping to ObjectId later
//   tags: [category],
//   isActive: isPublished,
//   maxGroupSize: 20,
// }));

// const USERS = [
//   { id: '1', name: 'Srijon Karmakar',   email: 'srijon@gmail.com',   role: 'guide', createdAt: new Date('2024-04-28'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
//   { id: '2', name: 'Koushik Bala', email: 'koushik@gmail.com', role: 'admin', createdAt: new Date('2024-08-24'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
//   { id: '3', name: 'Swapnanil Dey', email: 'swapnanil@gmail.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
//  { id: '4', name: 'Subhranil Banarjee', email: 'subhranil@gmail.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
// { id: '5', name: 'Boby Peter Mondal',   email: 'boby@gmail.com',   role: 'guide', createdAt: new Date('2024-04-28'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
//   { id: '6', name: 'souvik mondal', email: 'souvik@gmail.com', role: 'instructor', createdAt: new Date('2024-08-24'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
//   { id: '7', name: 'djrana', email: 'djrana@gmail.com', role: 'instructor', createdAt: new Date('2024-08-24'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' },
//  { id: '8', name: 'Dibyapriya Jana', email: 'dibyapriya@gmail.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI' }

//   // ...add the remaining users...
// ].map(({ id, avatar, createdAt, ...rest }) => ({
//   ...rest,
//   password: 'admin@123', // will be hashed
//   verified: true,
//   isActive: true,
//   status: 'active',
//   avatarUrl: avatar,
// }));

// // -------------------- Helpers --------------------
// function getRandomLongitude() {
//   // Kolkata approx: 88.2–88.5
//   return 88.2 + Math.random() * 0.3;
// }

// function getRandomLatitude() {
//   // Kolkata approx: 22.45–22.7
//   return 22.45 + Math.random() * 0.25;
// }

// // -------------------- Seed Runner --------------------
// async function seedCompleteData() {
//   console.log('🔌 Connecting to MongoDB...');
//   await mongoose.connect(MONGO);
//   console.log('✅ Connected to MongoDB');

//   try {
//     // If you recently changed indexes, you can sync them (optional)
//     // await Place.syncIndexes();
//     // await Activity.syncIndexes();
//     // await User.syncIndexes();
//     // await Booking.syncIndexes();

//     console.log('🗑️  Clearing existing data...');
//     await Promise.all([
//       User.deleteMany({}),
//       Place.deleteMany({}),
//       Activity.deleteMany({}),
//       Booking.deleteMany({}),
//     ]);

//     // Users
//     console.log('👥 Adding users...');
//     const createdUsers = [];
//     for (const userData of USERS) {
//       const hash = await bcrypt.hash(userData.password, 12);
//       const user = new User({ ...userData, password: hash });
//       await user.save();
//       createdUsers.push(user);
//       console.log(`✅ Added user: ${user.email} (${user.role})`);
//     }

//     // Places
//     console.log('🏛️ Adding places...');
//     const createdPlaces = [];
//     const placeMap = new Map(); // old id -> new ObjectId
//     for (const placeData of PLACES) {
//       const place = new Place(placeData);
//       await place.save();
//       createdPlaces.push(place);
//       // Store mapping by the original numeric string id if present
//       if (placeData.id) placeMap.set(placeData.id, place._id);
//       console.log(`✅ Added place: ${place.name}`);
//     }

//     // Activities
//     console.log('🎯 Adding activities...');
//     const createdActivities = [];
//     for (const activityData of ACTIVITIES) {
//       const placeObjectId = placeMap.get(activityData.placeId);
//       if (!placeObjectId) {
//         console.warn(`⚠️  Skipping activity "${activityData.title}" — unknown placeId: ${activityData.placeId}`);
//         continue;
//       }

//       // Ensure images are strings (URLs). Your Activity model uses images: [String]
//       const images = Array.isArray(activityData.images)
//         ? activityData.images.map(String)
//         : [];

//       const activity = new Activity({
//         title: activityData.title,
//         description: activityData.description ?? '',
//         category: activityData.category,
//         price: Number(activityData.price) || 0,
//         durationMinutes: Number(activityData.durationMinutes) || 60,
//         place: placeObjectId, // ✅ actual ref field
//         featured: !!activityData.featured,
//         isPublished: !!activityData.isPublished,
//         tags: Array.isArray(activityData.tags) ? activityData.tags : [],
//         isActive: activityData.isActive !== false, // default true unless explicitly false
//         maxGroupSize: Number(activityData.maxGroupSize) || 20,
//         images,
//       });

//       await activity.save();
//       createdActivities.push(activity);
//       console.log(`✅ Added activity: ${activity.title}`);
//     }

//     // Bookings
//     console.log('📅 Adding bookings...');
//     const bookingStatuses = ['pending', 'confirmed', 'cancelled'];
//     for (let i = 0; i < 50; i++) {
//       const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
//       const randomActivity = createdActivities[Math.floor(Math.random() * createdActivities.length)];
//       if (!randomActivity) break;

//       const booking = new Booking({
//         user: randomUser._id,
//         activity: randomActivity._id,
//         date: new Date(Date.now() + i * 3 * 24 * 60 * 60 * 1000),
//         peopleCount: Math.floor(Math.random() * 5) + 1,
//         status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
//         notes: `Booking for ${randomActivity.title}`,
//       });

//       await booking.save();
//       console.log(`✅ Added booking: ${randomUser.name} -> ${randomActivity.title}`);
//     }

//     console.log('\n🎉 Complete data seeding finished!');
//     console.log('📊 Summary:');
//     console.log(`   Users: ${createdUsers.length}`);
//     console.log(`   Places: ${createdPlaces.length}`);
//     console.log(`   Activities: ${createdActivities.length}`);
//     console.log(`   Bookings: ${50}`);
//   } catch (error) {
//     console.error('❌ Error seeding data:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log('🔌 Disconnected from MongoDB');
//   }
// }

// seedCompleteData();
// scripts/seedCompleteData.js - Works with your current schemas
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Place } from '../models/Place.js';
import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO = process.env.MONGO_URL;
if (!MONGO) {
  console.error('❌ MONGO_URL missing in .env');
  process.exit(1);
}

// -------------------- Sample Data --------------------

// Places Data
const PLACES_RAW = [
  { id: '1', name: 'Victoria Memorial', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Iconic marble building and museum dedicated to Queen Victoria' },
  { id: '2', name: 'Howrah Bridge', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41'], description: 'Famous cantilever bridge over Hooghly River' },
  { id: '3', name: 'Prinsep Ghat', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Scenic riverside ghat with colonial architecture' },
  { id: '4', name: 'Marble Palace', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Neoclassical mansion with art collection' },
  { id: '5', name: 'Jorasanko Thakur Bari', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Birthplace of Rabindranath Tagore' },
  { id: '6', name: 'Indian Museum', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest and largest museum in India' },
  { id: '7', name: 'Dakshineswar Kali Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Hindu temple dedicated to Goddess Kali' },
  { id: '8', name: 'Belur Math', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Headquarters of Ramakrishna Mission' },
  { id: '9', name: 'College Street', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Famous street of books and educational institutions' },
  { id: '10', name: 'Park Street', category: 'food', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Popular street for restaurants and nightlife' },
  { id: '11', name: 'Metropolitan Building', category: 'architectural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic colonial-era building' },
  { id: '12', name: 'St. Paul\'s Cathedral', category: 'architectural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Anglican cathedral with Gothic architecture' },
  { id: '13', name: 'Town Hall', category: 'architectural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic building in Greek Revival style' },
  { id: '14', name: 'Writers\' Building', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Former office of the Chief Minister of West Bengal' },
  { id: '15', name: 'Kalighat Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Hindu temple dedicated to Goddess Kali' },
  { id: '16', name: 'Pareshnath Jain Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Beautiful Jain temple with intricate glasswork' },
  { id: '17', name: 'Armenian Church of Nazareth', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest Armenian church in Kolkata' },
  { id: '18', name: 'Academy of Fine Arts', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Premier art institution in Kolkata' },
  { id: '19', name: 'Nandan & Rabindra Sadan', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Cultural complex for films and performances' },
  { id: '20', name: 'Birla Planetarium', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Largest planetarium in Asia' },
  { id: '21', name: 'Science City', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Science museum and educational center' },
  { id: '22', name: 'Kolkata Tram Route', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Heritage tram ride through the city' },
  { id: '23', name: 'Maidan', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Large urban park in central Kolkata' },
  { id: '24', name: 'Botanical Garden (Shibpur)', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Botanical gardens with the Great Banyan Tree' },
  { id: '25', name: 'Alipore Zoo', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest zoological park in India' },
  { id: '26', name: 'Eco Park (New Town)', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Urban ecological park with recreational facilities' },
  { id: '27', name: 'Nicco Park', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Amusement park with rides and attractions' },
  { id: '28', name: 'New Market', category: 'shopping', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic shopping destination' },
  { id: '29', name: 'Burrabazar', category: 'shopping', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'One of the largest wholesale markets in India' },
  { id: '30', name: 'Chinatown (Tiretta Bazaar & Tangra)', category: 'food', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic Chinese neighborhood with authentic cuisine' },
];

// Transform places properly (keeping all fields)
const PLACES = PLACES_RAW.map(({ id, ...rest }) => ({
  ...rest, // This preserves category, featured, and all other fields
  location: {
    type: 'Point',
    coordinates: [getRandomLongitude(), getRandomLatitude()], // [lng, lat]
  },
  tags: [rest.category, ...(rest.featured ? ['featured'] : [])],
  isActive: true,
}));

// Activities Data - using only categories that exist in Activity schema
const ACTIVITIES = [
  // Victoria Memorial Activities
  {
    id: '1',
    title: 'Victoria Memorial Heritage Walk & Museum Tour',
    category: 'cultural',
    price: 549,
    durationMinutes: 90,
    placeId: '1',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Explore the iconic Victoria Memorial with expert guide commentary on British colonial history and architecture.',
    capacity: 25,
    tags: ['heritage', 'museum', 'colonial', 'history']
  },
  {
    id: '2',
    title: 'Victoria Memorial Evening Light & Sound Show',
    category: 'entertainment',
    price: 799,
    durationMinutes: 60,
    placeId: '1',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Experience the magnificent light and sound show that brings the history of Victoria Memorial to life.',
    capacity: 50,
    tags: ['light show', 'evening', 'entertainment']
  },

  // Howrah Bridge Activities
  {
    id: '3',
    title: 'Howrah Bridge Sunrise Photography Walk',
    category: 'adventure',
    price: 899,
    durationMinutes: 120,
    placeId: '2',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41'],
    description: 'Capture the iconic Howrah Bridge during golden hour with professional photography guidance.',
    capacity: 15,
    tags: ['photography', 'sunrise', 'bridge', 'boat ride']
  },
  {
    id: '4',
    title: 'Howrah Bridge Walking Tour & River Cruise',
    category: 'cultural',
    price: 699,
    durationMinutes: 90,
    placeId: '2',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41'],
    description: 'Walk across the historic cantilever bridge and enjoy a peaceful cruise on the Hooghly River.',
    capacity: 20,
    tags: ['walking tour', 'river cruise', 'heritage']
  },

  // Prinsep Ghat Activities
  {
    id: '5',
    title: 'Prinsep Ghat Sunset Boat Ride',
    category: 'nature',
    price: 649,
    durationMinutes: 75,
    placeId: '3',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Romantic sunset boat ride along the Hooghly River with stunning views of colonial architecture.',
    capacity: 30,
    tags: ['sunset', 'boat ride', 'romantic', 'river']
  },

  // Continue with more activities...
  {
    id: '6',
    title: 'Marble Palace Art & Architecture Heritage Tour',
    category: 'art',
    price: 749,
    durationMinutes: 120,
    placeId: '4',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Explore the magnificent 19th-century mansion with its priceless collection of European sculptures.',
    capacity: 15,
    tags: ['art', 'sculpture', 'paintings', 'mansion']
  },
  {
    id: '7',
    title: 'Tagore Heritage & Cultural Experience',
    category: 'cultural',
    price: 649,
    durationMinutes: 120,
    placeId: '5',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Immerse yourself in Rabindranath Tagore\'s world with guided tour and cultural performances.',
    capacity: 25,
    tags: ['tagore', 'poetry', 'culture', 'nobel prize']
  },
  {
    id: '8',
    title: 'Indian Museum Guided Discovery Tour',
    category: 'cultural',
    price: 599,
    durationMinutes: 150,
    placeId: '6',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Comprehensive guided tour of India\'s oldest museum featuring Egyptian mummies and rare artifacts.',
    capacity: 20,
    tags: ['museum', 'artifacts', 'history', 'education']
  },
  {
    id: '9',
    title: 'Dakshineswar Temple Spiritual Experience',
    category: 'spiritual',
    price: 449,
    durationMinutes: 90,
    placeId: '7',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Participate in morning aarti and learn about the spiritual legacy of Sri Ramakrishna.',
    capacity: 35,
    tags: ['temple', 'aarti', 'ramakrishna', 'spiritual']
  },
  {
    id: '10',
    title: 'Belur Math Spiritual Heritage Tour',
    category: 'spiritual',
    price: 399,
    durationMinutes: 105,
    placeId: '8',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Explore the headquarters of Ramakrishna Mission and learn about Swami Vivekananda\'s teachings.',
    capacity: 40,
    tags: ['vivekananda', 'mission', 'heritage', 'philosophy']
  },
  {
    id: '11',
    title: 'College Street Book Hunting & Chai Walk',
    category: 'cultural',
    price: 499,
    durationMinutes: 120,
    placeId: '9',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Navigate through the world\'s largest second-hand book market with expert guidance.',
    capacity: 15,
    tags: ['books', 'chai', 'market', 'literary']
  },
  {
    id: '12',
    title: 'Park Street Food Crawl Experience',
    category: 'food',
    price: 1299,
    durationMinutes: 180,
    placeId: '10',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Culinary journey through Park Street\'s legendary restaurants sampling diverse delicacies.',
    capacity: 18,
    tags: ['food crawl', 'restaurants', 'anglo-indian', 'chinese']
  },
  {
    id: '13',
    title: 'Colonial Architecture Photography Tour',
    category: 'historical',
    price: 649,
    durationMinutes: 90,
    placeId: '11',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Capture the grandeur of colonial-era architecture with professional photography guidance.',
    capacity: 15,
    tags: ['photography', 'colonial', 'architecture', 'heritage']
  },
  {
    id: '14',
    title: 'St. Paul\'s Cathedral Gothic Architecture Tour',
    category: 'historical',
    price: 549,
    durationMinutes: 75,
    placeId: '12',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Explore the stunning Gothic Revival architecture and learn about Kolkata\'s Christian heritage.',
    capacity: 25,
    tags: ['cathedral', 'gothic', 'christian', 'architecture']
  },
  {
    id: '15',
    title: 'Town Hall Greek Revival Architecture Walk',
    category: 'historical',
    price: 449,
    durationMinutes: 60,
    placeId: '13',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Admire the Greek Revival architecture and learn about colonial administration history.',
    capacity: 20,
    tags: ['greek revival', 'colonial', 'administration', 'history']
  },
  {
    id: '16',
    title: 'Heritage Tram Ride Through Old Kolkata',
    category: 'adventure',
    price: 599,
    durationMinutes: 90,
    placeId: '22',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Ride the last remaining tram system in India through historic neighborhoods.',
    capacity: 25,
    tags: ['tram', 'heritage', 'vintage', 'neighborhoods']
  },
  {
    id: '17',
    title: 'Maidan Morning Walk & Exercise',
    category: 'nature',
    price: 299,
    durationMinutes: 75,
    placeId: '23',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Join locals for energizing morning walk and traditional exercises in Kolkata\'s largest urban park.',
    capacity: 35,
    tags: ['morning walk', 'exercise', 'urban park', 'local experience']
  },
  {
    id: '18',
    title: 'Botanical Garden Nature Photography Walk',
    category: 'nature',
    price: 699,
    durationMinutes: 150,
    placeId: '24',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Photograph exotic flora including the famous Great Banyan Tree with professional guidance.',
    capacity: 18,
    tags: ['photography', 'banyan tree', 'flora', 'nature']
  },
  {
    id: '19',
    title: 'Alipore Zoo Wildlife Conservation Tour',
    category: 'nature',
    price: 549,
    durationMinutes: 120,
    placeId: '25',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Educational tour focusing on wildlife conservation efforts at India\'s oldest zoo.',
    capacity: 25,
    tags: ['wildlife', 'conservation', 'zoo', 'education']
  },
  {
    id: '20',
    title: 'Eco Park Cycling & Nature Adventure',
    category: 'adventure',
    price: 749,
    durationMinutes: 120,
    placeId: '26',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Cycle through themed gardens, enjoy boating, and experience adventure activities.',
    capacity: 20,
    tags: ['cycling', 'boating', 'adventure', 'themed gardens']
  },
  {
    id: '21',
    title: 'Nicco Park Adventure Rides Experience',
    category: 'entertainment',
    price: 999,
    durationMinutes: 240,
    placeId: '27',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Full day of thrilling rides, water sports, and entertainment at Kolkata\'s premier amusement park.',
    capacity: 30,
    tags: ['amusement park', 'rides', 'water sports', 'thrilling']
  },
  {
    id: '22',
    title: 'New Market Shopping Heritage Tour',
    category: 'shopping',
    price: 649,
    durationMinutes: 120,
    placeId: '28',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Navigate the historic New Market with expert guides to find the best deals on textiles and crafts.',
    capacity: 18,
    tags: ['shopping', 'heritage', 'textiles', 'handicrafts']
  },
  {
    id: '23',
    title: 'Burrabazar Wholesale Market Experience',
    category: 'shopping',
    price: 549,
    durationMinutes: 150,
    placeId: '29',
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Explore one of Asia\'s largest wholesale markets with insider knowledge of best bargains.',
    capacity: 15,
    tags: ['wholesale', 'bargains', 'market', 'authentic products']
  },
  {
    id: '24',
    title: 'Chinatown Authentic Food Tour',
    category: 'food',
    price: 1199,
    durationMinutes: 180,
    placeId: '30',
    featured: true,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Culinary journey through Tiretta Bazaar and Tangra with authentic Chinese-Indian fusion cuisine.',
    capacity: 16,
    tags: ['chinese food', 'fusion cuisine', 'cultural tour', 'authentic']
  }
].map(({ id, placeId, featured, isPublished, ...rest }) => ({
  ...rest,
  placeId, // Keep for mapping to ObjectId later
  featured: !!featured,
  isPublished: !!isPublished,
  isActive: isPublished !== false,
  averageRating: Math.random() * 2 + 3, // Random rating between 3-5
  totalReviews: Math.floor(Math.random() * 100), // Random review count
}));

const USERS = [
  { id: '1', name: 'Demo Guide', email: 'demo@guide.com', role: 'guide', createdAt: new Date('2024-04-28'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '2', name: 'Koushik Bala', email: 'koushik@gmail.com', role: 'admin', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '3', name: 'Swapnanil Dey', email: 'swapnanil@gmail.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '4', name: 'Subhranil Banerjee', email: 'subhranil@gmail.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '5', name: 'Boby Peter Mondal', email: 'boby@gmail.com', role: 'guide', createdAt: new Date('2024-04-28'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '6', name: 'Demo Instructor', email: 'demo@instructor.com', role: 'instructor', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '7', name: 'DJ Rana', email: 'djrana@gmail.com', role: 'instructor', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '8', name: 'Demo Traveller', email: 'demo@traveller.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' }
].map(({ id, avatar, createdAt, ...rest }) => ({
  ...rest,
  password: 'admin@123', // will be hashed
  verified: true,
  isActive: true,
  status: 'active',
  avatarUrl: avatar,
}));

// -------------------- Helpers --------------------
function getRandomLongitude() {
  // Kolkata approx: 88.2–88.5
  return 88.2 + Math.random() * 0.3;
}

function getRandomLatitude() {
  // Kolkata approx: 22.45–22.7
  return 22.45 + Math.random() * 0.25;
}

// -------------------- Seed Runner --------------------
async function seedCompleteData() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO);
  console.log('✅ Connected to MongoDB');

  try {
    console.log('🗑️ Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Place.deleteMany({}),
      Activity.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // Users
    console.log('👥 Adding users...');
    const createdUsers = [];
    for (const userData of USERS) {
      const hash = await bcrypt.hash(userData.password, 12);
      const user = new User({ ...userData, password: hash });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Added user: ${user.email} (${user.role})`);
    }

    // Places
    console.log('🏛️ Adding places...');
    const createdPlaces = [];
    const placeMap = new Map(); // old id -> new ObjectId
    for (const placeData of PLACES) {
      const place = new Place(placeData);
      await place.save();
      createdPlaces.push(place);
      // Store mapping using index-based ID (for PLACES_RAW)
      const originalId = PLACES_RAW[createdPlaces.length - 1].id;
      placeMap.set(originalId, place._id);
      console.log(`✅ Added place: ${place.name} (${place.category})`);
    }

    // Activities
    console.log('🎯 Adding activities...');
    const createdActivities = [];
    for (const activityData of ACTIVITIES) {
      const placeObjectId = placeMap.get(activityData.placeId);
      if (!placeObjectId) {
        console.warn(`⚠️ Skipping activity "${activityData.title}" – unknown placeId: ${activityData.placeId}`);
        continue;
      }

      // Ensure images are strings (URLs)
      const images = Array.isArray(activityData.images)
        ? activityData.images.map(String)
        : [];

      const activity = new Activity({
        title: activityData.title,
        description: activityData.description ?? '',
        category: activityData.category,
        price: Number(activityData.price) || 0,
        durationMinutes: Number(activityData.durationMinutes) || 60,
        place: placeObjectId, // ✅ Correct ref field name
        featured: !!activityData.featured,
        isPublished: !!activityData.isPublished,
        isActive: activityData.isActive !== false,
        capacity: Number(activityData.capacity) || 20, // ✅ Correct field name
        images,
        tags: Array.isArray(activityData.tags) ? activityData.tags : [],
        averageRating: Number(activityData.averageRating) || 0,
        totalReviews: Number(activityData.totalReviews) || 0,
      });

      await activity.save();
      createdActivities.push(activity);
      console.log(`✅ Added activity: ${activity.title} (${activity.category}) - ₹${activity.price}`);
    }

    // Bookings
    console.log('📅 Adding bookings...');
    const bookingStatuses = ['pending', 'confirmed', 'cancelled'];
    for (let i = 0; i < 50; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomActivity = createdActivities[Math.floor(Math.random() * createdActivities.length)];
      if (!randomActivity) break;

      const booking = new Booking({
        user: randomUser._id,
        activity: randomActivity._id,
        date: new Date(Date.now() + i * 3 * 24 * 60 * 60 * 1000),
        peopleCount: Math.floor(Math.random() * 5) + 1,
        status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
        notes: `Booking for ${randomActivity.title}`,
      });

      await booking.save();
      console.log(`✅ Added booking: ${randomUser.name} -> ${randomActivity.title}`);
    }

    console.log('\n🎉 Complete data seeding finished!');
    console.log('📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Places: ${createdPlaces.length}`);
    console.log(`   Activities: ${createdActivities.length}`);
    console.log(`   Bookings: 50`);
    
    console.log('\n🏷️ Category Distribution:');
    const categoryCounts = {};
    createdActivities.forEach(activity => {
      categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
    });
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} activities`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedCompleteData();