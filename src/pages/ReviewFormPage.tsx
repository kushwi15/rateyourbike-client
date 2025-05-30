import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ImageUploader from '../components/ImageUploader';
import { bikeData } from '../utils/bikeData';
import axios from 'axios';
import { Info, Loader, Check } from 'lucide-react';

const ReviewFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    riderName: '',
    bikeName: '',
    modelName: '',
    purchaseYear: new Date().getFullYear(),
    totalKM: 0,
    bikeCost: 0,
    costPerService: 0,
    review: '',
    rating: 0,
    worthTheCost: 'Yes'
  });
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const brandInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update available models when bike brand changes
  useEffect(() => {
    if (formData.bikeName) {
      const models = bikeData[formData.bikeName as keyof typeof bikeData] || [];
      setAvailableModels(models);
      if (!models.includes(formData.modelName)) {
        setFormData(prev => ({ ...prev, modelName: '' }));
      }
    }
  }, [formData.bikeName]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandInputRef.current && !brandInputRef.current.contains(event.target as Node)) {
        setShowBrandSuggestions(false);
      }
      if (modelInputRef.current && !modelInputRef.current.contains(event.target as Node)) {
        setShowModelSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['purchaseYear', 'totalKM', 'bikeCost', 'costPerService'].includes(name)) {
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
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, bikeName: value, modelName: '' }));
    
    if (value.length > 0) {
      const filtered = Object.keys(bikeData).filter(brand =>
        brand.toLowerCase().includes(value.toLowerCase())
      );
      setBrandSuggestions(filtered);
      setShowBrandSuggestions(true);
    } else {
      setBrandSuggestions([]);
      setShowBrandSuggestions(false);
    }
    
    if (errors.bikeName) {
      setErrors(prev => ({ ...prev, bikeName: '' }));
    }
  };

  const handleModelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, modelName: value }));
    
    if (value.length > 0 && formData.bikeName) {
      const models = bikeData[formData.bikeName as keyof typeof bikeData] || [];
      const filtered = models.filter(model =>
        model.toLowerCase().includes(value.toLowerCase())
      );
      setModelSuggestions(filtered);
      setShowModelSuggestions(true);
    } else {
      setModelSuggestions([]);
      setShowModelSuggestions(false);
    }
    
    if (errors.modelName) {
      setErrors(prev => ({ ...prev, modelName: '' }));
    }
  };

  const selectBrand = (brand: string) => {
    setFormData(prev => ({ ...prev, bikeName: brand, modelName: '' }));
    setBrandSuggestions([]);
    setShowBrandSuggestions(false);
    setModelSuggestions([]);
    setShowModelSuggestions(false);
    setTimeout(() => modelInputRef.current?.focus(), 0);
  };

  const selectModel = (model: string) => {
    setFormData(prev => ({ ...prev, modelName: model }));
    setModelSuggestions([]);
    setShowModelSuggestions(false);
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
    
    if (!formData.riderName) newErrors.riderName = 'Please enter your name';
    if (!formData.bikeName) newErrors.bikeName = 'Please select a bike brand';
    if (!formData.modelName) newErrors.modelName = 'Please select a model';
    if (formData.rating === 0) newErrors.rating = 'Please rate your bike';
    if (!formData.review.trim()) newErrors.review = 'Please share your experience';
    
    if (formData.purchaseYear < 1900 || formData.purchaseYear > new Date().getFullYear()) {
      newErrors.purchaseYear = 'Please enter a valid year';
    }
    
    if (formData.totalKM < 0) newErrors.totalKM = 'Cannot be negative';
    if (formData.bikeCost <= 0) newErrors.bikeCost = 'Please enter the bike cost';
    if (formData.costPerService < 0) newErrors.costPerService = 'Cannot be negative';
    
    if (images.length < 3) newErrors.images = 'Please upload at least 3 images';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });
      
      images.forEach((image, index) => {
        formDataToSend.append('bikeImages', image);
        formDataToSend.append(`imageInfo[${index}][name]`, image.name);
        formDataToSend.append(`imageInfo[${index}][type]`, image.type);
        formDataToSend.append(`imageInfo[${index}][size]`, image.size.toString());
      });
      
      formDataToSend.append('timestamp', Date.now().toString());
      
      // const response = await axios.post('http://localhost:5000/api/bikes/add', formDataToSend, {
      const response = await axios.post('https://rateyourbike.onrender.com/api/bikes/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate(`/review/${response.data._id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({
        ...errors,
        submit: 'Failed to submit your review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
                  Your review will help fellow riders make informed decisions. Once submitted, reviews cannot be edited or deleted.
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
              {/* Rider Name */}
              <div>
                <label htmlFor="riderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="riderName"
                  name="riderName"
                  value={formData.riderName}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.riderName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
                  placeholder="Enter your name"
                />
                {errors.riderName && <p className="mt-1 text-sm text-red-600">{errors.riderName}</p>}
              </div>

              {/* Bike Brand - Autocomplete Input */}
              <div className="relative" ref={brandInputRef}>
                <label htmlFor="bikeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bikeName"
                  name="bikeName"
                  value={formData.bikeName}
                  onChange={handleBrandInputChange}
                  onFocus={() => formData.bikeName && setShowBrandSuggestions(true)}
                  className={`w-full rounded-md border ${errors.bikeName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
                  placeholder="Start typing bike brand..."
                  autoComplete="off"
                />
                {showBrandSuggestions && brandSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                    {brandSuggestions.map(brand => (
                      <div
                        key={brand}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectBrand(brand)}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                )}
                {errors.bikeName && <p className="mt-1 text-sm text-red-600">{errors.bikeName}</p>}
              </div>
              
              {/* Model Name - Autocomplete Input */}
              <div className="relative" ref={modelInputRef}>
                <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="modelName"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleModelInputChange}
                  onFocus={() => {
                    if (formData.bikeName && formData.modelName) {
                      setShowModelSuggestions(true);
                    }
                  }}
                  disabled={!formData.bikeName}
                  className={`w-full rounded-md border ${errors.modelName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0] ${!formData.bikeName ? 'bg-gray-100' : ''}`}
                  placeholder={formData.bikeName ? "Start typing model..." : "Select brand first"}
                  autoComplete="off"
                />
                {showModelSuggestions && modelSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                    {modelSuggestions.map(model => (
                      <div
                        key={model}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectModel(model)}
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                )}
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
                  value={formData.totalKM || ''}
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
                  value={formData.bikeCost || ''}
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
                  value={formData.costPerService || ''}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.costPerService ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B60B0] focus:border-[#0B60B0]`}
                  placeholder="0"
                />
                {errors.costPerService && <p className="mt-1 text-sm text-red-600">{errors.costPerService}</p>}
              </div>
            </div>
            
            {/* Worth The Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Was it worth the cost?
              </label>
              <div className="flex justify-between gap-2">
                {['Yes', 'Definitely Yes', 'No'].map(option => (
                  <div key={option} className="flex-1">
                    <input
                      type="radio"
                      id={`worth${option.replace(' ', '')}`}
                      name="worthTheCost"
                      value={option}
                      checked={formData.worthTheCost === option}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`worth${option.replace(' ', '')}`}
                      className={`cursor-pointer block rounded-md px-2 py-2 text-center text-xs sm:text-sm transition-colors w-full ${
                        formData.worthTheCost === option
                          ? option === 'No'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : option === 'Definitely Yes'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
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
                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                maxFileSize={5 * 1024 * 1024} // 5MB
                onError={(error) => setErrors({...errors, images: error})}
              />
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            </div>
            
            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="pt-2">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Uploading
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
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