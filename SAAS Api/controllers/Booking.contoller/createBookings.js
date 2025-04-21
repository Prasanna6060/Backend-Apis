import Booking from "../../models/Booking.model.js";
import Technician from "../../models/Technician.model.js";
import nodemailer from "nodemailer";
import "dotenv/config.js"

export const createBookings = async (req, res) => {
  const { userId, technicianId, services, location } = req.body;
  const serviceCategory = services[0].serviceCategory;
  const name = services[0].name;

  try {
    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      userId,
      technicianId,
      services: { $elemMatch: { serviceCategory, name } },
      location,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ success: false, message: "Booking already exists" });
    }

    // Fetch technician's email from database
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return res
        .status(404)
        .json({ success: false, message: "Technician not found" });
    }
    const technicianEmail = technician.email;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use 'false' for STARTTLS
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "nepalbibidhsewa81@gmail.com",
      to: technicianEmail,
      subject: "New Booking Notification",
      text: `You have been booked for  ${name} of ${serviceCategory} service at ${location.address}.`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(mailOptions);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to send email notification",
          });
      } else {
        // Create new booking
        const booking = new Booking(req.body);
        try {
          const savedBooking = await booking.save();
          return res.status(201).json({
            success: true,
            message: "Booking created successfully and email sent to technician",
            savedBooking,
          });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to create booking" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
