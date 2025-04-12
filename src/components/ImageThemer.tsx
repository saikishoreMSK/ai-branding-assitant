import React, { useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ColorPalette, Color } from "@/hooks/useColorGeneration";
import { Upload, Image as ImageIcon, RotateCw, Download, Plus, Trash, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { editImageWithGemini, fileToBase64, hasGeminiKey } from "@/services/geminiAI";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImageThemerProps {
  palette: ColorPalette | null;
}

export const ImageThemer = ({ palette }: ImageThemerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [themedImage, setThemedImage] = useState<string | null>(null);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [customColors, setCustomColors] = useState<Color[]>([
    { hex: "#FFFFFF", name: "Background", rgb: "rgb(255, 255, 255)" },
    { hex: "#000000", name: "Primary", rgb: "rgb(0, 0, 0)" },
  ]);
  const [error, setError] = useState<string | null>(null);
  
  const hasGemini = hasGeminiKey();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset previous error
    setError(null);
    
    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setOriginalImageFile(file);
      setThemedImage(null); // Reset themed image when uploading a new one
      setIsUploading(false);
    };
    reader.onerror = (err) => {
      const errorMessage = "Failed to read the image file";
      console.error(errorMessage, err);
      toast.error(errorMessage);
      setError(errorMessage);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  const applyPaletteToImage = async () => {
    if ((!palette && !useCustomColors) || (useCustomColors && customColors.length === 0) || !originalImage || !originalImageFile) {
      toast.error("Please ensure you have colors selected and an image uploaded");
      return;
    }
    
    // Reset previous error
    setError(null);
    setIsProcessing(true);
    
    try {
      // Get colors from either palette or custom colors
      const colors = useCustomColors ? customColors : (palette?.colors || []);
      
      if (colors.length === 0) {
        throw new Error("No colors available to apply to the image");
      }
      
      // Extract color information
      const colorHexCodes = colors.map(color => color.hex);
      const colorNames = colors.map(color => color.name);
      
      // Convert image to base64 for the API
      const imageBase64 = await fileToBase64(originalImageFile);
      if (!imageBase64) {
        throw new Error("Failed to convert image to base64");
      }
      
      // Use Gemini to edit the image with the color palette
      console.log("Sending image to Gemini API...");
      const editedImageBase64 = await editImageWithGemini(imageBase64, colorHexCodes, colorNames);
      
      if (!editedImageBase64) {
        throw new Error("Failed to edit image with Gemini API");
      }
      
      // Set the themed image
      setThemedImage(`data:image/png;base64,${editedImageBase64}`);
      toast.success("Image themed successfully with Gemini!");
    } catch (error) {
      console.error("Error theming image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to theme image. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      
      // If Gemini API fails, use fallback method
      if (!hasGemini) {
        toast.info("Using fallback method since Gemini API is not available");
        setThemedImage(originalImage); // Fallback to original image
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const downloadThemedImage = () => {
    if (!themedImage) {
      toast.error("No themed image to download");
      return;
    }
    
    try {
      // Create a download link
      const a = document.createElement("a");
      a.href = themedImage;
      a.download = "themed-image.png";
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      
      toast.success("Themed image downloaded successfully");
    } catch (error) {
      console.error("Error downloading image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to download image";
      toast.error(errorMessage);
    }
  };

  const addCustomColor = () => {
    setCustomColors([...customColors, { 
      hex: "#CCCCCC", 
      name: `Color ${customColors.length + 1}`, 
      rgb: "rgb(204, 204, 204)" 
    }]);
  };

  const updateCustomColor = (index: number, hex: string) => {
    const newColors = [...customColors];
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    newColors[index] = {
      ...newColors[index],
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`
    };
    
    setCustomColors(newColors);
  };

  const updateColorName = (index: number, name: string) => {
    const newColors = [...customColors];
    newColors[index] = { ...newColors[index], name };
    setCustomColors(newColors);
  };

  const removeCustomColor = (index: number) => {
    if (customColors.length <= 2) {
      toast.error("You need at least two colors");
      return;
    }
    setCustomColors(customColors.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            {/* API Status Alert */}
            {!hasGemini && (
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Gemini API Not Configured</AlertTitle>
                <AlertDescription>
                  Gemini API key not found. Image theming will use a fallback method.
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Color Settings Section */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Color Settings</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="usePalette"
                    checked={!useCustomColors}
                    onChange={() => setUseCustomColors(false)}
                    className="mr-2"
                    disabled={!palette}
                  />
                  <label htmlFor="usePalette" className={cn("text-sm", !palette && "text-muted-foreground")}>
                    Use generated palette
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="useCustom"
                    checked={useCustomColors}
                    onChange={() => setUseCustomColors(true)}
                    className="mr-2"
                  />
                  <label htmlFor="useCustom" className="text-sm">
                    Use custom colors
                  </label>
                </div>
              </div>
            </div>
            
            {/* Custom Colors Section */}
            {useCustomColors && (
              <div className="space-y-3 mb-4 p-4 border border-border/40 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Custom Colors</h4>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    onClick={addCustomColor}
                    className="h-8"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Color
                  </AnimatedButton>
                </div>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {customColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-background/80 p-2 rounded-md">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateCustomColor(index, e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={color.name}
                        onChange={(e) => updateColorName(index, e.target.value)}
                        className="flex-1 h-8 text-xs"
                        placeholder="Color name"
                      />
                      <button
                        onClick={() => removeCustomColor(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image Upload Section */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground/80">Upload Image</span>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="flex items-center gap-2 bg-white border border-border rounded-md px-4 py-2 text-sm">
                  <Upload size={16} className="text-foreground/70" />
                  <span>{originalImage ? "Change image" : "Select image"}</span>
                </div>
              </div>
            </label>
            
            {/* Action Buttons */}
            <AnimatedButton
              onClick={applyPaletteToImage}
              disabled={isProcessing || !originalImage || (!useCustomColors && !palette) || (useCustomColors && customColors.length === 0)}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Processing</span>
                  <span className="relative h-4 w-4">
                    <span className="absolute inset-0 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"></span>
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ImageIcon size={16} />
                  Apply Colors to Image
                </span>
              )}
            </AnimatedButton>
            
            {themedImage && (
              <AnimatedButton
                variant="outline"
                onClick={downloadThemedImage}
              >
                <Download size={16} className="mr-2" />
                Download Themed Image
              </AnimatedButton>
            )}
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Original</p>
            <div className="w-full aspect-square bg-secondary/50 rounded-lg overflow-hidden flex items-center justify-center">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Themed</p>
            <div className="w-full aspect-square bg-secondary/50 rounded-lg overflow-hidden flex items-center justify-center">
              {themedImage ? (
                <img
                  src={themedImage}
                  alt="Themed"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center text-xs text-muted-foreground px-4">
                  {originalImage ? "Click 'Apply Colors' to see the result" : "Upload an image first"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Color Palette Preview */}
      <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
        <h3 className="text-sm font-medium mb-3">Colors Being Applied</h3>
        <div className="flex flex-wrap gap-2">
          {useCustomColors ? (
            customColors.map((color, index) => (
              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-background rounded-md text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </div>
            ))
          ) : palette ? (
            palette.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-background rounded-md text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">No colors selected</div>
          )}
        </div>
      </div>
    </div>
  );
};
