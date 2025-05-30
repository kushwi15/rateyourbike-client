import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReviewFormPage from './pages/ReviewFormPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { io } from 'socket.io-client';
import { useBikeContext } from './context/BikeContext';
import Preloader from './components/Preloader';

// Initialize socket connection
// const socket = io('http://localhost:5000');
const socket = io('https://rateyourbike.onrender.com');

function App() {
  const { addNewReview } = useBikeContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate preloader delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    socket.on('newReview', (review) => {
      addNewReview(review);
    });

    return () => {
      socket.off('newReview');
    };
  }, [addNewReview]);

  if (loading) return <Preloader />;

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
