import { apiClient, ApiResponse, PaginatedResponse } from '@/lib/api';
import { Book } from '@/types/book';

export interface CreateBookData {
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  description?: string;
  status?: 'OWNED' | 'LENT' | 'WISHLIST';
  coverImage?: File;
  pdfFile?: File;
}

export interface UpdateBookData extends Partial<CreateBookData> {
  id: string;
}

export interface BookFilters {
  search?: string;
  status?: 'OWNED' | 'LENT' | 'WISHLIST' | 'all';
  genre?: string | 'all';
  page?: number;
  limit?: number;
}

export interface LendingData {
  borrowerName: string;
  borrowerContact: string;
  dateLent: string;
  expectedReturn: string;
  notes?: string;
}

export interface BookStats {
  totalBooks: number;
  ownedBooks: number;
  lentBooks: number;
  wishlistBooks: number;
}

export class BookApiService {
  // Get all books with filters and pagination
  static async getBooks(filters: BookFilters = {}): Promise<ApiResponse<PaginatedResponse<Book>>> {
    return apiClient.get<PaginatedResponse<Book>>('/books', filters);
  }

  // Get book by ID
  static async getBookById(id: string): Promise<ApiResponse<Book>> {
    return apiClient.get<Book>(`/books/${id}`);
  }

  // Create new book
  static async createBook(bookData: CreateBookData): Promise<ApiResponse<Book>> {
    const { coverImage, pdfFile, ...textData } = bookData;
    
    const formData = apiClient.createFormData(textData, {
      ...(coverImage && { coverImage }),
      ...(pdfFile && { pdfFile })
    });

    return apiClient.post<Book>('/books', formData);
  }

  // Update book
  static async updateBook(bookData: UpdateBookData): Promise<ApiResponse<Book>> {
    const { id, coverImage, pdfFile, ...textData } = bookData;
    
    const formData = apiClient.createFormData(textData, {
      ...(coverImage && { coverImage }),
      ...(pdfFile && { pdfFile })
    });

    return apiClient.put<Book>(`/books/${id}`, formData);
  }

  // Delete book
  static async deleteBook(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/books/${id}`);
  }

  // Lend book
  static async lendBook(bookId: string, lendingData: LendingData): Promise<ApiResponse<Book>> {
    return apiClient.post<Book>(`/books/${bookId}/lend`, lendingData);
  }

  // Return book
  static async returnBook(bookId: string, returnData?: { actualReturn?: string; notes?: string }): Promise<ApiResponse<Book>> {
    return apiClient.post<Book>(`/books/${bookId}/return`, returnData || {});
  }

  // Get statistics
  static async getStats(): Promise<ApiResponse<BookStats>> {
    return apiClient.get<BookStats>('/books/stats');
  }

  // Get overdue books
  static async getOverdueBooks(): Promise<ApiResponse<Book[]>> {
    return apiClient.get<Book[]>('/books/overdue');
  }

  // Health check
  static async healthCheck(): Promise<ApiResponse<any>> {
    return apiClient.get('/health');
  }
}