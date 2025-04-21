import jwt from "jsonwebtoken";

export const jwtCheck = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid Token" });
  }
};
