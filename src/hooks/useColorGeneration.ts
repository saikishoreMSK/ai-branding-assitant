
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { generateColorPaletteWithAI, generateBrandingWithAI, hasGitHubToken } from "@/services/githubAI";

// Types
export type Color = {
  hex: string;
  name: string;
  rgb: string;
};

export type BrandingContent = {
  title: string;
  slogan: string;
  tips: string[];
};

export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  colors: Color[];
  timestamp: number;
  branding?: BrandingContent;
};

// Fallback color generation function
const generateColorsFromPrompt = (prompt: string): Color[] => {
  // Mock function - in a real app this would call an AI API
  const seedColors = [
    { hex: "#F8FAFC", name: "Background", rgb: "rgb(248, 250, 252)" },
    { hex: "#0F172A", name: "Text", rgb: "rgb(15, 23, 42)" },
    { hex: "#3B82F6", name: "Primary", rgb: "rgb(59, 130, 246)" },
    { hex: "#F0F9FF", name: "Secondary", rgb: "rgb(240, 249, 255)" },
    { hex: "#EF4444", name: "Accent", rgb: "rgb(239, 68, 68)" },
  ];
  
  // For demonstration, just return the seed colors
  // A real implementation would analyze the prompt and generate appropriate colors
  return seedColors;
};

// Fallback branding generation function
const generateBrandingFromPrompt = (prompt: string): BrandingContent => {
  return {
    title: "My Brand",
    slogan: "Creating innovative solutions",
    tips: [
      "Focus on customer experience",
      "Maintain consistent visual identity",
      "Engage on social media regularly"
    ]
  };
};

export const useColorGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [usingAI, setUsingAI] = useState(hasGitHubToken());
  
  // Initialize AI mode based on token availability
  useEffect(() => {
    const tokenAvailable = hasGitHubToken();
    setUsingAI(tokenAvailable);
    
    if (tokenAvailable) {
      console.log("GitHub AI token found in environment variables");
    } else {
      console.log("No GitHub AI token found in environment variables");
    }
  }, []);
  
  const generatePalette = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your brand");
      return;
    }
    
    setIsLoading(true);
    
    try {
      let colors: Color[];
      let branding: BrandingContent | undefined;
      
      if (usingAI && hasGitHubToken()) {
        // Use GitHub AI to generate colors
        try {
          const [colorResult, brandingResult] = await Promise.all([
            generateColorPaletteWithAI(prompt),
            generateBrandingWithAI(prompt)
          ]);
          
          colors = colorResult.colors;
          branding = brandingResult;
          
          if (!colors || !Array.isArray(colors) || colors.length === 0) {
            throw new Error("Invalid color response format");
          }
          
          if (!branding || !branding.title || !branding.slogan || !Array.isArray(branding.tips)) {
            console.warn("Invalid branding response format, using fallback");
            branding = generateBrandingFromPrompt(prompt);
          }
        } catch (error) {
          console.error("Error with AI generation:", error);
          toast.error("AI generation failed, using fallback method");
          colors = generateColorsFromPrompt(prompt);
          branding = generateBrandingFromPrompt(prompt);
        }
      } else {
        // Use fallback method
        colors = generateColorsFromPrompt(prompt);
        branding = generateBrandingFromPrompt(prompt);
      }
      
      const newPalette: ColorPalette = {
        id: Date.now().toString(),
        name: branding?.title || `Palette ${savedPalettes.length + 1}`,
        description: prompt,
        colors,
        timestamp: Date.now(),
        branding
      };
      
      setCurrentPalette(newPalette);
      toast.success("Brand content generated successfully!");
    } catch (error) {
      console.error("Error generating palette:", error);
      toast.error("Failed to generate palette. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const savePalette = () => {
    if (!currentPalette) return;
    
    setSavedPalettes(prev => [currentPalette, ...prev]);
    toast.success("Palette saved to your collection!");
  };
  
  const deletePalette = (id: string) => {
    setSavedPalettes(prev => prev.filter(palette => palette.id !== id));
    toast.success("Palette removed from your collection");
  };
  
  const toggleAIMode = () => {
    if (!hasGitHubToken() && !usingAI) {
      toast.error("GitHub AI token not configured in environment variables");
      return;
    }
    
    setUsingAI(prev => !prev);
    toast.info(usingAI ? "Switched to fallback mode" : "Switched to AI mode");
  };
  
  return {
    isLoading,
    currentPalette,
    savedPalettes,
    generatePalette,
    savePalette,
    deletePalette,
    usingAI,
    toggleAIMode,
  };
};
