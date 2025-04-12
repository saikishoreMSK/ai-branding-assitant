
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ColorPalette, Color, BrandingContent } from "@/hooks/useColorGeneration";

interface ThemePreviewProps {
  palette: ColorPalette | null;
}

// Helper function to calculate color brightness (0-255)
const getBrightness = (hex: string): number => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse the RGB components
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  
  // Calculate brightness using the formula (0.299*R + 0.587*G + 0.114*B)
  return (0.299 * r + 0.587 * g + 0.114 * b);
};

// Helper to determine if text should be dark or light based on background
const getContrastColor = (backgroundColor: string): string => {
  return getBrightness(backgroundColor) > 160 ? '#000000' : '#FFFFFF';
};

// Helper to find the best color for a specific purpose based on color properties
const findBestColorForPurpose = (colors: Color[], purpose: string): string => {
  // Sort colors based on different criteria depending on the purpose
  const sortedColors = [...colors];
  
  switch (purpose) {
    case "background":
      // Use the lightest color for background (highest brightness)
      sortedColors.sort((a, b) => getBrightness(b.hex) - getBrightness(a.hex));
      return sortedColors[0]?.hex || "#FFFFFF";
      
    case "text":
      // Use the darkest color for text (lowest brightness)
      sortedColors.sort((a, b) => getBrightness(a.hex) - getBrightness(b.hex));
      return sortedColors[0]?.hex || "#000000";
      
    case "primary":
      // Use a mid-brightness, more saturated color for primary
      // For simplicity, we'll use the middle color in the brightness-sorted array
      sortedColors.sort((a, b) => getBrightness(a.hex) - getBrightness(b.hex));
      return sortedColors[Math.floor(sortedColors.length / 2)]?.hex || "#3B82F6";
      
    case "secondary":
      // Use a light but not as light as background color for secondary
      sortedColors.sort((a, b) => getBrightness(b.hex) - getBrightness(a.hex));
      return sortedColors[1]?.hex || "#F0F9FF";
      
    case "accent":
      // Use a vibrant color that stands out for accent
      // We'll use the third color in the brightness-sorted array
      sortedColors.sort((a, b) => getBrightness(a.hex) - getBrightness(b.hex));
      const midIndex = Math.floor(sortedColors.length / 3);
      return sortedColors[midIndex]?.hex || "#EF4444";
      
    default:
      return "#CCCCCC";
  }
};

export const ThemePreview = ({ palette }: ThemePreviewProps) => {
  if (!palette) return null;
  
  const colors = palette.colors;
  const branding = palette.branding;
  
  // Intelligently assign colors based on their properties
  const backgroundColor = findBestColorForPurpose(colors, "background");
  const textColor = findBestColorForPurpose(colors, "text");
  const primaryColor = findBestColorForPurpose(colors, "primary");
  const secondaryColor = findBestColorForPurpose(colors, "secondary");
  const accentColor = findBestColorForPurpose(colors, "accent");
  
  // Ensure text has good contrast on various backgrounds
  const primaryTextColor = getContrastColor(primaryColor);
  const secondaryTextColor = getContrastColor(secondaryColor);
  const accentTextColor = getContrastColor(accentColor);
  
  return (
    <GlassCard className="mt-8 overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border/40">
        <h3 className="text-lg font-medium">Theme Preview</h3>
        <p className="text-sm text-foreground/70 mt-1">
          See how your color palette looks in a website layout
        </p>
      </div>
      
      <div className="p-6">
        <div 
          className="w-full rounded-lg overflow-hidden border border-border shadow-sm"
          style={{ backgroundColor }}
        >
          {/* Navigation Bar */}
          <div className="p-4 flex items-center justify-between border-b" style={{ 
            borderColor: `${textColor}20`,
            backgroundColor: `${primaryColor}05` 
          }}>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
              <span style={{ color: textColor, fontWeight: 600 }}>{branding?.title || "Brand Name"}</span>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ color: textColor }}>Home</span>
              <span style={{ color: textColor }}>About</span>
              <span style={{ color: textColor }}>Services</span>
              <span style={{ color: textColor }}>Contact</span>
            </div>
          </div>
          
          {/* Hero Section */}
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
                {branding?.title || "Welcome to Our Website"}
              </h2>
              <p className="text-center max-w-lg mb-4" style={{ color: textColor, opacity: 0.8 }}>
                {branding?.slogan || "This is how your website could look with this color palette. The colors are applied to different elements to create a cohesive design."}
              </p>
              <button 
                className="px-4 py-2 rounded-md"
                style={{ 
                  backgroundColor: primaryColor,
                  color: primaryTextColor
                }}
              >
                Get Started
              </button>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[0, 1, 2].map((index) => (
                <div 
                  key={index}
                  className="p-4 rounded-md"
                  style={{ backgroundColor: secondaryColor, color: secondaryTextColor }}
                >
                  <h3 className="font-medium mb-2">{`Feature ${index + 1}`}</h3>
                  <p className="text-sm" style={{ opacity: 0.8 }}>
                    {branding?.tips && branding.tips[index] 
                      ? branding.tips[index] 
                      : `Description of feature ${index + 1} for your product or service.`}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Call to Action Banner */}
            <div className="mt-8 p-4 rounded-md flex justify-between items-center" 
              style={{ 
                backgroundColor: accentColor,
                color: accentTextColor
              }}>
              <span>{branding?.slogan || "Special promotion!"}</span>
              <button 
                className="px-3 py-1 rounded"
                style={{ 
                  backgroundColor: accentTextColor,
                  color: accentColor
                }}
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t flex justify-between items-center text-sm" style={{ 
            borderColor: `${textColor}20`,
            backgroundColor: `${primaryColor}10`,
            color: textColor
          }}>
            <div>© 2025 {branding?.title || "Brand Name"}</div>
            <div className="flex gap-3">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
