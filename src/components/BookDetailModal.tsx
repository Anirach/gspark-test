import { Book } from '@/types/book';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, FileText, User, Calendar, ExternalLink, Edit, Trash2 } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onLend: (book: Book) => void;
  onReturn: (book: Book) => void;
}

export const BookDetailModal = ({ 
  book, 
  open, 
  onClose, 
  onEdit, 
  onDelete, 
  onLend, 
  onReturn 
}: BookDetailModalProps) => {
  if (!book) return null;

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'owned': return 'bg-green-100 text-green-800';
      case 'lent': return 'bg-yellow-100 text-yellow-800';
      case 'wishlist': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Book Details
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-book">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="font-bold text-primary text-lg mb-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={() => onEdit(book)}
                className="w-full"
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Book
              </Button>

              {book.status === 'owned' && (
                <Button 
                  onClick={() => onLend(book)}
                  className="w-full"
                  variant="secondary"
                >
                  <User className="w-4 h-4 mr-2" />
                  Lend Book
                </Button>
              )}

              {book.status === 'lent' && (
                <Button 
                  onClick={() => onReturn(book)}
                  className="w-full"
                  variant="leather"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Mark Returned
                </Button>
              )}

              {book.pdfFile && (
                <Button 
                  onClick={() => window.open(`/pdfs/${book.pdfFile}`, '_blank')}
                  className="w-full"
                  variant="gold"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View PDF
                </Button>
              )}

              <Button 
                onClick={() => onDelete(book)}
                className="w-full"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Book
              </Button>
            </div>
          </div>

          {/* Book Information */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{book.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getStatusColor(book.status)}>
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </Badge>
                {book.genre && (
                  <Badge variant="secondary">
                    {book.genre}
                  </Badge>
                )}
                {book.pdfFile && (
                  <Badge variant="outline" className="bg-leather/10 text-leather border-leather">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF Available
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Book Details */}
            <div className="space-y-3">
              {book.isbn && (
                <div>
                  <span className="font-medium text-foreground">ISBN: </span>
                  <span className="text-muted-foreground">{book.isbn}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-foreground">Date Added: </span>
                <span className="text-muted-foreground">
                  {new Date(book.dateAdded).toLocaleDateString()}
                </span>
              </div>

              {book.description && (
                <div>
                  <span className="font-medium text-foreground block mb-2">Description:</span>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </div>
              )}
            </div>

            {/* Lending Information */}
            {book.status === 'lent' && book.lendingInfo && (
              <>
                <Separator />
                <div className="bg-accent p-4 rounded-lg">
                  <h3 className="font-medium text-foreground mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Lending Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Borrower: </span>
                      <span>{book.lendingInfo.borrowerName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Contact: </span>
                      <span>{book.lendingInfo.borrowerContact}</span>
                    </div>
                    <div>
                      <span className="font-medium">Date Lent: </span>
                      <span>{new Date(book.lendingInfo.dateLent).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Expected Return: </span>
                      <span className="text-yellow-700">
                        {new Date(book.lendingInfo.expectedReturn).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};