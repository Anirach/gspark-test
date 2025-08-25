import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterGenre: string;
  onGenreChange: (value: string) => void;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterGenre,
  onGenreChange
}: SearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-card to-accent rounded-lg shadow-subtle">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/80 backdrop-blur-sm"
        />
      </div>
      
      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-32 bg-background/80 backdrop-blur-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OWNED">Owned</SelectItem>
              <SelectItem value="LENT">Lent</SelectItem>
              <SelectItem value="WISHLIST">Wishlist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={filterGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-32 bg-background/80 backdrop-blur-sm">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="FICTION">Fiction</SelectItem>
            <SelectItem value="NON_FICTION">Non-Fiction</SelectItem>
            <SelectItem value="SCIENCE">Science</SelectItem>
            <SelectItem value="HISTORY">History</SelectItem>
            <SelectItem value="BIOGRAPHY">Biography</SelectItem>
            <SelectItem value="FANTASY">Fantasy</SelectItem>
            <SelectItem value="MYSTERY">Mystery</SelectItem>
            <SelectItem value="ROMANCE">Romance</SelectItem>
            <SelectItem value="DESIGN">Design</SelectItem>
            <SelectItem value="ARCHITECTURE">Architecture</SelectItem>
            <SelectItem value="TECHNOLOGY">Technology</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
            <SelectItem value="SELF_HELP">Self Help</SelectItem>
            <SelectItem value="TRAVEL">Travel</SelectItem>
            <SelectItem value="COOKING">Cooking</SelectItem>
            <SelectItem value="ART">Art</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};