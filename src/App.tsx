import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReviewFormPage from './pages/ReviewFormPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useBikeContext } from './context/BikeContext';

// Initialize socket connection
const socket = io('http://localhost:5000');
// const socket = io('https://rateyourbike.onrender.com');

function App() {
  const { addNewReview } = useBikeContext();

  useEffect(() => {
    // Listen for new reviews
    socket.on('newReview', (review) => {
      addNewReview(review);
    });

    return () => {
      socket.off('newReview');
    };
  }, [addNewReview]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review/new" element={<ReviewFormPage />} />
          <Route path="/review/:id" element={<ReviewDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;