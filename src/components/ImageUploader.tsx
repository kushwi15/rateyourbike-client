import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  maxImages?: number;
  minImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  setImages,
  maxImages = 5,
  minImages = 3,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;
    
    if (images.length + selectedFiles.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images`);
      return;
    }
    
    // Check file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were rejected. Images must be under 5MB.');
    } else {
      setError(null);
    }
    
    // Create preview URLs for the new images
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Bike Images ({minImages} required, {maxImages} maximum)
        </label>
        <span className="text-sm text-gray-500">
          {images.length} / {maxImages}
        </span>
      </div>
      
      {error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square">
            <img 
              src={url} 
              alt={`Preview ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Upload className="text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">Upload Image</p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        multiple
      />
      
      {images.length < minImages && (
        <p className="text-sm text-amber-600">
          Please upload at least {minImages} images of your bike.
        </p>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Supported formats: JPG, PNG, GIF (max 5MB each)</p>
      </div>
    </div>
  );
};

export default ImageUploader;