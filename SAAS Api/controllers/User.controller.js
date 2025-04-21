import UserModel from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config.js';
// import twilio from 'twilio'; // Commented out if not used
// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const client = twilio(accountSid, authToken);
import { handleUpload } from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password, phoneNumber, fullname, zipCode, address,role } = req.body;
    const profile = req.file; // Multer stores the file here

    console.log('Incoming payload:', req.body, req.file);

    // Check if all required fields are provided
    if (!email || !password || !phoneNumber ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the profile image is uploaded
    if (!profile) {
      return res.status(400).json({ success: false, message: "Profile photo is required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Format the phone number
    const formattedPhoneNumber = `+977${phoneNumber}`;
    console.log('Formatted phone number:', formattedPhoneNumber);

    // Handle the file upload (e.g., upload to Cloudinary)
    const profilePhotoUri = getDataUri(profile);
    const profilePhotoUpload = await handleUpload(profilePhotoUri.content, "customers/profilephoto");

    // Create a new user instance
    const newUser = new UserModel({
       name: fullname,
      email,
      password,
      phoneNumber: formattedPhoneNumber,
      role,
      location: {
        zipCode,
        address,
      },
      profilePhoto: {
        url: profilePhotoUpload.secure_url,
        public_id: profilePhotoUpload.public_id
      },
    });

    console.log('New user instance before save:', newUser);

    // Save the user to the database
    const saveUser = await newUser.save();

   return res.status(200).json({ user: saveUser,success: true, message: 'Account registered successfully' });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await UserModel.findOne({ email });

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

    const { _id, email: userEmail, role, profilePhoto, name,phoneNumber, location: {address}} = findUser;

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        success: true,
        token,
        user: { _id, userEmail, role, profilePhoto, name, phoneNumber, address},
        message: `${name} is logged in successfully`,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

  