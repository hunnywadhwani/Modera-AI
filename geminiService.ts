
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelConfig } from "../types";

// Primary model: High quality, supports imageSize config
const HQ_MODEL = 'gemini-3-pro-image-preview';
// Fallback model: Standard quality, does NOT support imageSize config
const STD_MODEL = 'gemini-2.5-flash-image';

/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extracts the base64 image data from the Gemini response.
 */
const extractImageFromResponse = (response: GenerateContentResponse): string => {
  if (!response.candidates?.[0]?.content?.parts) {
    throw new Error("No content received from generation model.");
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }

  throw new Error("No image data found in response.");
};

/**
 * Generates a fashion model image based on the product image and configuration.
 * Implements a fallback mechanism to handle permission errors on the preview model.
 */
export const generateModelImage = async (
  productImageBase64: string,
  mimeType: string,
  config: ModelConfig
): Promise<string> => {
  
  // Ensure API key is present in environment (injected by the environment)
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please select a key.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct a detailed prompt for the fashion generation
  const prompt = `
    Create a high-end, photorealistic fashion studio photograph.
    
    SUBJECT: A ${config.ageGroup} ${config.gender} model with ${config.skinTone} skin tone.
    
    CLOTHING: The model is wearing the EXACT clothing item provided in the input image. 
    The clothing must fit perfectly on the model's body with realistic fabric drapes, shadows, folds, and texture.
    The clothing type, pattern, and color must match the input image exactly.
    
    POSE & SETTING: The model is posing in a ${config.pose} stance.
    CAMERA ANGLE: The camera view is ${config.view}.
    The overall style is ${config.style}.
    The background is a neutral, professional studio backdrop with soft, high-quality lighting emphasizing the product details.
    
    QUALITY: Masterpiece, 8k, highly detailed, commercial fashion photography, vogue style, sharp focus, cinematic lighting.
  `;

  const runGeneration = async (model: string, isHighQuality: boolean) => {
    const imageConfig: any = {
      aspectRatio: "3:4", // Standard fashion portrait ratio
    };

    // imageSize is only supported by the 'gemini-3-pro-image-preview' model
    if (isHighQuality) {
      imageConfig.imageSize = "2K"; 
    }

    return await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: productImageBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        imageConfig: imageConfig,
      },
    });
  };

  try {
    // Attempt with HQ model first
    console.log(`Generating with ${HQ_MODEL}...`);
    const response = await runGeneration(HQ_MODEL, true);
    return extractImageFromResponse(response);

  } catch (error: any) {
    console.warn(`HQ generation failed with error: ${error.message}`);

    // Check for permission or not found errors (403/404)
    const isAccessError = 
      error.message?.includes('403') || 
      error.message?.includes('PERMISSION_DENIED') || 
      error.message?.includes('404') || 
      error.message?.includes('NOT_FOUND') ||
      error.message?.includes('Requested entity was not found');

    if (isAccessError) {
      console.log(`Falling back to ${STD_MODEL}...`);
      try {
        const response = await runGeneration(STD_MODEL, false);
        return extractImageFromResponse(response);
      } catch (fallbackError: any) {
        // If fallback also fails, throw the fallback error (likely authentication issue)
        throw fallbackError;
      }
    }
    
    // If it's another type of error (e.g. overloaded, safety), throw original
    throw error;
  }
};

// Helper to check for API key capability
export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openApiKeySelector = async (): Promise<void> => {
    if(window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
    }
}
