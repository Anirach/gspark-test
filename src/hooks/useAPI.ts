import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BookApiService, 
  CreateBookData, 
  UpdateBookData, 
  BookFilters, 
  LendingData 
} from '@/services/bookService';
import { Book } from '@/types/book';

// Query keys
const QUERY_KEYS = {
  books: (filters: BookFilters) => ['books', filters],
  book: (id: string) => ['book', id],
  stats: () => ['books', 'stats'],
  overdue: () => ['books', 'overdue']
};

// Custom hook for books management with API
export const useBooks = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BookFilters>({
    search: '',
    status: 'all',
    genre: 'all',
    page: 1,
    limit: 50
  });

  // Get books with filters
  const {
    data: booksResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.books(filters),
    queryFn: () => BookApiService.getBooks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get statistics
  const { data: statsResponse } = useQuery({
    queryKey: QUERY_KEYS.stats(),
    queryFn: () => BookApiService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create book mutation
  const createBookMutation = useMutation({
    mutationFn: (bookData: CreateBookData) => BookApiService.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  // Update book mutation
  const updateBookMutation = useMutation({
    mutationFn: (bookData: UpdateBookData) => BookApiService.updateBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  // Delete book mutation
  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => BookApiService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  // Lend book mutation
  const lendBookMutation = useMutation({
    mutationFn: ({ bookId, lendingData }: { bookId: string; lendingData: LendingData }) =>
      BookApiService.lendBook(bookId, lendingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  // Return book mutation
  const returnBookMutation = useMutation({
    mutationFn: ({ bookId, returnData }: { bookId: string; returnData?: any }) =>
      BookApiService.returnBook(bookId, returnData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  // Helper functions
  const updateFilters = useCallback((newFilters: Partial<BookFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const addBook = useCallback((bookData: CreateBookData) => {
    return createBookMutation.mutateAsync(bookData);
  }, [createBookMutation]);

  const updateBook = useCallback((id: string, bookData: Partial<CreateBookData>) => {
    return updateBookMutation.mutateAsync({ id, ...bookData });
  }, [updateBookMutation]);

  const deleteBook = useCallback((id: string) => {
    return deleteBookMutation.mutateAsync(id);
  }, [deleteBookMutation]);

  const lendBook = useCallback((bookId: string, lendingData: LendingData) => {
    return lendBookMutation.mutateAsync({ bookId, lendingData });
  }, [lendBookMutation]);

  const returnBook = useCallback((bookId: string, returnData?: any) => {
    return returnBookMutation.mutateAsync({ bookId, returnData });
  }, [returnBookMutation]);

  // Extract data from responses
  const books = booksResponse?.success ? booksResponse.data?.data || [] : [];
  const allBooks = books; // In this case, we're showing filtered results
  const stats = statsResponse?.success ? statsResponse.data : null;
  const pagination = booksResponse?.success ? {
    total: booksResponse.data?.total || 0,
    page: booksResponse.data?.page || 1,
    limit: booksResponse.data?.limit || 50,
    totalPages: booksResponse.data?.totalPages || 0
  } : null;

  return {
    // Data
    books,
    allBooks,
    stats,
    pagination,
    
    // Loading states
    isLoading,
    error,
    
    // Mutations loading states
    isCreating: createBookMutation.isPending,
    isUpdating: updateBookMutation.isPending,
    isDeleting: deleteBookMutation.isPending,
    isLending: lendBookMutation.isPending,
    isReturning: returnBookMutation.isPending,
    
    // Filters
    searchTerm: filters.search || '',
    filterStatus: filters.status || 'all',
    filterGenre: filters.genre || 'all',
    
    // Filter setters (for backward compatibility)
    setSearchTerm: (search: string) => updateFilters({ search }),
    setFilterStatus: (status: BookFilters['status']) => updateFilters({ status }),
    setFilterGenre: (genre: string) => updateFilters({ genre: genre || 'all' }),
    
    // Advanced filter management
    updateFilters,
    
    // Actions
    addBook,
    updateBook,
    deleteBook,
    lendBook,
    returnBook,
    refetch,
  };
};

// Hook for single book
export const useBook = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.book(id),
    queryFn: () => BookApiService.getBookById(id),
    enabled: !!id,
  });
};

// Hook for overdue books
export const useOverdueBooks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.overdue(),
    queryFn: () => BookApiService.getOverdueBooks(),
    staleTime: 5 * 60 * 1000,
  });
};