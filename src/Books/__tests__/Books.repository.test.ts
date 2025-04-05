import * as booksRepository from '../Books.repository';
import { get, post } from '../../Shared/ApiGateway';
import { Book, BookAddResponse } from '../types';

// Mock the ApiGateway functions
jest.mock('../../Shared/ApiGateway', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('Books Repository', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBooks', () => {
    it('should fetch all books from API', async () => {
      // Sample data
      const mockBooksData: Book[] = [
        { id: 1, name: 'Test Book 1', author: 'Author 1' },
        { id: 2, name: 'Test Book 2', author: 'Author 2' },
      ];

      // Setup mock
      (get as jest.Mock).mockResolvedValueOnce(mockBooksData);

      // Call the method
      const result = await booksRepository.getBooks();

      // Assertions
      expect(get).toHaveBeenCalledWith('/');
      expect(result).toEqual(mockBooksData);
    });

    it('should handle empty API response', async () => {
      // Setup mock for null response
      (get as jest.Mock).mockResolvedValueOnce(null);

      // Call the method
      const result = await booksRepository.getBooks();

      // Assertions
      expect(result).toEqual([]);
    });

    it('should handle non-array API response', async () => {
      // Setup mock for non-array response
      (get as jest.Mock).mockResolvedValueOnce({});

      // Call the method
      const result = await booksRepository.getBooks();

      // Assertions
      expect(result).toEqual([]);
    });
  });

  describe('getPrivateBooks', () => {
    it('should fetch private books from API', async () => {
      // Sample data
      const mockPrivateBooksData: Book[] = [
        { id: 1, name: 'Private Book 1', author: 'Author 1'},
      ];

      // Setup mock
      (get as jest.Mock).mockResolvedValueOnce(mockPrivateBooksData);

      // Call the method
      const result = await booksRepository.getPrivateBooks();

      // Assertions
      expect(get).toHaveBeenCalledWith('/private');
      expect(result).toEqual(mockPrivateBooksData);
    });

    it('should handle empty API response', async () => {
      // Setup mock for null response
      (get as jest.Mock).mockResolvedValueOnce(null);

      // Call the method
      const result = await booksRepository.getPrivateBooks();

      // Assertions
      expect(result).toEqual([]);
    });
  });

  describe('addBook', () => {
    it('should send book data with generated ID to API and return success', async () => {
      // Sample data
      const bookData = { name: 'New Book', author: 'New Author' };
      const mockResponse: BookAddResponse = { status: 'ok', id: 123 };

      // Setup mock
      (post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await booksRepository.addBook(bookData);

      // Assertions
      expect(post).toHaveBeenCalled();
      
      // Verify that an ID was added to the payload
      const postCall = (post as jest.Mock).mock.calls[0];
      const sentPayload = postCall[1];
      expect(sentPayload).toHaveProperty('id');
      expect(typeof sentPayload.id).toBe('number');
      expect(sentPayload.name).toBe(bookData.name);
      expect(sentPayload.author).toBe(bookData.author);
      
      expect(result).toBe(true);
    });

    it('should return false when API returns non-ok status', async () => {
      // Sample data
      const bookData = { name: 'New Book', author: 'New Author' };
      const mockResponse: BookAddResponse = { status: 'error' };

      // Setup mock
      (post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await booksRepository.addBook(bookData);

      // Assertions
      // Verify that an ID was still added despite the error
      const postCall = (post as jest.Mock).mock.calls[0];
      const sentPayload = postCall[1];
      expect(sentPayload).toHaveProperty('id');
      
      expect(result).toBe(false);
    });

    it('should return false when API returns null', async () => {
      // Sample data
      const bookData = { name: 'New Book', author: 'New Author' };

      // Setup mock
      (post as jest.Mock).mockResolvedValueOnce(null);

      // Call the method
      const result = await booksRepository.addBook(bookData);

      // Assertions
      // Verify that an ID was still added
      const postCall = (post as jest.Mock).mock.calls[0];
      const sentPayload = postCall[1];
      expect(sentPayload).toHaveProperty('id');
      
      expect(result).toBe(false);
    });
    
    it('should generate different IDs for different books', async () => {
      // Sample data for two books
      const bookData1 = { name: 'Book 1', author: 'Author 1' };
      const bookData2 = { name: 'Book 2', author: 'Author 2' };
      
      // Setup mocks
      (post as jest.Mock).mockResolvedValueOnce({ status: 'ok' });
      (post as jest.Mock).mockResolvedValueOnce({ status: 'ok' });
      
      // Call the method twice
      await booksRepository.addBook(bookData1);
      await booksRepository.addBook(bookData2);
      
      // Get the payloads that were sent
      const firstPayload = (post as jest.Mock).mock.calls[0][1];
      const secondPayload = (post as jest.Mock).mock.calls[1][1];
      
      // Verify that different IDs were generated
      expect(firstPayload.id).not.toBe(secondPayload.id);
    });
  });
}); 