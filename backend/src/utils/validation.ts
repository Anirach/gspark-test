import { z } from 'zod';
import { BookStatus } from '../types';

// Book status validation
const bookStatusSchema = z.enum(['OWNED', 'LENT', 'WISHLIST']);

// Book validation schemas
export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  author: z.string().min(1, 'Author is required').max(255, 'Author name is too long'),
  isbn: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  pdfFile: z.string().optional(),
  status: bookStatusSchema.optional()
});

export const updateBookSchema = createBookSchema.partial();

export const bookFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.union([bookStatusSchema, z.literal('all')]).optional(),
  genre: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10)
});

// Lending validation schemas
export const createLendingSchema = z.object({
  borrowerName: z.string().min(1, 'Borrower name is required').max(255, 'Name is too long'),
  borrowerContact: z.string().min(1, 'Contact information is required').max(255, 'Contact is too long'),
  dateLent: z.string().datetime('Invalid date format'),
  expectedReturn: z.string().datetime('Invalid date format'),
  notes: z.string().optional()
}).refine(data => {
  const lentDate = new Date(data.dateLent);
  const returnDate = new Date(data.expectedReturn);
  return returnDate > lentDate;
}, {
  message: 'Expected return date must be after the lending date',
  path: ['expectedReturn']
});

export const returnBookSchema = z.object({
  actualReturn: z.string().datetime('Invalid date format').optional(),
  notes: z.string().optional()
});

// File validation
export const fileValidation = {
  image: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  pdf: {
    allowedTypes: ['application/pdf'],
    maxSize: 50 * 1024 * 1024, // 50MB
  }
};

export const validateFileType = (file: Express.Multer.File, type: 'image' | 'pdf'): boolean => {
  const config = fileValidation[type];
  return config.allowedTypes.includes(file.mimetype) && file.size <= config.maxSize;
};