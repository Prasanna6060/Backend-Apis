import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const handleUpload = async (file, folder) => {
    if (!file) {
        throw new Error('No file provided for upload');
    }

    try {
        const res = await cloudinary.uploader.upload(file, {
            resource_type: 'image',  // or 'video', 'raw', etc.
            folder: folder            // Pass the folder parameter here
        });
        return res;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Error uploading file');
    }
};
