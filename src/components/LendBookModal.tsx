import { useState } from 'react';
import { Book, LendingInfo } from '@/types/book';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, Mail, Calendar } from 'lucide-react';

interface LendBookModalProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onLend: (bookId: string, lendingInfo: LendingInfo) => void;
}

export const LendBookModal = ({ book, open, onClose, onLend }: LendBookModalProps) => {
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerContact: '',
    expectedReturn: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !formData.borrowerName || !formData.borrowerContact || !formData.expectedReturn) return;

    const lendingInfo: LendingInfo = {
      borrowerName: formData.borrowerName,
      borrowerContact: formData.borrowerContact,
      dateLent: new Date().toISOString().split('T')[0],
      expectedReturn: formData.expectedReturn
    };

    onLend(book.id, lendingInfo);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      borrowerName: '',
      borrowerContact: '',
      expectedReturn: ''
    });
    onClose();
  };

  if (!book) return null;

  // Set default return date to 2 weeks from now
  const defaultReturnDate = new Date();
  defaultReturnDate.setDate(defaultReturnDate.getDate() + 14);
  const defaultReturnDateString = defaultReturnDate.toISOString().split('T')[0];

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
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded" />
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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="leather" className="flex-1">
              Lend Book
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};