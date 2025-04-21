import Technician from "../models/Technician.model.js";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import { handleUpload } from "../utils/cloudinary.js";

export const registerTechnicians = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, specialty, zipCode,address,city, state } =
      req.body;
    const {
      profile = [],
      citizenshipFront = [],
      citizenshipBack = [],
      trainingCertificate = [],
    } = req.files;

    // Validate required fields
    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !password ||
      !specialty ||
      !zipCode   ||
      !address || 
      !city    ||
      !state
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the profile file is provided
    if (profile.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Profile photo is required" });
    }

    const findTechnician = await Technician.findOne({ email });
    if (findTechnician) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Upload profile photo
    const profilePhotoUri = getDataUri(profile[0]);
    const profilePhotoUpload = await handleUpload(
      profilePhotoUri.content,
      "technicians/profilephoto"
    );

    // Upload citizenship front
    const citizenshipFrontUpload =
      citizenshipFront.length > 0
        ? await handleUpload(
            getDataUri(citizenshipFront[0]).content,
            "technicians/citizenship_front"
          )
        : null;

    // Upload citizenship back
    const citizenshipBackUpload =
      citizenshipBack.length > 0
        ? await handleUpload(
            getDataUri(citizenshipBack[0]).content,
            "technicians/citizenship_back"
          )
        : null;

    // Upload training certificates
    const trainingCertificateUploads = await Promise.all(
      trainingCertificate.map(async (file) => {
        const upload = await handleUpload(
          getDataUri(file).content,
          "technicians/training_certificates"
        );
        return {
          url: upload.secure_url,
          public_id: upload.public_id,
        };
      })
    );

    // Create a new Technician instance
    const newTechnician = new Technician({
      name: fullname,
      email,
      phone: phoneNumber,
      password,
      role,
      specialty,
      location: [{
        zipCode,
        city,
        state,
        address
      }],
      profilePhoto: {
        url: profilePhotoUpload.secure_url,
        public_id: profilePhotoUpload.public_id,
      },
      citizenshipFront: citizenshipFrontUpload
        ? {
            url: citizenshipFrontUpload.secure_url,
            public_id: citizenshipFrontUpload.public_id,
          }
        : null,
      citizenshipBack: citizenshipBackUpload
        ? {
            url: citizenshipBackUpload.secure_url,
            public_id: citizenshipBackUpload.public_id,
          }
        : null,
      trainingCertificates: trainingCertificateUploads,
      createdAt: new Date(),
    });

    // Save the technician to the database
    const savedTechnician = await newTechnician.save();

    // Return the saved technician details
    return res
      .status(201)
      .json({ success: true, message: "Account registered successfully" });
  } catch (error) {
    console.error("Error registering technician:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginTechnician = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await Technician.findOne({ email });

    if (!findUser) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { _id, email: userEmail, role, profilePhoto, name,phoneNumber, location} = findUser;
    console.log("finduser", findUser);
    console.log("location", location);

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        success: true,
        token,
        user: { _id, userEmail, role, profilePhoto, name, phoneNumber, location},
        message: `${name} is logged in successfully`,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};



// export const getTechnicianById = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const technician = await Technician.findById(_id);
//     if (!technician) {
//       return res.status(404).json({ msg: "Technician not found" });
//     }
//     console.log(technician);
//     res.json(technician);
//   } catch (error) {
//     res.send(error.message);
//     res.status(500);
//   }
// };

export const getALlTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.json({ success: true, technicians });
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

export const searchTechniciansByLocation = async (req, res) => {
  try {
    const { specialty, city, zipCode } = req.query;


    // Initialize the query object
    let query = {};


    const trimmedCity = city ? city.trim() : undefined
    const trimmedZipCode = zipCode ? zipCode.trim() : undefined
    // Add specialty filter if provided
    if (specialty) {
      query.specialty = { $regex: new RegExp(specialty, 'i') }; // Case-insensitive match
    }

    // Add location filters if provided
    if (city) {
      query["location.city"] = trimmedCity;
    }
    if (zipCode) {
      query["location.zipCode"] = trimmedZipCode;
    }

    // console.log("Query:", query); // Debug: Check the constructed query

    // Find technicians based on the built query
    const technicians = await Technician.find(query);

    if (technicians.length === 0) {
      return res.status(404).json({ message: "No technicians found matching the criteria" });
    }

    res.status(200).json({success: true, technicians});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

