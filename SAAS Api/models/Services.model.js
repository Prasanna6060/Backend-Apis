import mongoose from 'mongoose';

const { Schema } = mongoose;

const ServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,  
  },
  description: {
    type: String,
    required: false,  
  },
  category: {
    type: String,
    default: 'Electrical', 
  },
  availableCities: [{
    city: {
      type: String,
      required: true, 
    },
    state: {
      type: String,  
    },
    price: {
      type:  String,
      required: true,  // Price specific to this city
    },
  }],
  serviceWarranty: {
    type: String,
    default: '30 days',  // Default service guarantee
  },
}, { timestamps: true });

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
