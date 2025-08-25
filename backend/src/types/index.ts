import { Book, LendingInfo } from '@prisma/client';

// Book Status and Genre Types (since SQLite doesn't support enums)
export type BookStatus = 'OWNED' | 'LENT' | 'WISHLIST';
export type BookGenre = 
  | 'FICTION' 
  | 'NON_FICTION' 
  | 'SCIENCE' 
  | 'HISTORY' 
  | 'BIOGRAPHY' 
  | 'FANTASY' 
  | 'MYSTERY' 
  | 'ROMANCE' 
  | 'TECHNOLOGY' 
  | 'BUSINESS' 
  | 'SELF_HELP' 
  | 'TRAVEL' 
  | 'COOKING' 
  | 'ART' 
  | 'DESIGN' 
  | 'ARCHITECTURE' 
  | 'OTHER';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Book Types
export interface BookWithLending extends Book {
  lendingInfo?: LendingInfo | null;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  description?: string;
  coverImage?: string;
  pdfFile?: string;
  status?: BookStatus;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

export interface BookFilters {
  search?: string;
  status?: BookStatus | 'all';
  genre?: string | 'all';
  page?: number;
  limit?: number;
}

// Lending Types
export interface CreateLendingRequest {
  borrowerName: string;
  borrowerContact: string;
  dateLent: string;
  expectedReturn: string;
  notes?: string;
}

export interface ReturnBookRequest {
  bookId: string;
  actualReturn?: string;
  notes?: string;
}

// File Upload Types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: ValidationError[];
}