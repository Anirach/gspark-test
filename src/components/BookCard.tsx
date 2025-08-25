import { Book } from '@/types/book';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onLend: (book: Book) => void;
  onReturn: (book: Book) => void;
}

export const BookCard = ({ book, onView, onEdit, onLend, onReturn }: BookCardProps) => {
  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'owned': return 'bg-green-100 text-green-800';
      case 'lent': return 'bg-yellow-100 text-yellow-800';
      case 'wishlist': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-book hover:-translate-y-1",
      "bg-gradient-to-b from-card to-card/90"
    )} onClick={() => onView(book)}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Book Cover */}
          <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="font-bold text-primary text-sm mb-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
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
              {book.status}
            </Badge>

            {/* PDF Indicator */}
            {book.pdfFile && (
              <div className="absolute top-2 left-2 bg-leather text-leather-foreground p-1 rounded">
                <FileText className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
            
            {book.genre && (
              <Badge variant="secondary" className="text-xs mb-3">
                {book.genre}
              </Badge>
            )}

            {/* Lending Info */}
            {book.status === 'lent' && book.lendingInfo && (
              <div className="mb-3 p-2 bg-accent rounded-md">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <User className="w-3 h-3" />
                  <span>{book.lendingInfo.borrowerName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Due: {book.lendingInfo.expectedReturn}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onEdit(book)}
              >
                Edit
              </Button>
              
              {book.status === 'owned' && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={() => onLend(book)}
                >
                  Lend
                </Button>
              )}
              
              {book.status === 'lent' && (
                <Button 
                  size="sm" 
                  variant="leather"
                  className="flex-1 text-xs"
                  onClick={() => onReturn(book)}
                >
                  Return
                </Button>
              )}

              {book.pdfFile && (
                <Button 
                  size="sm" 
                  variant="gold"
                  className="px-2"
                  onClick={() => window.open(`/pdfs/${book.pdfFile}`, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};