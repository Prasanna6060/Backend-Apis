import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
    { name: 'profile', maxCount: 1 },
    { name: 'citizenshipFront', maxCount: 1 },
    { name: 'citizenshipBack', maxCount: 1 },
    { name: 'trainingCertificate', maxCount: 1 }
  ]);
  
  export default upload;

  // for single upload
  export const singleUpload = multer({ storage }).single('profile')