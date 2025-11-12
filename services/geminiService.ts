import { GoogleGenAI } from "@google/genai";

// Ensure API key is available in the environment variables.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
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
        const enhancedPrompt = `phone wallpaper, ${prompt}, 9:16 aspect ratio, high resolution, visually stunning, cinematic, beautiful`;

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
            throw new Error("The API did not return any images. The prompt may have been rejected.");
        }

        return response.generatedImages.map(img => {
            const base64ImageBytes = img.image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        });

    } catch (error) {
        console.error("Error generating wallpapers with Gemini API:", error);
        if (error instanceof Error) {
            // Provide a more user-friendly error message
             if (error.message.includes('API key not valid')) {
                throw new Error('The provided API key is not valid. Please check your configuration.');
            }
             if (error.message.includes('quota')) {
                throw new Error('You have exceeded your API quota. Please check your billing account or try again later.');
            }
            throw new Error(`Failed to generate images. ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the image generation service.");
    }
};