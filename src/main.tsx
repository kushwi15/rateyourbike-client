import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { BikeProvider } from './context/BikeContext';

// Import the favicon from src/assets
import favicon from './assets/icon.png';

// Inject favicon dynamically
const setFavicon = () => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = favicon;
  document.head.appendChild(link);
};

setFavicon(); // Call before render

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BikeProvider>
        <App />
      </BikeProvider>
    </BrowserRouter>
  </StrictMode>
);
