/**
 * @file CustomersTab.jsx
 * @description Tab component for viewing, registering, and deleting customers.
 * @author Joe Sicree (test@test.com)
 * @since 2026-03-23
 */
import { useState, useEffect, useCallback } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from '../api.js';

/**
 * Renders the Customers tab with a registration form and a data table of existing customers.
 *
 * @returns {JSX.Element} The customers management section.
 */
export default function CustomersTab() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Loads all customers from the API and updates component state.
   *
   * @returns {Promise<void>}
   */
  const load = useCallback(async () => {
    try {
      setCustomers(await getCustomers());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /**
   * Handles form submission to register a new customer.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   * @returns {Promise<void>}
   */
  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await createCustomer(name.trim(), email.trim());
      setName('');
      setEmail('');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Prompts for confirmation then deletes the specified customer.
   *
   * @param {string} id - The UUID of the customer to delete.
   * @returns {Promise<void>}
   */
  async function handleDelete(id) {
    if (!window.confirm('Delete this customer?')) return;
    setError('');
    try {
      await deleteCustomer(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h2>Customers</h2>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Customer'}
        </button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty">No customers yet.</td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(c.id)}>
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
