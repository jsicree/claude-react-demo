/**
 * @file App.jsx
 * @description Root application component providing tab-based navigation between domain views.
 * @author Joe Sicree (test@test.com)
 * @since 2026-03-23
 */
import { useState } from 'react';
import ProductsTab from './components/ProductsTab.jsx';
import CustomersTab from './components/CustomersTab.jsx';

const TABS = ['Products', 'Customers'];

/**
 * Root application shell that renders the header, tab navigation, and the active tab content.
 *
 * @returns {JSX.Element} The full application layout with header, nav, and main content area.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('Products');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Claude React Demo</h1>
      </header>
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <main className="app-main">
        {activeTab === 'Products' && <ProductsTab />}
        {activeTab === 'Customers' && <CustomersTab />}
      </main>
    </div>
  );
}