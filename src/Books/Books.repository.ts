import { get, post } from "../Shared/ApiGateway";
import { Book, BookAddResponse } from "./types";

/**
 * Fetches the list of all books.
 * @returns {Promise<Array<Book>>} A promise that resolves with an array of book objects.
 * Returns an empty array if the response is not a valid array.
 */
export const getBooks = async (): Promise<Book[]> => {
  const booksDto = await get<Book[]>("/");
  console.log("booksDto", booksDto);
  
  return Array.isArray(booksDto) ? booksDto : [];
};

/**
 * Fetches the list of private books.
 * @returns {Promise<Array<Book>>} A promise that resolves with an array of private book objects.
 * Returns an empty array if the response is not a valid array.
 */
export const getPrivateBooks = async (): Promise<Book[]> => {
  try {
    const booksDto = await get<Book[]>("/private");
    
    return Array.isArray(booksDto) ? booksDto : [];
  } catch (error) {
    console.error("Error fetching private books:", error);
    return [];
  }
};

/**
 * Interface for book data required to add a new book
 */
export interface AddBookData {
  name: string;
  author: string;
}

/**
 * Generates a unique ID for a new book.
 * @returns {number} A unique ID.
 * @private - For internal use only, not part of the public API.
 */
const generateUniqueId = (): number => {
  
  return Math.floor(Date.now() + Math.random() * 1000);
};

/**
 * Adds a new book via the API.
 * @param {AddBookData} bookData - The book data.
 * @param {string} bookData.name - The name of the book.
 * @param {string} bookData.author - The author of the book.
 * @returns {Promise<boolean>} A promise that resolves with true if the book was added successfully (API returns {status: "ok"}), false otherwise.
 */
export const addBook = async ({ name, author }: AddBookData): Promise<boolean> => {
  
  const id = generateUniqueId();
  
  const bookAddDto = await post<BookAddResponse>("/", {
     id, 
     name, 
     author
  });
  
  
  return bookAddDto && bookAddDto.status === "ok" ? true : false;
};