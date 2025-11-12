import { GoogleGenAI } from "@google/genai";

// Ensure API key is available in the environment variables.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates 4 phone wallpapers based on a user prompt.
 * @param prompt The user's description of the desired vibe.
 * @returns A promise that resolves to an array of 4 base64 encoded image data URLs.
 */
export const generateWallpapers = async (prompt: string): Promise<string[]> => {
    try {
        // Enhance the prompt for better wallpaper generation
        const enhancedPrompt = `폰 배경화면, ${prompt}, 9:16 비율, 고화질, 시선을 사로잡는, 영화적인, 아름다운`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: enhancedPrompt,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: '9:16',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("API가 이미지를 반환하지 않았습니다. 부적절한 프롬프트는 거부될 수 있어요.");
        }

        return response.generatedImages.map(img => {
            const base64ImageBytes = img.image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        });

    } catch (error) {
        console.error("Gemini API로 배경화면 생성 중 오류 발생:", error);
        if (error instanceof Error) {
            // Provide a more user-friendly error message
             if (error.message.includes('API key not valid')) {
                throw new Error('API 키가 유효하지 않아요. 설정을 다시 확인해주세요.');
            }
             if (error.message.includes('quota')) {
                throw new Error('API 할당량을 초과했습니다. 카드값이 부족하진 않은지 확인해보시거나, 나중에 다시 시도해주세요.');
            }
            throw new Error(`이미지 생성에 실패했습니다. ${error.message}`);
        }
        throw new Error("이미지 생성 서비스와 통신하는 중 알 수 없는 오류가 발생했습니다.");
    }
};