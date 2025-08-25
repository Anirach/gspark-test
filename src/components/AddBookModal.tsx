import { useState, useRef, useEffect } from 'react';
import { Book, BookStatus } from '@/types/book';
import { CreateBookData } from '@/services/bookService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, FileText, Image } from 'lucide-react';

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (book: CreateBookData) => void;
  editBook?: Book | null;
  isLoading?: boolean;
}

export const AddBookModal = ({ open, onClose, onAdd, editBook, isLoading }: AddBookModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    status: 'OWNED' as BookStatus,
  });
  
  const [files, setFiles] = useState<{
    coverImage?: File;
    pdfFile?: File;
  }>({});

  const coverImageRef = useRef<HTMLInputElement>(null);
  const pdfFileRef = useRef<HTMLInputElement>(null);

  // Update form data when editBook changes
  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title || '',
        author: editBook.author || '',
        isbn: editBook.isbn || '',
        genre: editBook.genre || '',
        description: editBook.description || '',
        status: editBook.status || 'OWNED',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        description: '',
        status: 'OWNED',
      });
    }
    setFiles({});
  }, [editBook]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    const bookData: CreateBookData = {
      ...formData,
      ...(files.coverImage && { coverImage: files.coverImage }),
      ...(files.pdfFile && { pdfFile: files.pdfFile })
    };

    onAdd(bookData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      description: '',
      status: 'OWNED',
    });
    setFiles({});
    if (coverImageRef.current) coverImageRef.current.value = '';
    if (pdfFileRef.current) pdfFileRef.current.value = '';
    onClose();
  };

  const handleFileChange = (type: 'coverImage' | 'pdfFile') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const removeFile = (type: 'coverImage' | 'pdfFile') => {
    setFiles(prev => ({ ...prev, [type]: undefined }));
    if (type === 'coverImage' && coverImageRef.current) {
      coverImageRef.current.value = '';
    }
    if (type === 'pdfFile' && pdfFileRef.current) {
      pdfFileRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editBook ? 'Edit Book' : 'Add New Book'}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as BookStatus }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNED">Owned</SelectItem>
                <SelectItem value="WISHLIST">Wishlist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverImageRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  Choose Image
                </Button>
                <input
                  ref={coverImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange('coverImage')}
                  className="hidden"
                />
              </div>
              
              {files.coverImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                  <Image className="h-4 w-4" />
                  <span className="flex-1 truncate">{files.coverImage.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('coverImage')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {editBook?.coverImage && !files.coverImage && (
                <div className="text-sm text-muted-foreground">
                  Current: {editBook.coverImage}
                </div>
              )}
            </div>
          </div>

          {/* PDF File Upload */}
          <div className="space-y-2">
            <Label>PDF File</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => pdfFileRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Choose PDF
                </Button>
                <input
                  ref={pdfFileRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange('pdfFile')}
                  className="hidden"
                />
              </div>
              
              {files.pdfFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                  <FileText className="h-4 w-4" />
                  <span className="flex-1 truncate">{files.pdfFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('pdfFile')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {editBook?.pdfFile && !files.pdfFile && (
                <div className="text-sm text-muted-foreground">
                  Current: {editBook.pdfFile}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the book..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : editBook ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};