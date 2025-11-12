import React from 'react';

interface ImageGridProps {
  images: string[];
  onImageSelect: (imageSrc: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full p-4">
      {images.map((imgSrc, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(imgSrc)}
          className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <img
            src={imgSrc}
            alt={`생성된 배경화면 시안 ${index + 1}`}
            className="w-full h-full object-cover aspect-[9/16]"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white font-semibold text-lg">크게 보기</p>
          </div>
        </button>
      ))}
    </div>
  );
};