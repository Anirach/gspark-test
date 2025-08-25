import { Book } from '@/types/book';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onLend: (book: Book) => void;
  onReturn: (book: Book) => void;
  onDelete: (book: Book) => void;
  isDeleting?: boolean;
}

export const BookCard = ({ book, onView, onEdit, onLend, onReturn, onDelete, isDeleting }: BookCardProps) => {
  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'OWNED': return 'bg-green-100 text-green-800';
      case 'LENT': return 'bg-yellow-100 text-yellow-800';
      case 'WISHLIST': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: Book['status']) => {
    switch (status) {
      case 'OWNED': return 'Owned';
      case 'LENT': return 'Lent';
      case 'WISHLIST': return 'Wishlist';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Build image URL for backend-served files
  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Use the same API base URL from environment
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const backendBaseUrl = apiBaseUrl.replace('/api', '');
    return `${backendBaseUrl}${path}`;
  };

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-book hover:-translate-y-1",
      "bg-gradient-to-b from-card to-card/90",
      isDeleting && "opacity-50 pointer-events-none"
    )} onClick={() => onView(book)}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Book Cover */}
          <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
            {book.coverImage ? (
              <img
                src={getImageUrl(book.coverImage) || ''}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : null}
            
            {/* Fallback placeholder when no image or image fails */}
            {!book.coverImage || true && (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="font-bold text-primary text-sm mb-1 line-clamp-3">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{book.author}</p>
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <Badge 
              className={cn(
                "absolute top-2 right-2 text-xs",
                getStatusColor(book.status)
              )}
            >
              {getStatusDisplay(book.status)}
            </Badge>

            {/* PDF Indicator */}
            {book.pdfFile && (
              <div className="absolute top-2 left-2 bg-leather text-leather-foreground p-1 rounded">
                <FileText className="w-3 h-3" />
              </div>
            )}

            {/* Delete Button - Top left corner, shown on hover */}
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-12 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book);
              }}
              disabled={isDeleting}
              title="Delete book"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Book Info */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
            
            {book.genre && (
              <Badge variant="secondary" className="text-xs mb-3">
                {book.genre.replace('_', ' ').toLowerCase()}
              </Badge>
            )}

            {/* Lending Info */}
            {book.status === 'LENT' && book.lendingInfo && (
              <div className="mb-3 p-2 bg-accent rounded-md">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <User className="w-3 h-3" />
                  <span>{book.lendingInfo.borrowerName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Due: {formatDate(book.lendingInfo.expectedReturn)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs"
                onClick={() => onEdit(book)}
              >
                Edit
              </Button>
              
              {book.status === 'OWNED' && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="text-xs"
                  onClick={() => onLend(book)}
                >
                  Lend
                </Button>
              )}
              
              {book.status === 'LENT' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-yellow-50 hover:bg-yellow-100"
                  onClick={() => onReturn(book)}
                >
                  Return
                </Button>
              )}

              {book.status === 'WISHLIST' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs bg-blue-50 hover:bg-blue-100"
                  onClick={() => onEdit(book)}
                >
                  Edit
                </Button>
              )}

              {book.pdfFile && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs col-span-1"
                  onClick={() => window.open(getImageUrl(book.pdfFile) || '', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  PDF
                </Button>
              )}

              {/* Delete Button - Always visible in bottom row */}
              <Button 
                size="sm" 
                variant="destructive"
                className="text-xs"
                onClick={() => onDelete(book)}
                disabled={isDeleting}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};