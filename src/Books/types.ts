/**
 * Represents a book entity in the application.
 */
export interface Book {
  id?: number;
  name: string;
  author: string;
}

/**
 * Response from the API when adding a new book.
 */
export interface BookAddResponse {
  status: string;
  id?: number;
} 