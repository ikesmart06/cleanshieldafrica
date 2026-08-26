import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const {StrictMode} = await import('react');
  const {createRoot} = await import('react-dom/client');
  const {default: App} = await import('./App.tsx');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
