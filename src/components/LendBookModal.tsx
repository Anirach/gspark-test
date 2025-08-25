import { useState } from 'react';
import { Book } from '@/types/book';
import { LendingData } from '@/services/bookService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, User, Mail, Calendar } from 'lucide-react';

interface LendBookModalProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onLend: (bookId: string, lendingInfo: LendingData) => void;
  isLoading?: boolean;
}

export const LendBookModal = ({ book, open, onClose, onLend, isLoading }: LendBookModalProps) => {
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerContact: '',
    expectedReturn: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !formData.borrowerName || !formData.borrowerContact || !formData.expectedReturn) return;

    const lendingInfo: LendingData = {
      borrowerName: formData.borrowerName,
      borrowerContact: formData.borrowerContact,
      dateLent: new Date().toISOString(),
      expectedReturn: new Date(formData.expectedReturn + 'T23:59:59.999Z').toISOString(),
      notes: formData.notes || undefined
    };

    onLend(book.id, lendingInfo);
  };

  const handleClose = () => {
    setFormData({
      borrowerName: '',
      borrowerContact: '',
      expectedReturn: '',
      notes: ''
    });
    onClose();
  };

  if (!book) return null;

  // Set default return date to 2 weeks from now
  const defaultReturnDate = new Date();
  defaultReturnDate.setDate(defaultReturnDate.getDate() + 14);
  const defaultReturnDateString = defaultReturnDate.toISOString().split('T')[0];

  // Build image URL for backend-served files
  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Lend Book
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-accent rounded-lg">
          <div className="flex gap-3">
            <div className="w-12 h-16 bg-primary/20 rounded flex-shrink-0">
              {book.coverImage ? (
                <img
                  src={getImageUrl(book.coverImage) || ''}
                  alt={book.title}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
              {!book.coverImage && (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded flex items-center justify-center">
                  <span className="text-xs text-primary font-bold">{book.title.slice(0, 2).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm">{book.title}</h3>
              <p className="text-xs text-muted-foreground">{book.author}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="borrowerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Borrower Name *
            </Label>
            <Input
              id="borrowerName"
              value={formData.borrowerName}
              onChange={(e) => setFormData(prev => ({ ...prev, borrowerName: e.target.value }))}
              placeholder="Who is borrowing this book?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrowerContact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information *
            </Label>
            <Input
              id="borrowerContact"
              value={formData.borrowerContact}
              onChange={(e) => setFormData(prev => ({ ...prev, borrowerContact: e.target.value }))}
              placeholder="Email or phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedReturn" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Expected Return Date *
            </Label>
            <Input
              id="expectedReturn"
              type="date"
              value={formData.expectedReturn || defaultReturnDateString}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedReturn: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this lending..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Lending...' : 'Lend Book'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};