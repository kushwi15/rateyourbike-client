import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ImageUploader from '../components/ImageUploader';
import { bikeData } from '../utils/bikeData';
import axios from 'axios';
import { Info, Loader, Check } from 'lucide-react';

const ReviewFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bikeName: '',
    modelName: '',
    purchaseYear: new Date().getFullYear(),
    totalKM: 0,
    bikeCost: 0,
    costPerService: 0,
    minorRepairCost: 0,
    majorRepairCost: 0,
    review: '',
    rating: 0,
    worthTheCost: 'Yes'
  });
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update available models when bike brand changes
  useEffect(() => {
    if (formData.bikeName) {
      setAvailableModels(bikeData[formData.bikeName as keyof typeof bikeData] || []);
      // Reset model selection if brand changes
      if (!bikeData[formData.bikeName as keyof typeof bikeData]?.includes(formData.modelName)) {
        setFormData(prev => ({ ...prev, modelName: '' }));
      }
    }
  }, [formData.bikeName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    if (['purchaseYear', 'totalKM', 'bikeCost', 'costPerService', 'minorRepairCost', 'majorRepairCost'].includes(name)) {
      const numValue = Number(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const setRating = (rating: number) => {
    setFormData({
      ...formData,
      rating
    });
    
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Required fields
    if (!formData.bikeName) newErrors.bikeName = 'Please select a bike brand';
    if (!formData.modelName) newErrors.modelName = 'Please select a model';
    if (formData.rating === 0) newErrors.rating = 'Please rate your bike';
    if (!formData.review.trim()) newErrors.review = 'Please share your experience';
    
    // Numeric validation
    if (formData.purchaseYear < 1900 || formData.purchaseYear > new Date().getFullYear()) {
      newErrors.purchaseYear = 'Please enter a valid year';
    }
    
    if (formData.totalKM < 0) newErrors.totalKM = 'Cannot be negative';
    if (formData.bikeCost <= 0) newErrors.bikeCost = 'Please enter the bike cost';
    if (formData.costPerService < 0) newErrors.costPerService = 'Cannot be negative';
    if (formData.minorRepairCost < 0) newErrors.minorRepairCost = 'Cannot be negative';
    if (formData.majorRepairCost < 0) newErrors.majorRepairCost = 'Cannot be negative';
    
    // Images validation
    if (images.length < 3) newErrors.images = 'Please upload at least 3 images';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a FormData object to send the files
      const formDataToSend = new FormData();
      
      // Append all the form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });
      
      // Append all images
      images.forEach(image => {
        formDataToSend.append('bikeImages', image);
      });
      
      // Send the data to the server
      // const response = await axios.post('http://localhost:5000/api/bikes/add', formDataToSend, {
      const response = await axios.post('https://rateyourbike.onrender.com/api/bikes/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        
        // Redirect to the detail page after a delay
        setTimeout(() => {
          navigate(`/review/${response.data._id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({
        ...errors,
        submit: 'Failed to submit your review. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Review Submitted!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Thank you for sharing your bike experience.
            </p>
            <div className="mt-6">
              <div className="animate-pulse rounded-full h-2 w-32 mx-auto bg-green-200"></div>
              <p className="mt-4 text-sm text-gray-500">
                Redirecting to your review...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Rate Your Bike</h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex items-start">
              <Info className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-blue-800">
                  Your review will help fellow  make informed decisions. Once submitted, reviews cannot be edited or deleted.
                </p>
              </div>
            </div>
          </div>
          
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-100 text-red-800">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bike Brand */}
              <div>
                <label htmlFor="bikeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Brand <span className="text-red-500">*</span>
                </label>
                <select
                  id="bikeName"
                  name="bikeName"
                  value={formData.bikeName}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.bikeName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
                >
                  <option value="">Select a brand</option>
                  {Object.keys(bikeData).map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                {errors.bikeName && <p className="mt-1 text-sm text-red-600">{errors.bikeName}</p>}
              </div>
              
              {/* Model Name */}
              <div>
                <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="modelName"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleChange}
                  disabled={!formData.bikeName}
                  className={`w-full rounded-md border ${errors.modelName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0] ${!formData.bikeName ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Select a model</option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                {errors.modelName && <p className="mt-1 text-sm text-red-600">{errors.modelName}</p>}
              </div>
              
{/* Purchase Year */}
<div>
  <label htmlFor="purchaseYear" className="block text-sm font-medium text-gray-700 mb-1">
    Purchase Year
  </label>
  <select
    id="purchaseYear"
    name="purchaseYear"
    value={formData.purchaseYear}
    onChange={handleChange}
    className={`w-full rounded-md border ${errors.purchaseYear ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
  >
    <option value="">Select Year</option>
    {[...Array(new Date().getFullYear() - 1999)].map((_, index) => {
      const year = 2000 + index;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    })}
  </select>
  {errors.purchaseYear && <p className="mt-1 text-sm text-red-600">{errors.purchaseYear}</p>}
</div>

              
{/* Total KM */}
<div>
  <label htmlFor="totalKM" className="block text-sm font-medium text-gray-700 mb-1">
    Total KM Driven
  </label>
  <input
    type="text"
    inputMode="numeric"
    id="totalKM"
    name="totalKM"
    value={formData.totalKM}
    onChange={handleChange}
    className={`w-full rounded-md border ${errors.totalKM ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
    placeholder="0"
  />
  {errors.totalKM && <p className="mt-1 text-sm text-red-600">{errors.totalKM}</p>}
</div>

{/* Bike Cost */}
<div>
  <label htmlFor="bikeCost" className="block text-sm font-medium text-gray-700 mb-1">
    Bike Cost (₹) <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    inputMode="numeric"
    id="bikeCost"
    name="bikeCost"
    value={formData.bikeCost}
    onChange={handleChange}
    className={`w-full rounded-md border ${errors.bikeCost ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
    placeholder="0"
  />
  {errors.bikeCost && <p className="mt-1 text-sm text-red-600">{errors.bikeCost}</p>}
</div>

{/* Cost Per Service */}
<div>
  <label htmlFor="costPerService" className="block text-sm font-medium text-gray-700 mb-1">
    Cost Per Service (₹)
  </label>
  <input
    type="text"
    inputMode="numeric"
    id="costPerService"
    name="costPerService"
    value={formData.costPerService}
    onChange={handleChange}
    className={`w-full rounded-md border ${errors.costPerService ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
    placeholder="0"
  />
  {errors.costPerService && <p className="mt-1 text-sm text-red-600">{errors.costPerService}</p>}
</div>

{/* Minor Repair Cost */}
<div>
  <label htmlFor="minorRepairCost" className="block text-sm font-medium text-gray-700 mb-1">
    Approximate Minor Repair Cost (₹)
  </label>
  <input
    type="text"
    inputMode="numeric"
    id="minorRepairCost"
    name="minorRepairCost"
    value={formData.minorRepairCost}
    onChange={handleChange}
    className={`w-full rounded-md border ${errors.minorRepairCost ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
    placeholder="0"
  />
  {errors.minorRepairCost && <p className="mt-1 text-sm text-red-600">{errors.minorRepairCost}</p>}
</div>

{/* Major Repair Cost */}
<div>
  <label htmlFor="majorRepairCost" className="block text-sm font-medium text-gray-700 mb-1">
    Approximate Major Repair Cost (₹)
  </label>
  <input
    type="text"
    inputMode="numeric"
    id="majorRepairCost"
    name="majorRepairCost"
    value={formData.majorRepairCost}
    onChange={handleChange}
    className={`w-full rounded-md border ${errors.majorRepairCost ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
    placeholder="0"
  />
  {errors.majorRepairCost && <p className="mt-1 text-sm text-red-600">{errors.majorRepairCost}</p>}
</div>
            </div>
            
            {/* Worth The Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Was it worth the cost?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="radio"
                    id="worthYes"
                    name="worthTheCost"
                    value="Yes"
                    checked={formData.worthTheCost === 'Yes'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="worthYes"
                    className={`cursor-pointer w-full rounded-md px-3 py-2 text-center text-sm transition-colors ${
                      formData.worthTheCost === 'Yes'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="worthDefinitelyYes"
                    name="worthTheCost"
                    value="Definitely Yes"
                    checked={formData.worthTheCost === 'Definitely Yes'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="worthDefinitelyYes"
                    className={`cursor-pointer w-full rounded-md px-3 py-2 text-center text-sm transition-colors ${
                      formData.worthTheCost === 'Definitely Yes'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Definitely Yes
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="worthNo"
                    name="worthTheCost"
                    value="No"
                    checked={formData.worthTheCost === 'No'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="worthNo"
                    className={`cursor-pointer w-full rounded-md px-3 py-2 text-center text-sm transition-colors ${
                      formData.worthTheCost === 'No'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
            
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Your Bike <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <StarRating rating={formData.rating} setRating={setRating} editable={true} />
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {formData.rating > 0 ? formData.rating : ''}
                </span>
              </div>
              {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
            </div>
            
            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                Your Detailed Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                rows={5}
                className={`w-full rounded-md border ${errors.review ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
                placeholder="Share your experience with this bike. What did you like? What could be improved? How does it perform on different terrains?"
              ></textarea>
              {errors.review && <p className="mt-1 text-sm text-red-600">{errors.review}</p>}
            </div>
            
            {/* Image Upload */}
            <div>
              <ImageUploader 
                images={images} 
                setImages={setImages} 
                minImages={3}
                maxImages={5}
              />
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-[#0B60B0] text-white font-medium rounded-md hover:bg-[#094E90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B60B0] transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader size={18} className="animate-spin mr-2" />
                    Submitting...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewFormPage;