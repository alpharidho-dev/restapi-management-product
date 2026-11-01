import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary-v2';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: {
    folder: 'restapi-management-product',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  } as any,
} as any);

export const upload = multer({
  storage: storage as any,
  limits: { fileSize: 2 * 1024 * 1024 },
});