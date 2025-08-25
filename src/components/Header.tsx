import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Library } from 'lucide-react';

interface HeaderProps {
  onAddBook: () => void;
  totalBooks: number;
  lentBooks: number;
}

export const Header = ({ onAddBook, totalBooks, lentBooks }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-book">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/10 rounded-lg">
              <Library className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Library</h1>
              <p className="text-primary-foreground/80 mt-1">
                Your personal book collection manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold">{totalBooks}</div>
              <div className="text-sm text-primary-foreground/80">Total Books</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold">{lentBooks}</div>
              <div className="text-sm text-primary-foreground/80">Currently Lent</div>
            </div>
            <Button 
              onClick={onAddBook} 
              variant="secondary"
              size="lg"
              className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};