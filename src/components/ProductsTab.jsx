/**
 * @file ProductsTab.jsx
 * @description Tab component for viewing, creating, and deleting products.
 * @author Joe Sicree (test@test.com)
 * @since 2026-03-23
 */
import { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, deleteProduct } from '../api.js';

/**
 * Renders the Products tab with a creation form and a data table of existing products.
 *
 * @returns {JSX.Element} The products management section.
 */
export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Loads all products from the API and updates component state.
   *
   * @returns {Promise<void>}
   */
  const load = useCallback(async () => {
    try {
      setProducts(await getProducts());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /**
   * Handles form submission to create a new product.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   * @returns {Promise<void>}
   */
  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !price) return;
    setLoading(true);
    try {
      await createProduct(name.trim(), price);
      setName('');
      setPrice('');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Prompts for confirmation then deletes the specified product.
   *
   * @param {string} id - The UUID of the product to delete.
   * @returns {Promise<void>}
   */
  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    setError('');
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h2>Products</h2>
      {error && <div className="alert error">{error}</div>}

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          min="0"
          step="0.01"
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Product'}
        </button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty">No products yet.</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
