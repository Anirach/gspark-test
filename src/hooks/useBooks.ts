import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import bookCover1 from '@/assets/book-cover-1.jpg';
import bookCover2 from '@/assets/book-cover-2.jpg';
import bookCover3 from '@/assets/book-cover-3.jpg';

// Mock data for demonstration
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Elegance of Typography',
    author: 'Marcus Reed',
    isbn: '978-0-123456-78-9',
    genre: 'design',
    description: 'A comprehensive guide to the art and science of typography in modern design.',
    coverImage: bookCover1,
    status: 'owned',
    dateAdded: '2024-01-15',
    pdfFile: 'typography-guide.pdf'
  },
  {
    id: '2',
    title: 'Modern Architecture',
    author: 'Sarah Johnson',
    isbn: '978-0-987654-32-1',
    genre: 'architecture',
    description: 'Exploring contemporary architectural movements and their impact on urban design.',
    coverImage: bookCover2,
    status: 'lent',
    dateAdded: '2024-02-10',
    lendingInfo: {
      borrowerName: 'Alex Thompson',
      borrowerContact: 'alex@email.com',
      dateLent: '2024-03-01',
      expectedReturn: '2024-03-15'
    }
  },
  {
    id: '3',
    title: 'Digital Renaissance',
    author: 'Elena Martinez',
    isbn: '978-0-555666-77-8',
    genre: 'technology',
    description: 'How technology is reshaping art, culture, and human creativity in the 21st century.',
    coverImage: bookCover3,
    status: 'wishlist',
    dateAdded: '2024-03-05'
  }
];

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.isbn && book.isbn.includes(searchTerm));
    
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    const matchesGenre = filterGenre === 'all' || book.genre === filterGenre;
    
    return matchesSearch && matchesStatus && matchesGenre;
  });

  const addBook = (book: Omit<Book, 'id' | 'dateAdded'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const lendBook = (id: string, lendingInfo: Book['lendingInfo']) => {
    updateBook(id, { status: 'lent', lendingInfo });
  };

  const returnBook = (id: string) => {
    updateBook(id, { status: 'owned', lendingInfo: undefined });
  };

  return {
    books: filteredBooks,
    allBooks: books,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGenre,
    setFilterGenre,
    addBook,
    updateBook,
    deleteBook,
    lendBook,
    returnBook
  };
};