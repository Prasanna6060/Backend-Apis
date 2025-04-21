import mongoose from "mongoose";

const currentLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    currentLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

currentLocationSchema.index({ currentLocation: "2dsphere" });

const currentLocation = mongoose.model(
  "CurrentLocation",
  currentLocationSchema
);
export default currentLocation;
