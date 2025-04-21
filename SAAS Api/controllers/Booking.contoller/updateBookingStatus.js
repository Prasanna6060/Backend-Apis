import Booking from "../../models/Booking.model.js";
import Notification from "../../models/Notifications.model.js";

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 
    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ error: 'Invalid status. Must be "accepted" or "rejected".' });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status, id });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const message =
      status === "accepted"
        ? "Your booking has been accepted."
        : "Your booking has been rejected.";

    const notification = new Notification({
      userId: booking.userId, 
      technicianId: booking.technicianId, 
      message: message,
    });

    await notification.save();

    // Update the booking status
    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default updateBookingStatus;
