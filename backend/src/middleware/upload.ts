import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateFileType } from '../utils/validation';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadPath = file.fieldname === 'coverImage' 
      ? path.join(process.cwd(), 'uploads', 'covers')
      : path.join(process.cwd(), 'uploads', 'pdfs');
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueName = `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('File filter check:', {
    fieldname: file.fieldname,
    mimetype: file.mimetype,
    originalname: file.originalname,
    size: file.size
  });

  if (file.fieldname === 'coverImage') {
    // Check MIME type directly in the filter since size might not be available yet
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF files are allowed.`));
    }
  } else if (file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`Invalid PDF file type: ${file.mimetype}. Only PDF files are allowed.`));
    }
  } else {
    cb(new Error(`Unknown file field: ${file.fieldname}`));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 2 // Max 2 files (cover + pdf)
  }
});

// Upload middleware for book files
export const uploadBookFiles = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]);

// Handle multer errors
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  console.log('Upload error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds limit (50MB max)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files uploaded'
      });
    }
  }
  
  if (error.message.includes('Invalid') || error.message.includes('Unknown')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};