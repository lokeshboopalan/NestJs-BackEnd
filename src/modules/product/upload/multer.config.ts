import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: "dsr0b6ijl",
  api_key: "231144526867365",
  api_secret: "jfR6MFI7TpbEF9UqSllqfFWpQ6w",
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'products',
    format: 'png',
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});