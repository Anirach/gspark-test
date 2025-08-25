import { Router } from 'express';
import { bookController } from '../controllers/bookController';
import { validateBody, validateQuery } from '../middleware';
import { uploadBookFiles, handleUploadError } from '../middleware/upload';
import {
  createBookSchema,
  updateBookSchema,
  bookFiltersSchema,
  createLendingSchema,
  returnBookSchema
} from '../utils/validation';

const router = Router();

// GET /api/books - Get all books with filters and pagination
router.get('/', 
  validateQuery(bookFiltersSchema),
  bookController.getAllBooks
);

// GET /api/books/stats - Get lending statistics
router.get('/stats', bookController.getStats);

// GET /api/books/overdue - Get overdue books
router.get('/overdue', bookController.getOverdueBooks);

// GET /api/books/:id - Get book by ID
router.get('/:id', bookController.getBookById);

// POST /api/books - Create new book (with file uploads)
router.post('/',
  uploadBookFiles,
  handleUploadError,
  validateBody(createBookSchema),
  bookController.createBook
);

// PUT /api/books/:id - Update book (with file uploads)
router.put('/:id',
  uploadBookFiles,
  handleUploadError,
  validateBody(updateBookSchema),
  bookController.updateBook
);

// DELETE /api/books/:id - Delete book
router.delete('/:id', bookController.deleteBook);

// POST /api/books/:id/lend - Lend book
router.post('/:id/lend',
  validateBody(createLendingSchema),
  bookController.lendBook
);

// POST /api/books/:id/return - Return book
router.post('/:id/return',
  validateBody(returnBookSchema),
  bookController.returnBook
);

export default router;