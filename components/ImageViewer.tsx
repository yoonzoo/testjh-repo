import React, { useEffect } from 'react';
import { CloseIcon, DownloadIcon, RemixIcon } from './icons';

interface ImageViewerProps {
  imageSrc: string;
  onClose: () => void;
  onDownload: () => void;
  onRemix: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageSrc, onClose, onDownload, onRemix }) => {
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageSrc}
          alt="선택된 배경화면"
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors"
          aria-label="이미지 뷰어 닫기"
        >
          <CloseIcon />
        </button>

        <div className="absolute bottom-6 flex space-x-4">
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 bg-slate-100 text-slate-800 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-slate-200 transition-transform transform hover:scale-105"
            aria-label="이미지 저장하기"
          >
            <DownloadIcon />
            저장하기
          </button>
          <button 
            onClick={onRemix}
            className="flex items-center gap-2 bg-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
            aria-label="같은 프롬프트로 다시 만들기"
          >
            <RemixIcon />
            리믹스
          </button>
        </div>
      </div>
    </div>
  );
};