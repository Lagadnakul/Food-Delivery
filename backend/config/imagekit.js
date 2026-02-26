import dotenv from 'dotenv';
import ImageKit from 'imagekit';

dotenv.config();

// Initialize ImageKit with your credentials (optional - only if keys are provided)
let imagekit = null;

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

// Only initialize if all keys are provided, not empty, and not placeholder values
const hasValidKeys = publicKey && privateKey && urlEndpoint && 
    publicKey.trim() !== '' && 
    privateKey.trim() !== '' && 
    urlEndpoint.trim() !== '' &&
    !publicKey.includes('your_') && 
    !privateKey.includes('your_') &&
    !urlEndpoint.includes('your_');

if (hasValidKeys) {
  try {
    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
    console.log('ImageKit initialized successfully');
  } catch (error) {
    console.warn('ImageKit initialization failed:', error.message);
    console.warn('Image uploads will not work. Using local assets instead.');
  }
} else {
  console.log('ImageKit not configured - using local assets for images');
}

export default imagekit;