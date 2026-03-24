/**
 * @file api.js
 * @description API client for communicating with the claude-java-demo backend REST API.
 * @author Joe Sicree (test@test.com)
 * @since 2026-03-23
 */

const BASE = '/api';

/**
 * Sends an HTTP request to the backend API and returns the parsed JSON response.
 * All requests are prefixed with {@code /api}; the proxy (Vite in dev, nginx in Docker)
 * routes them to the configured backend URL.
 *
 * @param {string} path - The API path relative to /api (e.g. '/products').
 * @param {RequestInit} [options={}] - Fetch options (method, body, headers, etc.).
 * @returns {Promise<Object|null>} Parsed JSON body, or null for 204 No Content responses.
 * @throws {Error} When the response status is not OK; message is taken from the API error body.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Fetches all products from the API.
 *
 * @returns {Promise<Array<{id: string, name: string, price: number}>>} Array of product objects.
 */
export const getProducts = () => request('/products');

/**
 * Creates a new product.
 *
 * @param {string} name - The product name.
 * @param {string|number} price - The product price; converted to a float before sending.
 * @returns {Promise<{id: string, name: string, price: number}>} The created product.
 */
export const createProduct = (name, price) =>
  request('/products', { method: 'POST', body: JSON.stringify({ name, price: parseFloat(price) }) });

/**
 * Deletes a product by its UUID.
 *
 * @param {string} id - The UUID of the product to delete.
 * @returns {Promise<null>} Resolves to null on success (204 No Content).
 */
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });

/**
 * Fetches all customers from the API.
 *
 * @returns {Promise<Array<{id: string, name: string, email: string}>>} Array of customer objects.
 */
export const getCustomers = () => request('/customers');

/**
 * Registers a new customer.
 *
 * @param {string} name - The customer's full name.
 * @param {string} email - The customer's email address (must be unique).
 * @returns {Promise<{id: string, name: string, email: string}>} The registered customer.
 * @throws {Error} When a customer with the same email already exists (HTTP 409).
 */
export const createCustomer = (name, email) =>
  request('/customers', { method: 'POST', body: JSON.stringify({ name, email }) });

/**
 * Deletes a customer by their UUID.
 *
 * @param {string} id - The UUID of the customer to delete.
 * @returns {Promise<null>} Resolves to null on success (204 No Content).
 */
export const deleteCustomer = (id) => request(`/customers/${id}`, { method: 'DELETE' });
