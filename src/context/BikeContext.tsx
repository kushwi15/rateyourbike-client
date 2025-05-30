import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://rateyourbike.onrender.com';

interface BikeReview {
  riderName: ReactNode;
  _id: string;
  bikeName: string;
  modelName: string;
  purchaseYear: number;
  totalKM: number;
  bikeCost: number;
  costPerService: number;
  minorRepairCost: number;
  majorRepairCost: number;
  review: string;
  rating: number;
  worthTheCost: string;
  images: string[];
  createdAt: string;
}

interface BikeContextType {
  bikes: BikeReview[];
  searchResults: BikeReview[];
  loading: boolean;
  error: string | null;
  searchBikes: (query: string) => void;
  addNewReview: (review: BikeReview) => void;
  getBikeById: (id: string) => BikeReview | undefined;
}

const BikeContext = createContext<BikeContextType | undefined>(undefined);

export const useBikeContext = () => {
  const context = useContext(BikeContext);
  if (!context) {
    throw new Error('useBikeContext must be used within a BikeProvider');
  }
  return context;
};

export const BikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bikes, setBikes] = useState<BikeReview[]>([]);
  const [searchResults, setSearchResults] = useState<BikeReview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bikes when component mounts
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/bikes`);
        setBikes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bikes. Please try again later.');
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  // Search bikes functionality with debounce
  const searchBikes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/bikes/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error searching bikes. Please try again.');
      setLoading(false);
    }
  }, []);

  // Add new review
  const addNewReview = useCallback((review: BikeReview) => {
    setBikes((prevBikes) => [review, ...prevBikes]);
  }, []);

  // Get bike by ID
  const getBikeById = useCallback(
    (id: string) => {
      return bikes.find((bike) => bike._id === id);
    },
    [bikes]
  );

  return (
    <BikeContext.Provider
      value={{
        bikes,
        searchResults,
        loading,
        error,
        searchBikes,
        addNewReview,
        getBikeById,
      }}
    >
      {children}
    </BikeContext.Provider>
  );
};
