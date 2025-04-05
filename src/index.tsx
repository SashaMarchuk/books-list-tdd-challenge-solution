import React from 'react';
import { createRoot } from 'react-dom/client';
import BooksView from './Books/BooksView';
import Header from './Shared/Header/Header';
import './styles.css';

/**
 * The root application component.
 * Renders the main layout including the Header and BooksView.
 * @component
 */
const App: React.FC = () => {
  return (
    <>
      <Header />
      <h1>Reaktivate Books Demo</h1>
      <BooksView />
    </>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />); 