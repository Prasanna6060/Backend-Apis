import serviceModel from "../models/Services.model.js";

export const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});

    if (!services.length) {
      return res.status(404).json({ message: "No services found." });
    }
    res.status(200).json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createServices = async (req, res) => {
  try {
    const services = req.body; 
    // console.log(req.body)
    // Validate the array format
    if (!Array.isArray(services)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }
    
    // Insert multiple services
    const savedServices = await serviceModel.insertMany(services);
    return res.status(201).json({ success: true, message: savedServices });
  } catch (err) {
    console.error("Error creating services:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getServicesById = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await serviceModel.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).send("Internal server error");
  }
};

export const getServiceName = async (req, res) => {
  try {
    const { category, name, location } = req.params;

    // Ensure params are trimmed
    const trimmedCategory = category.trim();
    const trimmedName = name.trim();
    const trimmedLocation = location.trim();

    // console.log('Querying with:', { trimmedCategory, trimmedName, trimmedLocation });

    // Refined case-insensitive query using regular expressions
    const service = await serviceModel.findOne({
      category: { $regex: new RegExp(trimmedCategory, 'i') },
      name: { $regex: new RegExp(trimmedName, 'i') },
      'availableCities.city': { $regex: new RegExp(trimmedLocation, 'i') } // Location match
    }).exec();

    if (!service) {
      console.log('Service not found in database for the given category, name, and location');
      return res.status(404).json({ message: 'Service not found in the specified location' });
    }

    return res.status(200).json({
      message: "Service found successfully",
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const trimmedCategory = category.trim();

    // Fetch all services that match the category
    const services = await serviceModel.find({
      category: { $regex: new RegExp(trimmedCategory, 'i') },
    });

    // Extract names from the services array
    const serviceNames = services.map(service => service.name);

    // Check if any services are found
    if (serviceNames.length > 0) {
      res.status(200).json({ names: serviceNames });
    } else {
      res.status(404).json({ message: "No services found for this category" });
    }
  } catch (err) {
    console.error("Error fetching services by category:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



