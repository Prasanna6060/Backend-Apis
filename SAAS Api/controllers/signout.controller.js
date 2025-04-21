import User from '../models/User.model.js'; 
import Technician from '../models/Technician.model.js'; 
export const signOut = async (req, res) => {
  try {
    const { _id, role } = req.body; 
    console.log(_id)
    console.log(role)

    if (role === 'customer') {
      await User.findByIdAndUpdate(_id, { isLoggedIn: false });
    } else if (role === 'professional') {
      await Technician.findByIdAndUpdate(_id, { isLoggedIn: false });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    return res.clearCookie("access_token", { httpOnly: true })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Sign-out failed", error: error.message });
  }
};
