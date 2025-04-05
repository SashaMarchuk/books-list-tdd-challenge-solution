/**
 * User identifier for accessing the books API.
 * Replace with your actual identifier if different.
 * @type {string}
 */
export const USER_ID: string = "test-test-test";

/**
 * The base URL for the Reaktivate Books API, constructed with the user identifier.
 * @type {string}
 */
export const API_URL_BASE: string = `https://tdd.demo.reaktivate.com/v1/books/${USER_ID}`; 