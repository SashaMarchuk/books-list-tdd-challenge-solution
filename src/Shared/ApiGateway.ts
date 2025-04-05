import { API_URL_BASE } from "./config";

/**
 * Performs a GET request to the specified API path.
 * @param {string} path - The API endpoint path (appended to API_URL_BASE).
 * @returns {Promise<any>} A promise that resolves with the parsed JSON response.
 * @throws {Error} Throws an error if the network response is not OK, containing status and error details.
 */
export const get = async <T>(path: string): Promise<T> => {
  const url = `${API_URL_BASE}${path}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || `HTTP error ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error ${response.status}: ${response.statusText || errorText || 'Unknown error'}`;
      }
      throw new Error(errorMessage);
    }
    
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    return result;
  } catch (error) {
    console.error("API Gateway error:", error);
    throw error;
  }
};

/**
 * Performs a POST request to the specified API path.
 * @param {string} path - The API endpoint path (appended to API_URL_BASE).
 * @param {object} payload - The data to send in the request body (will be JSON.stringify'd).
 * @returns {Promise<any>} A promise that resolves with the parsed JSON response.
 * @throws {Error} Throws an error if the network response is not OK, containing status and error details.
 */
export const post = async <T, P = Record<string, unknown>>(path: string, payload: P): Promise<T> => {
  const response = await fetch(`${API_URL_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage: string;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || `HTTP error ${response.status}`;
    } catch (e) {
      errorMessage = `HTTP error ${response.status}: ${response.statusText || errorText || 'Unknown error'}`;
    }
    throw new Error(errorMessage);
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}; 