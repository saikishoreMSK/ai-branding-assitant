
import { toast } from "sonner";

// GitHub AI model configuration
const ENDPOINT = "https://models.inference.ai.azure.com";
const MODEL_NAME = "Llama-3.3-70B-Instruct";

// Error for missing token
class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

/**
 * Helper to retrieve GitHub token from environment variable
 */
export const getGitHubToken = (): string => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) {
    throw new TokenError("GitHub token not found in environment variables.");
  }
  return token;
};

/**
 * Check if GitHub token exists in environment variables
 */
export const hasGitHubToken = (): boolean => {
  return !!import.meta.env.VITE_GITHUB_TOKEN;
};

/**
 * Generate color palette using GitHub AI model
 */
export const generateColorPaletteWithAI = async (prompt: string): Promise<any> => {
  try {
    const token = getGitHubToken();
    
    const response = await fetch(`${ENDPOINT}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "You are a color palette generator. Generate 5 harmonious colors for a website based on the user's description. Return ONLY a JSON object with the following structure: {\"colors\": [{\"hex\": \"#XXXXXX\", \"name\": \"Color Name\", \"rgb\": \"rgb(XXX, XXX, XXX)\"}]}. Do not include any explanation or additional text." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 500,
        model: MODEL_NAME
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate color palette");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid response format from AI model");
    }
  } catch (error) {
    if (error instanceof TokenError) {
      console.error(error.message);
      toast.error("GitHub AI token not configured. Please check your environment variables.");
    } else {
      console.error("AI generation error:", error);
      toast.error("Failed to generate palette with AI. Please try again.");
    }
    throw error;
  }
};

/**
 * Generate branding content using GitHub AI model
 */
export const generateBrandingWithAI = async (prompt: string): Promise<any> => {
  try {
    const token = getGitHubToken();
    
    const response = await fetch(`${ENDPOINT}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "You are a branding expert. Based on the user's description, generate a brand title, a catchy slogan, and 3-5 practical tips to improve the brand. Return ONLY a JSON object with the following structure: {\"title\": \"Brand Title\", \"slogan\": \"Catchy Slogan\", \"tips\": [\"Tip 1\", \"Tip 2\", \"Tip 3\"]}. The title should be short and memorable. The slogan should be catchy and reflect the brand's values. Tips should be actionable and specific. Do not include any explanation or additional text." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        top_p: 1.0,
        max_tokens: 800,
        model: MODEL_NAME
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate branding content");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid response format from AI model");
    }
  } catch (error) {
    if (error instanceof TokenError) {
      console.error(error.message);
      toast.error("GitHub AI token not configured. Please check your environment variables.");
    } else {
      console.error("AI generation error:", error);
      toast.error("Failed to generate branding content with AI. Please try again.");
    }
    throw error;
  }
};
