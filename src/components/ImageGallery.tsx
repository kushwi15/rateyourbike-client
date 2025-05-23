import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Define your API base URL here (change as needed for dev/prod)
// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://rateyourbike.onrender.com';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to build full image URLs - improved
  const getImageUrl = (path: string) => {
    if (!path) return '';
    // If path is already a full URL, return it directly
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Remove trailing slash from base URL if any
    const base = API_BASE_URL.replace(/\/$/, '');
    // Add leading slash to path if missing
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scroll
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-gray-400 flex flex-col items-center">
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image display */}
      <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`${alt} - Featured Image`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openModal(index)}
            className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
              index === currentIndex ? 'border-[#0B60B0]' : 'border-transparent'
            }`}
          >
            <img
              src={getImageUrl(image)}
              alt={`${alt} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Modal with full-size image and navigation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
            aria-label="Close modal"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-5xl w-full">
            <img
              src={getImageUrl(images[currentIndex])}
              alt={`${alt} - Full size image`}
              className="w-full max-h-[85vh] object-contain"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-gray-500'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
