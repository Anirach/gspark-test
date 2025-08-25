import { Prisma } from '@prisma/client';
import prisma from '../utils/database';
import { 
  BookWithLending, 
  CreateBookRequest, 
  UpdateBookRequest, 
  BookFilters, 
  PaginatedResponse,
  BookStatus
} from '../types';

export class BookService {
  // Get all books with filters and pagination
  async getAllBooks(filters: BookFilters): Promise<PaginatedResponse<BookWithLending>> {
    const { search, status, genre, page = 1, limit = 10 } = filters;
    
    const where: Prisma.BookWhereInput = {};
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // Genre filter
    if (genre && genre !== 'all') {
      where.genre = { contains: genre, mode: 'insensitive' };
    }
    
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          lendingInfo: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.book.count({ where })
    ]);
    
    return {
      data: books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // Get book by ID
  async getBookById(id: string): Promise<BookWithLending | null> {
    return prisma.book.findUnique({
      where: { id },
      include: {
        lendingInfo: true
      }
    });
  }
  
  // Create new book
  async createBook(bookData: CreateBookRequest): Promise<BookWithLending> {
    return prisma.book.create({
      data: {
        ...bookData,
        status: bookData.status || 'OWNED'
      },
      include: {
        lendingInfo: true
      }
    });
  }
  
  // Update book
  async updateBook(id: string, bookData: UpdateBookRequest): Promise<BookWithLending> {
    return prisma.book.update({
      where: { id },
      data: bookData,
      include: {
        lendingInfo: true
      }
    });
  }
  
  // Delete book
  async deleteBook(id: string): Promise<void> {
    await prisma.book.delete({
      where: { id }
    });
  }
  
  // Lend book
  async lendBook(bookId: string, lendingData: {
    borrowerName: string;
    borrowerContact: string;
    dateLent: string;
    expectedReturn: string;
    notes?: string;
  }): Promise<BookWithLending> {
    return prisma.book.update({
      where: { id: bookId },
      data: {
        status: 'LENT',
        lendingInfo: {
          create: {
            borrowerName: lendingData.borrowerName,
            borrowerContact: lendingData.borrowerContact,
            dateLent: new Date(lendingData.dateLent),
            expectedReturn: new Date(lendingData.expectedReturn),
            notes: lendingData.notes
          }
        }
      },
      include: {
        lendingInfo: true
      }
    });
  }
  
  // Return book
  async returnBook(bookId: string, returnData?: {
    actualReturn?: string;
    notes?: string;
  }): Promise<BookWithLending> {
    const actualReturn = returnData?.actualReturn ? new Date(returnData.actualReturn) : new Date();
    
    // Update lending info with return date
    await prisma.lendingInfo.updateMany({
      where: { bookId },
      data: {
        actualReturn,
        notes: returnData?.notes
      }
    });
    
    // Update book status back to owned
    return prisma.book.update({
      where: { id: bookId },
      data: {
        status: 'OWNED'
      },
      include: {
        lendingInfo: true
      }
    });
  }
  
  // Get lending statistics
  async getLendingStats(): Promise<{
    totalBooks: number;
    ownedBooks: number;
    lentBooks: number;
    wishlistBooks: number;
  }> {
    const [total, owned, lent, wishlist] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: 'OWNED' } }),
      prisma.book.count({ where: { status: 'LENT' } }),
      prisma.book.count({ where: { status: 'WISHLIST' } })
    ]);
    
    return {
      totalBooks: total,
      ownedBooks: owned,
      lentBooks: lent,
      wishlistBooks: wishlist
    };
  }
  
  // Get overdue books
  async getOverdueBooks(): Promise<BookWithLending[]> {
    const now = new Date();
    
    return prisma.book.findMany({
      where: {
        status: 'LENT',
        lendingInfo: {
          expectedReturn: {
            lt: now
          },
          actualReturn: null
        }
      },
      include: {
        lendingInfo: true
      }
    });
  }
}