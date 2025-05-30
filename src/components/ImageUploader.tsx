import React, { useCallback, useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  minImages: number;
  maxImages: number;
  acceptedFormats?: string[];
  maxFileSize?: number;
  onError?: (error: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  setImages,
  minImages,
  maxImages,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  onError,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    if (!acceptedFormats.includes(file.type)) {
      onError?.(`Invalid file type. Only ${acceptedFormats.join(', ')} are allowed.`);
      return false;
    }
    
    if (file.size > maxFileSize) {
      onError?.(`File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`);
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(validateFile);
      
      if (images.length + newFiles.length > maxImages) {
        onError?.(`You can only upload up to ${maxImages} images.`);
        return;
      }
      
      setImages((prev) => [...prev, ...newFiles]);
      onError?.('');
    }
  }, [images.length, maxImages, setImages, onError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(validateFile);
      
      if (images.length + newFiles.length > maxImages) {
        onError?.(`You can only upload up to ${maxImages} images.`);
        return;
      }
      
      setImages((prev) => [...prev, ...newFiles]);
      onError?.('');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload size={24} className="text-gray-500" />
          <p className="text-sm text-gray-600">
            {dragActive ? 'Drop your images here' : 'Drag & drop images here or click to browse'}
          </p>
          <p className="text-xs text-gray-500">
            Upload {minImages}-{maxImages} images ({acceptedFormats.join(', ')}), max {maxFileSize / (1024 * 1024)}MB each
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < minImages && (
        <div className="text-sm text-yellow-600 flex items-center">
          <ImageIcon size={16} className="mr-1" />
          {minImages - images.length} more image(s) required
        </div>
      )}
    </div>
  );
};

export default ImageUploader;