import { makeAutoObservable, runInAction } from "mobx";
import * as booksRepository from "./Books.repository";
import { Book } from "./types";

/**
 * Interface defining the structure of the Books store
 */
export interface BooksStore {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  viewType: 'all' | 'private';
  privateBooksCount: number;
  loadBooks: () => Promise<void>;
  loadPrivateBooksCount: () => Promise<void>;
  addBook: (name: string, author: string) => Promise<void>;
  setViewType: (type: 'all' | 'private') => void;
  init: () => Promise<void>;
}

/**
 * Interface for the repository dependency
 */
export interface BooksRepository {
  getBooks: () => Promise<Book[]>;
  getPrivateBooks: () => Promise<Book[]>;
  addBook: (bookData: { name: string; author: string }) => Promise<boolean>;
}

/**
 * Creates a MobX store for managing the state and logic for the Books feature.
 * Follows the MVP/MVVM pattern, separating logic from the view.
 *
 * @param {BooksRepository} repository - The repository object containing data fetching functions.
 * @returns {BooksStore} An observable MobX store instance.
 */
export function createBooksStore(repository: BooksRepository): BooksStore {
  const store = makeAutoObservable({
    books: [] as Book[],
    isLoading: false,
    error: null as string | null,
    viewType: "all" as 'all' | 'private', // 'all' or 'private'
    privateBooksCount: 0,

    /**
     * Loads books from the repository based on the current `viewType`.
     * Updates `books`, `isLoading`, and `error` state.
     */
    async loadBooks() {
      store.isLoading = true;
      store.error = null;
      try {
        let loadedBooks: Book[] = [];
        if (store.viewType === "all") {
          loadedBooks = await repository.getBooks();
        } else if (store.viewType === "private") {
          loadedBooks = await repository.getPrivateBooks();
        }
        runInAction(() => {
          store.books = Array.isArray(loadedBooks) ? loadedBooks : [];
        });
      } catch (err) {
        console.error("Failed to load books:", err);
        runInAction(() => {
          store.error = err instanceof Error ? err.message : "Failed to load books";
          store.books = [];
        });
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    /**
     * Specifically loads the count of private books for the header display.
     * Updates `privateBooksCount` and handles potential errors separately.
     */
    async loadPrivateBooksCount() {
        try {
            const privateBooksFromApi = await repository.getPrivateBooks();
            
            const booksArray = Array.isArray(privateBooksFromApi) ? privateBooksFromApi : [];
            
            runInAction(() => {
                store.privateBooksCount = booksArray.length;
            });
        } catch (err) {
            console.error("Failed to load private books count:", err);
            runInAction(() => {
                store.privateBooksCount = 0;
            });
        }
    },

    /**
     * Adds a new book using the repository.
     * Performs basic validation, updates loading/error state, and reloads data on success.
     * @param {string} name - The name of the book.
     * @param {string} author - The author of the book.
     */
    async addBook(name: string, author: string) {
      if (!name || !author) {
          runInAction(() => {
              store.error = "Book name and author cannot be empty.";
          });
          return;
      }

      store.isLoading = true;
      store.error = null;
      try {
        const success = await repository.addBook({ name, author });
        if (success) {
          await store.loadBooks(); 
          await store.loadPrivateBooksCount();
        } else {
            throw new Error("Repository returned false, book might not have been added.");
        }
      } catch (err) {
        console.error("Failed to add book:", err);
        runInAction(() => {
          store.error = err instanceof Error ? err.message : "Failed to add book";
        });
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    /**
     * Sets the view type ('all' or 'private') and triggers reloading of books.
     * @param {'all'|'private'} type - The desired view type.
     */
    setViewType(type: 'all' | 'private') {
      if (type === "all" || type === "private") {
        if (store.viewType !== type) {
             store.viewType = type;
             store.loadBooks();
             store.loadPrivateBooksCount();
        }
      } else {
        console.debug("Invalid view type specified:", type);
      }
    },

    /**
     * Initializes the store by loading initial data.
     */
     async init() {
        await store.loadBooks();
        await store.loadPrivateBooksCount();
     }
  });

  return store;
}

/**
 * Singleton instance of the Books store used throughout the application.
 * Initialized with the actual repository functions.
 */
export const booksStore = createBooksStore(booksRepository);

booksStore.init();