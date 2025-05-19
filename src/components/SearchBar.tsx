import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useBikeContext } from '../context/BikeContext';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const { searchBikes, searchResults, loading } = useBikeContext();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
useEffect(() => {
  if (query.trim() === '') {
    searchBikes(''); // clear search results in context
    setIsResultsVisible(false);
  } else {
    const timer = setTimeout(() => {
      searchBikes(query);
      setIsResultsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }
}, [query, searchBikes]);


  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (id: string) => {
    navigate(`/review/${id}`);
    setIsResultsVisible(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bikes by name, model, or brand..."
          className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent 
          shadow-sm text-gray-800"
          onFocus={() => {
            if (query && searchResults.length > 0) {
              setIsResultsVisible(true);
            }
          }}
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D32F2F]" 
          size={18} 
        />
      </div>

{/* Sample search output */}
      {/* {isResultsVisible && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-[#212121] text-white rounded-lg 
          shadow-lg border border-gray-600 max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-300">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D32F2F] mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((bike) => (
                <li 
                  key={bike._id} 
                  onClick={() => handleResultClick(bike._id)}
                  className="p-3 hover:bg-[#424242] cursor-pointer border-b border-gray-600 last:border-b-0"
                >
                  <div className="flex items-center">
                    {bike.images && bike.images.length > 0 && (
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-3 bg-gray-700 flex-shrink-0">
                        <img 
                          src={`http://localhost:5000${bike.images[0]}`} 
                          alt={bike.bikeName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-white">{bike.bikeName}</p>
                      <p className="text-sm text-gray-400">{bike.modelName} ({bike.purchaseYear})</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              <p>No bikes found. Try a different search.</p>
            </div>
          ) : null}
        </div>
      )} */}
    </div>
  );
};

export default SearchBar;
