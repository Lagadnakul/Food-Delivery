import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import imagekit from '../config/imagekit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Create the tmp/uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../tmp/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WEBP are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware to upload file to ImageKit
const uploadToImageKit = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filepath = path.join(uploadDir, req.file.filename);
    const fileBuffer = fs.readFileSync(filepath);
    
    // Check if ImageKit is configured
    if (!imagekit) {
      // ImageKit not configured - use local file path instead
      console.log('ImageKit not configured, using local file storage');
      req.file.imagekit = {
        url: `/uploads/${req.file.filename}`,
        fileId: null,
        thumbnailUrl: null
      };
      
      // Move file to uploads folder instead of deleting
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.copyFileSync(filepath, path.join(uploadsDir, req.file.filename));
      fs.unlinkSync(filepath);
      
      return next();
    }
    
    // Upload to ImageKit
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.filename,
      folder: '/hunger-hive/food-items'
    });

    // Delete the temporary file
    fs.unlinkSync(filepath);
    
    // Add ImageKit data to request for controller use
    req.file.imagekit = {
      url: result.url,
      fileId: result.fileId,
      thumbnailUrl: result.thumbnailUrl
    };

    next();
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) {
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
    }
    return res.status(500).json({
      success: false,
      message: 'Error uploading image to ImageKit',
      error: error.message
    });
  }
};

export { upload, uploadToImageKit };
