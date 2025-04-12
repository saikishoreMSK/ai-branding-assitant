
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

// Check if Gemini API key is available
export const hasGeminiKey = (): boolean => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
};

// Get Gemini API key
export const getGeminiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
};

// Convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Convert base64 to Blob/File for display
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

// Edit image with Gemini API using color palette
export const editImageWithGemini = async (
  imageBase64: string,
  colorHexCodes: string[],
  colorNames: string[]
): Promise<string | null> => {
  if (!hasGeminiKey()) {
    const error = new Error("Gemini API key not configured");
    console.error(error);
    toast.error(error.message);
    return null;
  }
  
  try {
    // Validate API key format
    const apiKey = getGeminiKey();
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const error = new Error("Invalid Gemini API key format");
      console.error(error);
      toast.error(error.message);
      return null;
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare color description for the prompt
    const colorDescription = colorHexCodes.map((hex, i) => 
      `${colorNames[i]}: ${hex}`
    ).join(", ");
    
    const promptText = `Edit this image using the following color palette: ${colorDescription}. 
    Apply these colors in a natural and aesthetically pleasing way that respects the image content.
    Make sure the result looks professional and the colors blend well together.`;
    
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: "image/png",
          data: imageBase64,
        },
      },
    ];
    
    console.log("Sending request to Gemini API for image editing...");
    console.log("Using model: gemini-2.0-flash-exp-image-generation");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Empty response from Gemini API");
    }
    
    // Extract the image from the response
    const parts = response.candidates[0].content.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts in Gemini API response");
    }
    
    for (const part of parts) {
      if (part.inlineData) {
        console.log("Received edited image from Gemini API");
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data in response from Gemini API");
  } catch (error) {
    // Log full error details for debugging
    console.error("Error in Gemini image editing:", error);
    const errorMessage = error instanceof Error 
      ? `Error: ${error.message}` 
      : "Unknown error occurred with Gemini API";
    toast.error(errorMessage);
    return null;
  }
};

// Generate a logo using Gemini API
export const generateLogoWithGemini = async (
  brandName: string, 
  description: string,
  colors: string[]
): Promise<string | null> => {
  if (!hasGeminiKey()) {
    const error = new Error("Gemini API key not configured");
    console.error(error);
    toast.error(error.message);
    return null;
  }
  
  try {
    // Validate API key format
    const apiKey = getGeminiKey();
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const error = new Error("Invalid Gemini API key format");
      console.error(error);
      toast.error(error.message);
      return null;
    }
    
    console.log("Initializing GoogleGenAI with API key...");
    const ai = new GoogleGenAI({ apiKey });
    
    // Create a professional logo prompt
    const colorList = colors.join(", ");
    const prompt = `Create a professional, minimalist logo for a brand named "${brandName}". 
    The brand is about: ${description}. 
    Use these colors: ${colorList}. 
    Make it clean, modern and memorable, suitable for a company website and marketing materials.
    Do not include any text in the logo.`;
    
    console.log("Generating logo with Gemini 2.0 Flash...");
    console.log("Using model: gemini-2.0-flash-exp-image-generation");
    console.log("Prompt:", prompt);
    
    // Using generateContent method for Gemini 2.0 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });
    
    console.log("Response received:", response);
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }
    
    // Extract base64 image from the response parts
    const parts = response.candidates[0].content.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts in Gemini API response");
    }
    
    // Find the image in the response parts
    for (const part of parts) {
      if (part.inlineData) {
        console.log("Successfully generated logo with Gemini 2.0 Flash");
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data in response from Gemini API");
  } catch (error) {
    // Log full error details for debugging
    console.error("Error generating logo with Gemini:", error);
    const errorMessage = error instanceof Error 
      ? `Logo generation error: ${error.message}` 
      : "Unknown error occurred with Gemini API";
    toast.error(errorMessage);
    throw error; // Re-throw to enable proper error handling in the component
  }
};
