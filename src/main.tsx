import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { BikeProvider } from './context/BikeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BikeProvider>
        <App />
      </BikeProvider>
    </BrowserRouter>
  </StrictMode>
);