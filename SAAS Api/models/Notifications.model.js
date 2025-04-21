import mongoose from  "mongoose";

const notificationSchema = new mongoose.Schema({
   bookingId: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
   },
    message: {
        type: String
    }
}, {timestamps: true})

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;