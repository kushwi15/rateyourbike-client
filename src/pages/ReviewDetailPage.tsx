import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';
import ImageGallery from '../components/ImageGallery';
import { formatDistanceToNow } from '../utils/dateUtils';
import { ArrowLeft, IndianRupee, Wrench, Calendar, Gauge, CheckCircle, XCircle, User } from 'lucide-react';
import { useBikeContext } from '../context/BikeContext';

// const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your production URL when needed
const API_BASE_URL = 'https://rateyourbike.onrender.com/api';

const ReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBikeById } = useBikeContext();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    const fetchReview = async () => {
      // First check if we already have this review in context
      const cachedReview = id ? getBikeById(id) : null;
      
      if (cachedReview) {
        setReview(cachedReview);
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      try {
        setLoading(true);
        if (!id) throw new Error('Review ID is missing');
        
        const response = await axios.get(`${API_BASE_URL}/bikes/${id}`);
        setReview(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching review:', err);
        setError('Failed to load the review. It may have been removed or does not exist.');
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, getBikeById]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B60B0] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="max-w-md text-center bg-white p-8 rounded-lg shadow-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This review may have been removed or does not exist.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-[#0B60B0] text-white rounded-md hover:bg-[#094E90] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#0B60B0] hover:text-[#094E90] mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-[#0B60B0] text-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <User size={20} />
                <span className="font-medium">{review.riderName}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{review.bikeName}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-lg">{review.modelName}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center">
                  <StarRating rating={review.rating} size={18} />
                  <span className="ml-2">{review.rating.toFixed(1)}/5</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-200">
                  Posted {formatDistanceToNow(new Date(review.createdAt))} ago
                </span>
              </div>
            </div>
            
            {/* Image Gallery */}
            <div className="p-6 border-b border-gray-200">
              <ImageGallery images={review.images} alt={`${review.bikeName} ${review.modelName}`} />
            </div>
            
            {/* Bike Details */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bike Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Purchase Year */}
                  <div className="flex items-start">
                    <Calendar className="text-[#0B60B0] mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Purchase Year</p>
                      <p className="font-medium">{review.purchaseYear}</p>
                    </div>
                  </div>
                  
                  {/* Total KM */}
                  <div className="flex items-start">
                    <Gauge className="text-[#0B60B0] mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Total KM Driven</p>
                      <p className="font-medium">{review.totalKM.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Bike Cost */}
                  <div className="flex items-start">
                    <IndianRupee className="text-[#0B60B0] mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Bike Cost</p>
                      <p className="font-medium">₹{review.bikeCost.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Cost Per Service */}
                  <div className="flex items-start">
                    <Wrench className="text-[#0B60B0] mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Cost Per Service</p>
                      <p className="font-medium">₹{review.costPerService.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Worth the Cost */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Value Assessment</h2>
              
              <div className={`flex items-center p-4 rounded-lg ${
                review.worthTheCost === 'Yes' ? 'bg-green-50 border border-green-100' :
                review.worthTheCost === 'Definitely Yes' ? 'bg-green-50 border border-green-100' :
                'bg-red-50 border border-red-100'
              }`}>
                {review.worthTheCost === 'No' ? (
                  <XCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
                ) : (
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={24} />
                )}
                <div>
                  <p className={`font-medium ${
                    review.worthTheCost === 'No' ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {review.worthTheCost === 'Yes' ? 'Worth the Cost' :
                     review.worthTheCost === 'Definitely Yes' ? 'Definitely Worth the Cost' :
                     'Not Worth the Cost'}
                  </p>
                  <p className={`text-sm ${
                    review.worthTheCost === 'No' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {review.worthTheCost === 'Yes' ? 'Reviewer feels this bike offers good value for money.' :
                     review.worthTheCost === 'Definitely Yes' ? 'Reviewer feels this bike offers exceptional value for money.' :
                     'Reviewer feels this bike does not offer good value for money.'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Review */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Review</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{review.review}</p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-10 text-center bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Have a similar bike?</h3>
            <p className="text-gray-600 mb-4">Share your experience and help others make informed decisions.</p>
            <Link
              to="/review/new"
              className="inline-block px-6 py-3 bg-[#FF7C1F] text-white font-medium rounded-md hover:bg-[#E86C10] transition-colors"
            >
              Rate Your Bike
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;