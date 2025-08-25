export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  description?: string;
  coverImage?: string;
  pdfFile?: string;
  status: 'OWNED' | 'LENT' | 'WISHLIST';
  dateAdded: string;
  createdAt: string;
  updatedAt: string;
  lendingInfo?: LendingInfo;
}

export interface LendingInfo {
  id: string;
  borrowerName: string;
  borrowerContact: string;
  dateLent: string;
  expectedReturn: string;
  actualReturn?: string;
  notes?: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
}

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