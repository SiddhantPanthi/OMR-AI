import React, { useState, useRef, useCallback } from 'react';
import { CameraIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string | null) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload, disabled]);

  const handleRemoveImage = () => {
    setPreview(null); 
    onImageUpload(null); 
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-bold text-sm">
          1
        </div>
        <h4 className="text-lg font-semibold text-slate-800">Upload Answer Sheet</h4>
      </div>
      
      <div className="relative">
        <label 
          htmlFor="image-upload"
          className={`group relative w-full h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
            disabled 
              ? 'bg-slate-50 cursor-not-allowed border-slate-200' 
              : preview 
                ? 'border-green-300 bg-green-50/50 hover:bg-green-50 cursor-pointer'
                : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer hover:scale-[1.01]'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative w-full h-full p-4 group">
              <img 
                src={preview} 
                alt="Answer sheet preview" 
                className="w-full h-full object-contain rounded-xl shadow-card" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-xl flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-700">
                  Click to change image
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center pointer-events-none space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <CameraIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-1">Drop your image here</p>
                <p className="text-sm text-slate-500">or click to browse files</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">PNG</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">JPG</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">WEBP</span>
              </div>
            </div>
          )}
          
          {/* Upload progress indicator - could be enhanced later */}
          {!disabled && !preview && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
          )}
        </label>
        
        <input
          type="file"
          id="image-upload"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
          accept="image/png, image/jpeg, image/webp"
          className="sr-only"
          aria-labelledby="image-upload-label"
        />
      </div>
      
      {preview && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Image uploaded successfully</p>
              <p className="text-xs text-green-600">Ready to process</p>
            </div>
          </div>
          <button 
            onClick={handleRemoveImage} 
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 rounded-lg focus-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;