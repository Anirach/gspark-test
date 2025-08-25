import { Request, Response } from 'express';
import { BookService } from '../services/bookService';
import { 
  ApiResponse, 
  CreateBookRequest, 
  UpdateBookRequest, 
  BookFilters,
  CreateLendingRequest 
} from '../types';
import { asyncHandler } from '../middleware';
import path from 'path';
import fs from 'fs';

const bookService = new BookService();

export const bookController = {
  // GET /api/books - Get all books with filters
  getAllBooks: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const filters = req.query as BookFilters;
    const result = await bookService.getAllBooks(filters);
    
    res.json({
      success: true,
      data: result
    });
  }),

  // GET /api/books/:id - Get book by ID
  getBookById: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  }),

  // POST /api/books - Create new book
  createBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const bookData: CreateBookRequest = req.body;
    
    // Handle uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files?.coverImage?.[0]) {
      bookData.coverImage = `/uploads/covers/${files.coverImage[0].filename}`;
    }
    if (files?.pdfFile?.[0]) {
      bookData.pdfFile = `/uploads/pdfs/${files.pdfFile[0].filename}`;
    }
    
    const book = await bookService.createBook(bookData);
    
    res.status(201).json({
      success: true,
      data: book,
      message: 'Book created successfully'
    });
  }),

  // PUT /api/books/:id - Update book
  updateBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    const bookData: UpdateBookRequest = { ...req.body, id };
    
    // Check if book exists
    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Handle uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (files?.coverImage?.[0]) {
      // Delete old cover image if exists
      if (existingBook.coverImage) {
        const oldPath = path.join(process.cwd(), existingBook.coverImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      bookData.coverImage = `/uploads/covers/${files.coverImage[0].filename}`;
    }
    
    if (files?.pdfFile?.[0]) {
      // Delete old PDF if exists
      if (existingBook.pdfFile) {
        const oldPath = path.join(process.cwd(), existingBook.pdfFile);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      bookData.pdfFile = `/uploads/pdfs/${files.pdfFile[0].filename}`;
    }
    
    const book = await bookService.updateBook(id, bookData);
    
    res.json({
      success: true,
      data: book,
      message: 'Book updated successfully'
    });
  }),

  // DELETE /api/books/:id - Delete book
  deleteBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    
    // Check if book exists and get file paths
    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Delete associated files
    if (existingBook.coverImage) {
      const coverPath = path.join(process.cwd(), existingBook.coverImage);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    if (existingBook.pdfFile) {
      const pdfPath = path.join(process.cwd(), existingBook.pdfFile);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
    
    await bookService.deleteBook(id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  }),

  // POST /api/books/:id/lend - Lend book
  lendBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    const lendingData: CreateLendingRequest = req.body;
    
    // Check if book exists and is available
    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    if (existingBook.status === 'LENT') {
      return res.status(400).json({
        success: false,
        error: 'Book is already lent out'
      });
    }
    
    const book = await bookService.lendBook(id, lendingData);
    
    res.json({
      success: true,
      data: book,
      message: 'Book lent successfully'
    });
  }),

  // POST /api/books/:id/return - Return book
  returnBook: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    const returnData = req.body;
    
    // Check if book exists and is lent
    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    if (existingBook.status !== 'LENT') {
      return res.status(400).json({
        success: false,
        error: 'Book is not currently lent out'
      });
    }
    
    const book = await bookService.returnBook(id, returnData);
    
    res.json({
      success: true,
      data: book,
      message: 'Book returned successfully'
    });
  }),

  // GET /api/books/stats - Get lending statistics
  getStats: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const stats = await bookService.getLendingStats();
    
    res.json({
      success: true,
      data: stats
    });
  }),

  // GET /api/books/overdue - Get overdue books
  getOverdueBooks: asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const overdueBooks = await bookService.getOverdueBooks();
    
    res.json({
      success: true,
      data: overdueBooks
    });
  })
};