import React, { useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { useBikeContext } from '../context/BikeContext';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { Bike, ArrowRight, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const { bikes, searchResults, loading } = useBikeContext();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bikesToDisplay = searchResults.length > 0 ? searchResults : bikes;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
<section className="bg-gradient-to-r from-[#0B60B0] to-[#0A4D8C] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Find Your Perfect Bike with Real Reviews
            </h1>
            <p className="text-lg md:text-xl mb-4 text-gray-200">
              Search for detailed bike reviews or share your own experience — no registration required!
            </p>

            {/* Dynamic Bike Count */}
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              🏍️ <span className="font-semibold">{bikes.length}</span> bikes listed and counting!
            </p>

            <div className="mt-8 mb-4">
              <SearchBar />
            </div>
            <p className="text-sm text-gray-300 mt-4">
              Search by bike name, model, or brand to find reviews from real riders
            </p>
          </div>
        </div>
      </section>

      {/* Featured Reviews Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
            {searchResults.length > 0 ? 'Search Results' : 'Recently Added Reviews'}
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B60B0]"></div>
            </div>
          ) : bikesToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bikesToDisplay.slice(0, 6).map((bike) => (
                <Link 
                  to={`/review/${bike._id}`} 
                  key={bike._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {bike.images && bike.images.length > 0 ? (
                      <img 
                        // src={`http://localhost:5000${bike.images[0]}`} 
                        src={`https://rateyourbike.onrender.com${bike.images[0]}`} 
                        alt={bike.bikeName}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <Bike size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="flex items-center">
                        <StarRating rating={bike.rating} size={16} />
                        <span className="ml-2 text-white text-sm">
                          {bike.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{bike.bikeName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{bike.modelName} ({bike.purchaseYear})</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          ₹{bike.bikeCost.toLocaleString()}
                        </span>
                        <span className={`ml-2 inline-block text-xs px-2 py-1 rounded-full ${
                          bike.worthTheCost === 'Yes' ? 'bg-green-100 text-green-800' : 
                          bike.worthTheCost === 'No' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {bike.worthTheCost === 'Definitely Yes' ? 'Highly Worth It' : 
                           bike.worthTheCost === 'Yes' ? 'Worth It' : 'Not Worth It'}
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">Try searching with different keywords.</p>
            </div>
          )}
        </div>
      </section>

            {/* Call to Action */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Share Your Bike Experience
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Help fellow Bikers make informed decisions by sharing your honest review.
            No account needed!
          </p>
          <Link
            to="/review/new"
            className="inline-block bg-[#FF7C1F] hover:bg-[#E86C10] text-white font-medium px-6 py-3 rounded-md transition-colors duration-200"
          >
            Rate Your Bike Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
