import { useBooks as useAPIBooks } from './useAPI';

// Re-export the API-based hook for backward compatibility
export const useBooks = useAPIBooks;