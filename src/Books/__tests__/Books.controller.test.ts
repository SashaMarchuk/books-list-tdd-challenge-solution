import { runInAction } from 'mobx';
import { createBooksStore, BooksStore, BooksRepository } from '../Books.controller';
import { Book } from '../types';

// Mock console methods
const originalConsole = {
  error: console.error,
  debug: console.debug
};

beforeAll(() => {
  // Mock console methods
  console.error = jest.fn();
  console.debug = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
});

// Sample book data for tests
const allBooksSample: Book[] = [
  { id: 1, name: 'Book 1', author: 'Author 1' },
  { id: 2, name: 'Book 2', author: 'Author 2' },
  { id: 3, name: 'Book 3', author: 'Author 3' },
  { id: 4, name: 'Book 4', author: 'Author 4' },
];

const privateBooksSample: Book[] = [
  { id: 1, name: 'Book 1', author: 'Author 1' },
  { id: 3, name: 'Book 3', author: 'Author 3' },
  { id: 5, name: 'Book 5', author: 'Author 5' },
  { id: 6, name: 'Book 6', author: 'Author 6' },
];

// Mock repository for tests
const createMockRepository = (): BooksRepository => ({
  getBooks: jest.fn().mockResolvedValue(allBooksSample),
  getPrivateBooks: jest.fn().mockResolvedValue(privateBooksSample),
  addBook: jest.fn().mockResolvedValue(true),
});

describe('Books Controller', () => {
  let store: BooksStore;
  let mockRepository: BooksRepository;

  beforeEach(() => {
    // Reset mocks and create fresh store for each test
    mockRepository = createMockRepository();
    store = createBooksStore(mockRepository);
    jest.clearAllMocks();
  });

  describe('loadBooks', () => {
    it('should load all books when viewType is "all"', async () => {
      // Set viewType to "all"
      runInAction(() => {
        store.viewType = 'all';
      });

      // Call the method to test
      await store.loadBooks();

      // Expectations
      expect(mockRepository.getBooks).toHaveBeenCalledTimes(1);
      expect(mockRepository.getPrivateBooks).not.toHaveBeenCalled();
      expect(store.books).toEqual(allBooksSample);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should load private books when viewType is "private"', async () => {
      // Set viewType to "private"
      runInAction(() => {
        store.viewType = 'private';
      });

      // Call the method to test
      await store.loadBooks();

      // Expectations
      expect(mockRepository.getPrivateBooks).toHaveBeenCalledTimes(1);
      expect(mockRepository.getBooks).not.toHaveBeenCalled();
      expect(store.books).toEqual(privateBooksSample);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      // Mock the repository to throw an error
      const error = new Error('Network Error');
      jest.spyOn(mockRepository, 'getBooks').mockRejectedValueOnce(error);

      // Call the method to test
      await store.loadBooks();

      // Expectations
      expect(store.error).toBe('Network Error');
      expect(store.isLoading).toBe(false);
      expect(store.books).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Failed to load books:', error);
    });

    it('should handle non-array API responses', async () => {
      // Mock the repository to return non-array
      jest.spyOn(mockRepository, 'getBooks').mockResolvedValueOnce(null as any);

      // Call the method to test
      await store.loadBooks();

      // Expectations
      expect(store.books).toEqual([]);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('loadPrivateBooksCount', () => {
    it('should load private books count based on API response length', async () => {
      // Setup mock to return a specific number of private books
      const mockPrivateBooks: Book[] = [
        { id: 1, name: 'Private Book 1', author: 'Author 1' }, 
        { id: 3, name: 'Private Book 3', author: 'Author 3' }
      ];
      jest.spyOn(mockRepository, 'getPrivateBooks').mockResolvedValueOnce(mockPrivateBooks);

      // Call the method to test
      await store.loadPrivateBooksCount();

      // Expectations
      expect(mockRepository.getPrivateBooks).toHaveBeenCalledTimes(1);
      // Count should be the length of the array returned by the API
      expect(store.privateBooksCount).toBe(mockPrivateBooks.length);
    });

    it('should handle API errors gracefully', async () => {
      // Mock the repository to throw an error
      const error = new Error('Failed to fetch count');
      jest.spyOn(mockRepository, 'getPrivateBooks').mockRejectedValueOnce(error);

      // Call the method to test
      await store.loadPrivateBooksCount();

      // Expectations
      expect(store.privateBooksCount).toBe(0);
      expect(console.error).toHaveBeenCalledWith('Failed to load private books count:', error);
    });

    it('should handle non-array API responses', async () => {
      // Mock the repository to return non-array
      jest.spyOn(mockRepository, 'getPrivateBooks').mockResolvedValueOnce(null as any);

      // Call the method to test
      await store.loadPrivateBooksCount();

      // Expectations
      expect(store.privateBooksCount).toBe(0);
    });
  });

  describe('addBook', () => {
    it('should add a book successfully', async () => {
      // Mock loadBooks and loadPrivateBooksCount to avoid testing them again
      jest.spyOn(store, 'loadBooks').mockResolvedValueOnce();
      jest.spyOn(store, 'loadPrivateBooksCount').mockResolvedValueOnce();

      // Call the method to test
      await store.addBook('New Book', 'New Author');

      // Expectations
      expect(mockRepository.addBook).toHaveBeenCalledWith({
        name: 'New Book',
        author: 'New Author'
      });
      expect(store.loadBooks).toHaveBeenCalledTimes(1);
      expect(store.loadPrivateBooksCount).toHaveBeenCalledTimes(1);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should validate book name and author', async () => {
      // Call with empty name
      await store.addBook('', 'Author');
      expect(mockRepository.addBook).not.toHaveBeenCalled();
      expect(store.error).toBe('Book name and author cannot be empty.');

      // Reset error
      runInAction(() => {
        store.error = null;
      });

      // Call with empty author
      await store.addBook('Name', '');
      expect(mockRepository.addBook).not.toHaveBeenCalled();
      expect(store.error).toBe('Book name and author cannot be empty.');
    });

    it('should handle API errors gracefully', async () => {
      // Mock the repository to throw an error
      const error = new Error('Failed to add');
      jest.spyOn(mockRepository, 'addBook').mockRejectedValueOnce(error);

      // Call the method to test
      await store.addBook('New Book', 'New Author');

      // Expectations
      expect(store.error).toBe('Failed to add');
      expect(store.isLoading).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to add book:', error);
    });

    it('should handle repository returning false', async () => {
      // Mock the repository to return false
      jest.spyOn(mockRepository, 'addBook').mockResolvedValueOnce(false);

      // Call the method to test
      await store.addBook('New Book', 'New Author');

      // Expectations
      expect(store.error).toContain('might not have been added');
      expect(store.isLoading).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('setViewType', () => {
    it('should change viewType and reload books', async () => {
      // Mock loadBooks to avoid testing it again
      jest.spyOn(store, 'loadBooks').mockResolvedValueOnce();
      jest.spyOn(store, 'loadPrivateBooksCount').mockResolvedValueOnce();

      // Call the method to test
      store.setViewType('private');

      // Expectations
      expect(store.viewType).toBe('private');
      expect(store.loadBooks).toHaveBeenCalledTimes(1);
      expect(store.loadPrivateBooksCount).toHaveBeenCalledTimes(1);
    });

    it('should not reload if viewType has not changed', async () => {
      // Set initial viewType
      runInAction(() => {
        store.viewType = 'all';
      });

      // Mock loadBooks to avoid testing it again
      jest.spyOn(store, 'loadBooks').mockResolvedValueOnce();
      jest.spyOn(store, 'loadPrivateBooksCount').mockResolvedValueOnce();

      // Call the method to test with same viewType
      store.setViewType('all');

      // Expectations
      expect(store.loadBooks).not.toHaveBeenCalled();
      expect(store.loadPrivateBooksCount).not.toHaveBeenCalled();
    });

    it('should ignore invalid viewType values', () => {
      // Initial viewType
      const initialViewType = store.viewType;

      // Call with invalid type
      store.setViewType('invalid' as any);

      // Should not change
      expect(store.viewType).toBe(initialViewType);
      expect(console.debug).toHaveBeenCalledWith('Invalid view type specified:', 'invalid');
    });
  });

  describe('init', () => {
    it('should call loadBooks and loadPrivateBooksCount', async () => {
      // Mock the methods to avoid testing them again
      jest.spyOn(store, 'loadBooks').mockResolvedValueOnce();
      jest.spyOn(store, 'loadPrivateBooksCount').mockResolvedValueOnce();

      // Call the method to test
      await store.init();

      // Expectations
      expect(store.loadBooks).toHaveBeenCalledTimes(1);
      expect(store.loadPrivateBooksCount).toHaveBeenCalledTimes(1);
    });
  });
}); 