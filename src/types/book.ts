export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  description?: string;
  coverImage?: string;
  pdfFile?: string;
  status: 'owned' | 'lent' | 'wishlist';
  dateAdded: string;
  lendingInfo?: LendingInfo;
}

export interface LendingInfo {
  borrowerName: string;
  borrowerContact: string;
  dateLent: string;
  expectedReturn: string;
}

export type BookStatus = 'owned' | 'lent' | 'wishlist';
export type BookGenre = 'fiction' | 'non-fiction' | 'science' | 'history' | 'biography' | 'fantasy' | 'mystery' | 'romance' | 'other';