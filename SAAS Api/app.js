import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";



import userRoutes from "./routes/User.route.js";
import adminRoutes from "./routes/Admin.route.js";
import technicianRoutes from "./routes/Technician.route.js";
import servicesRoutes from './routes/Service.route.js';
import bookingRoutes from './routes/Booking.route.js';
import signoutRoute from './routes/Signout.Route.js';
import {app, server } from './socketio.js';
import locationRoutes from './routes/Location.route.js';



const Port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("MongoDB connection error:", err.message));

// Middleware
app.use(cors({
  origin: [
    "https://nepalbibidhsewa.com",
    "https://nepal-bibidh-sewa.web.app",
    "https://nepal-bibidh-sewa.firebaseapp.com",
    "https://www.nepalbibidhsewa.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/services", servicesRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/signout', signoutRoute);
app.use('/api', locationRoutes);



// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: "Server health is ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize Socket.IO with the server

// Start the server
server.listen(Port, () => {
  console.log(`Server listening on port ${Port}`);
});
