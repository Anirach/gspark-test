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
  if (file.fieldname === 'coverImage') {
    if (validateFileType(file, 'image')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file. Only JPEG, PNG, WebP, and GIF files are allowed.'));
    }
  } else if (file.fieldname === 'pdfFile') {
    if (validateFileType(file, 'pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid PDF file. Only PDF files are allowed.'));
    }
  } else {
    cb(new Error('Unknown file field'));
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
  
  if (error.message.includes('Invalid')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};