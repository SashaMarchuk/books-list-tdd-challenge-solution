import React, { useState, ChangeEvent } from "react";
import { observer } from "mobx-react";
import { booksStore } from "./Books.controller";
import { Book } from "./types";

interface StylesType {
  error: React.CSSProperties;
  loading: React.CSSProperties;
  inputGroup: React.CSSProperties;
  button: React.CSSProperties;
  viewButtons: React.CSSProperties;
  activeButton: React.CSSProperties;
}

const styles: StylesType = {
  error: {
    color: "red",
    marginTop: "10px",
  },
  loading: {
    marginTop: "10px",
  },
  inputGroup: {
    margin: "10px 0",
  },
  button: {
    marginLeft: "5px",
  },
  viewButtons: {
      marginBottom: '15px',
  },
  activeButton: {
      fontWeight: 'bold',
      textDecoration: 'underline'
  }
};

/**
 * View component for displaying the list of books and adding new books.
 * Observes the `booksStore` for state changes and renders the UI accordingly.
 * Contains local state only for the add book form inputs.
 * @component
 */
const BooksView: React.FC = () => {
  /** Local state for the new book name input */
  const [newBookName, setNewBookName] = useState<string>("");
  /** Local state for the new book author input */
  const [newBookAuthor, setNewBookAuthor] = useState<string>("");

  /**
   * Handles the click event for the Add Book button.
   * Calls the controller's addBook method and clears the input fields.
   */
  const handleAddBook = (): void => {
    booksStore.addBook(newBookName, newBookAuthor);
    setNewBookName("");
    setNewBookAuthor("");
  };

  /**
   * Handles input change for the book name field
   */
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewBookName(e.target.value);
  };

  /**
   * Handles input change for the book author field
   */
  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewBookAuthor(e.target.value);
  };

  return (
    <div>
      <h2>Books</h2>

      <div style={styles.viewButtons}>
        <button 
          onClick={() => booksStore.setViewType("all")}
          style={booksStore.viewType === 'all' ? styles.activeButton : {}}
        >
          All Books
        </button>
        <button 
          onClick={() => booksStore.setViewType("private")}
          style={booksStore.viewType === 'private' ? styles.activeButton : {}}
        >
          Private Books
        </button>
      </div>

      {booksStore.isLoading && <div style={styles.loading}>Loading books...</div>}
      {booksStore.error && <div style={styles.error}>Error: {booksStore.error}</div>}
      {!booksStore.isLoading && !booksStore.error && (
        <>
          {booksStore.books.length === 0 ? (
            <div>No books found.</div>
          ) : (
            booksStore.books.map((book: Book, i: number) => (
              <div key={book.id || i}>
                {book.author}: {book.name}
              </div>
            ))
          )}
        </>
      )}

      <h3>Add New Book</h3>
      <div style={styles.inputGroup}>
        <label>Name: </label>
        <input
          type="text"
          value={newBookName}
          onChange={handleNameChange}
        />
      </div>
      <div style={styles.inputGroup}>
        <label>Author: </label>
        <input
          type="text"
          value={newBookAuthor}
          onChange={handleAuthorChange}
        />
      </div>
      <button onClick={handleAddBook} disabled={booksStore.isLoading} style={styles.button}>
        Add Book
      </button>
    </div>
  );
};

export default observer(BooksView);