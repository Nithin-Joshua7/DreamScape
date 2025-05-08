// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import ENV_VARS from '../utils/envars.js';

// Validate Cloudinary credentials
if (!ENV_VARS.CLOUDINARY_CLOUD_NAME || !ENV_VARS.CLOUDINARY_API_KEY || !ENV_VARS.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary configuration failed: Missing required credentials');
  throw new Error('Cloudinary credentials are missing');
}

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: ENV_VARS.CLOUDINARY_CLOUD_NAME,
    api_key: ENV_VARS.CLOUDINARY_API_KEY,
    api_secret: ENV_VARS.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Cloudinary configuration error:', error.message);
  throw error;
}

export default cloudinary;