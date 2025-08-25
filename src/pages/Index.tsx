import { useState } from 'react';
import { Book } from '@/types/book';
import { CreateBookData, LendingData } from '@/services/bookService';
import { useBooks } from '@/hooks/useBooks';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { BookCard } from '@/components/BookCard';
import { AddBookModal } from '@/components/AddBookModal';
import { BookDetailModal } from '@/components/BookDetailModal';
import { LendBookModal } from '@/components/LendBookModal';
import { BookOpen, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const {
    books,
    stats,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isLending,
    isReturning,
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
    returnBook,
    refetch
  } = useBooks();

  const { toast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [lendModalOpen, setLendModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setDetailModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setAddModalOpen(true);
    setDetailModalOpen(false);
  };

  const handleDeleteBook = async (book: Book) => {
    try {
      await deleteBook(book.id);
      setDetailModalOpen(false);
      toast({
        title: "Book deleted",
        description: `"${book.title}" has been removed from your library.`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLendBook = (book: Book) => {
    setSelectedBook(book);
    setLendModalOpen(true);
    setDetailModalOpen(false);
  };

  const handleReturnBook = async (book: Book) => {
    try {
      await returnBook(book.id);
      toast({
        title: "Book returned",
        description: `"${book.title}" has been marked as returned.`,
      });
    } catch (error) {
      console.error('Return error:', error);
      toast({
        title: "Error",
        description: "Failed to return book. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddBook = async (bookData: CreateBookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        toast({
          title: "Book updated",
          description: `"${bookData.title}" has been updated successfully.`,
        });
      } else {
        await addBook(bookData);
        toast({
          title: "Book added",
          description: `"${bookData.title}" has been added to your library.`,
        });
      }
      setEditingBook(null);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Add/Update error:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingBook ? 'update' : 'add'} book. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleLendBookConfirm = async (bookId: string, lendingData: LendingData) => {
    try {
      await lendBook(bookId, lendingData);
      setLendModalOpen(false);
      setSelectedBook(null);
      toast({
        title: "Book lent",
        description: `Book has been lent to ${lendingData.borrowerName}.`,
      });
    } catch (error) {
      console.error('Lend error:', error);
      toast({
        title: "Error",
        description: "Failed to lend book. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-paper to-accent/30">
        <Header 
          onAddBook={() => setAddModalOpen(true)}
          totalBooks={0}
          lentBooks={0}
        />
        <main className="container mx-auto px-6 py-8">
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load library data. Please check if the backend server is running.
              <button 
                onClick={() => refetch()}
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const totalBooks = stats?.totalBooks || 0;
  const lentBooks = stats?.lentBooks || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-paper to-accent/30">
      <Header 
        onAddBook={() => setAddModalOpen(true)}
        totalBooks={totalBooks}
        lentBooks={lentBooks}
      />

      <main className="container mx-auto px-6 py-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={(status) => setFilterStatus(status as any)}
          filterGenre={filterGenre}
          onGenreChange={setFilterGenre}
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your library...</span>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm || filterStatus !== 'all' || filterGenre !== 'all' 
                  ? 'No books found' 
                  : 'Your library is empty'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterStatus !== 'all' || filterGenre !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first book to get started'
                }
              </p>
              {(!searchTerm && filterStatus === 'all' && filterGenre === 'all') && (
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Add Your First Book
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onView={handleViewBook}
                  onEdit={handleEditBook}
                  onLend={handleLendBook}
                  onReturn={handleReturnBook}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddBookModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingBook(null);
        }}
        onAdd={handleAddBook}
        editBook={editingBook}
        isLoading={isCreating || isUpdating}
      />

      <BookDetailModal
        book={selectedBook}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedBook(null);
        }}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        onLend={handleLendBook}
        onReturn={handleReturnBook}
        isDeleting={isDeleting}
        isReturning={isReturning}
      />

      <LendBookModal
        book={selectedBook}
        open={lendModalOpen}
        onClose={() => {
          setLendModalOpen(false);
          setSelectedBook(null);
        }}
        onLend={handleLendBookConfirm}
        isLoading={isLending}
      />
    </div>
  );
};

export default Index;