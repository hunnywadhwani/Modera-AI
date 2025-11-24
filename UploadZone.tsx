import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface UploadZoneProps {
  selectedImage: File | null;
  previewUrl: string | null;
  onImageSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  selectedImage, 
  previewUrl, 
  onImageSelect, 
  onClear,
  disabled 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  if (selectedImage && previewUrl) {
    return (
      <div className="relative group w-full h-96 rounded-xl overflow-hidden border border-modera-700 bg-black">
        <img 
          src={previewUrl} 
          alt="Product Preview" 
          className="w-full h-full object-contain"
        />
        {!disabled && (
          <button 
            onClick={onClear}
            className="absolute top-4 right-4 bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white text-sm font-medium truncate">{selectedImage.name}</p>
          <p className="text-slate-400 text-xs">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`
        w-full h-96 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-8 transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed border-modera-700' : 'border-modera-700 hover:border-modera-accent cursor-pointer hover:bg-modera-800/30'}
      `}
    >
      <div className="bg-modera-800 p-4 rounded-full mb-4 shadow-xl">
        <UploadCloud className="w-8 h-8 text-modera-accent" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">Upload Product Image</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-xs">
        Drag and drop your clothing item (kurti, shirt, dress) or click to browse.
      </p>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ImageIcon className="w-4 h-4" />
        <span>Supports JPG, PNG, WEBP</span>
      </div>
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};