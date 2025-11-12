import React, { useState, useCallback } from 'react';
import { generateWallpapers } from './services/geminiService';
import { SparklesIcon } from './components/icons';
import { PromptInput } from './components/PromptInput';
import { ImageGrid } from './components/ImageGrid';
import { ImageViewer } from './components/ImageViewer';

// Helper components defined outside the main component to prevent re-creation on re-renders.

const SkeletonCard = () => (
    <div className="bg-slate-800/50 rounded-lg animate-pulse aspect-[9/16]"></div>
);

const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 w-full px-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
    </div>
);

const WelcomeMessage = () => (
    <div className="text-center mt-16 flex flex-col items-center px-4">
        <SparklesIcon className="w-16 h-16 text-cyan-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-100">AI 배경화면 짤 생성기</h2>
        <p className="text-slate-400 mt-2 max-w-sm">
            어떤 느낌을 원하시나요? 장면이나 스타일을 설명해주시면, AI가 완벽한 배경화면 짤을 만들어 드려요.
        </p>
    </div>
);

const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="text-center mt-16 flex flex-col items-center px-4 bg-red-900/20 border border-red-500/30 rounded-lg py-8 mx-4">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-red-300">이런! 문제가 발생했어요</h2>
        <p className="text-red-400 mt-2 max-w-sm">{message}</p>
        <button onClick={onRetry} className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            다시 만들어볼래요
        </button>
    </div>
);


export default function App() {
    const [lastSuccessfulPrompt, setLastSuccessfulPrompt] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleGenerate = useCallback(async (prompt: string) => {
        if (!prompt || isLoading) return;

        setIsLoading(true);
        setError(null);
        setImages([]); // Clear previous images for a better loading experience

        try {
            const generatedImages = await generateWallpapers(prompt);
            setImages(generatedImages);
            setLastSuccessfulPrompt(prompt);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleRemix = useCallback(() => {
        if (lastSuccessfulPrompt) {
            setSelectedImage(null);
            // Wait for modal to close before starting new generation
            setTimeout(() => handleGenerate(lastSuccessfulPrompt), 100);
        }
    }, [lastSuccessfulPrompt, handleGenerate]);
    
    const handleDownload = useCallback(() => {
        if (!selectedImage) return;
        const link = document.createElement('a');
        link.href = selectedImage;
        const promptPart = lastSuccessfulPrompt.substring(0, 20).replace(/\s/g, '_');
        link.download = `ai_wallpaper_${promptPart}_${Date.now()}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [selectedImage, lastSuccessfulPrompt]);

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSkeleton />;
        }
        if (error) {
            return <ErrorDisplay message={error} onRetry={() => handleGenerate(lastSuccessfulPrompt || '비 오는 사이버펑크 도시의 로파이 감성 골목길')} />;
        }
        if (images.length > 0) {
            return <ImageGrid images={images} onImageSelect={setSelectedImage} />;
        }
        return <WelcomeMessage />;
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center">
            <header className="w-full text-center p-4 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    AI 배경화면 짤 생성기
                </h1>
            </header>

            <main className="flex-grow w-full max-w-2xl flex flex-col items-center pb-32">
                {renderContent()}
            </main>
            
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

            {selectedImage && (
                <ImageViewer
                    imageSrc={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    onDownload={handleDownload}
                    onRemix={handleRemix}
                />
            )}
        </div>
    );
}