import Booking from "../../models/Booking.model.js";

export const getBookingByTechniciansId = async(req, res) => {
    const {id} = req.params;
    try {
        const technicianBooking = await Booking.find({ technicianId: id})
        res.status(200).json({technicianBooking});
    } catch (error) {
        res.status(500).json('Internal server error', error)
    }
}