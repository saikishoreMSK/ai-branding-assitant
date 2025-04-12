import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ColorPalette } from "@/hooks/useColorGeneration";
import { Input } from "@/components/ui/input";
import { Download, RotateCw, Wand2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { generateLogoWithGemini, hasGeminiKey } from "@/services/geminiAI";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LogoGeneratorProps {
  palette: ColorPalette | null;
}

export const LogoGenerator = ({ palette }: LogoGeneratorProps) => {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoGenerated, setLogoGenerated] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(hasGeminiKey());
  const [error, setError] = useState<string | null>(null);
  
  const hasGemini = hasGeminiKey();
  
  // Generate logo using Gemini Imagen API
  const generateLogo = async () => {
    if (!palette) {
      toast.error("Please generate a color palette first");
      return;
    }
    
    if (!brandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    
    // Reset previous error
    setError(null);
    setIsGenerating(true);
    
    try {
      if (useAI && hasGemini) {
        // Get colors from palette
        const colorHexCodes = palette.colors.map(color => color.hex);
        
        console.log("Starting logo generation with Gemini Imagen 3.0...");
        // Use Gemini API to generate logo
        const logoBase64 = await generateLogoWithGemini(
          brandName,
          brandDescription || palette.description,
          colorHexCodes
        );
        
        if (!logoBase64) {
          throw new Error("Failed to generate logo with Gemini API");
        }
        
        setLogoImage(`data:image/png;base64,${logoBase64}`);
        setLogoGenerated(true);
        toast.success("Logo generated successfully with AI!");
      } else {
        // Use fallback simple logo generation
        fallbackLogoGeneration();
      }
    } catch (error) {
      console.error("Error generating logo:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate logo";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Fallback to simple logo if AI fails
      if (useAI && hasGemini) {
        toast.info("Using fallback method instead");
        fallbackLogoGeneration();
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fallback logo generation - simple colored box with initials
  const fallbackLogoGeneration = () => {
    // Simulate API call delay
    setTimeout(() => {
      setLogoGenerated(true);
      setLogoImage(null); // Use the default JSX rendering for fallback
      toast.success("Logo generated with fallback method");
    }, 1000);
  };
  
  const regenerateLogo = async () => {
    setIsGenerating(true);
    // Reset previous error
    setError(null);
    
    try {
      // Just call the same generation method
      await generateLogo();
    } catch (error) {
      console.error("Error regenerating logo:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to regenerate logo";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadLogo = () => {
    if (!logoImage && !logoGenerated) {
      toast.error("No logo to download");
      return;
    }
    
    try {
      // If we have an actual image from Gemini
      if (logoImage) {
        const a = document.createElement("a");
        a.href = logoImage;
        a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Logo downloaded successfully");
      } else {
        // Fallback - capture the DOM element and convert to image
        const logoElement = document.getElementById('fallback-logo');
        if (!logoElement) {
          toast.error("Could not find logo element to download");
          return;
        }
        
        // Use html2canvas or similar library in a real app
        toast.info("In a production app, this would download the rendered logo");
      }
    } catch (error) {
      console.error("Error downloading logo:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to download logo";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  return (
    <GlassCard className="mt-8">
      <div className="px-6 py-4 border-b border-border/40">
        <h3 className="text-lg font-medium">Logo Generator</h3>
        <p className="text-sm text-foreground/70 mt-1">
          Create a unique logo using your generated color palette
        </p>
      </div>
      
      <div className="p-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* API Status Alert */}
        {!hasGemini && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Gemini API Not Configured</AlertTitle>
            <AlertDescription>
              Gemini API key not found. Logo generation will use a fallback method.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <div>
                <label 
                  htmlFor="brand-name" 
                  className="text-sm font-medium text-foreground/80 mb-2 block"
                >
                  Brand Name
                </label>
                <Input
                  id="brand-name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="bg-white"
                  disabled={!palette}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="brand-description" 
                  className="text-sm font-medium text-foreground/80 mb-2 block"
                >
                  Brand Description (Optional)
                </label>
                <Textarea
                  id="brand-description"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Describe your brand (or we'll use the palette description)"
                  className="bg-white min-h-[80px] text-sm"
                  disabled={!palette}
                />
              </div>
              
              {hasGemini && (
                <div className="flex items-center space-x-2 my-2">
                  <Switch 
                    id="use-ai" 
                    checked={useAI}
                    onCheckedChange={setUseAI}
                    disabled={!hasGemini}
                  />
                  <Label htmlFor="use-ai" className="text-sm">
                    Use AI Logo Generation (Gemini API)
                  </Label>
                </div>
              )}
              
              <div className="flex gap-2">
                <AnimatedButton
                  onClick={generateLogo}
                  disabled={isGenerating || !palette || !brandName.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Generating</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wand2 size={16} />
                      Generate Logo
                    </span>
                  )}
                </AnimatedButton>
                
                {logoGenerated && (
                  <AnimatedButton
                    variant="outline"
                    onClick={regenerateLogo}
                    disabled={isGenerating}
                  >
                    <RotateCw size={16} className={isGenerating ? "animate-spin" : ""} />
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
            {!logoGenerated ? (
              <div className="text-center text-muted-foreground">
                {palette ? (
                  <p>Enter your brand name and click generate</p>
                ) : (
                  <p>Generate a color palette first</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {logoImage ? (
                  // Actual generated logo from Gemini
                  <div className="w-40 h-40 flex items-center justify-center mb-4 overflow-hidden rounded-xl">
                    <img 
                      src={logoImage} 
                      alt={`${brandName} Logo`} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  // Fallback logo
                  <div 
                    id="fallback-logo" 
                    className="w-40 h-40 bg-gradient-to-br flex items-center justify-center rounded-xl text-white font-bold text-xl mb-4"
                    style={{
                      background: palette ? 
                        `linear-gradient(to bottom right, ${palette.colors[0].hex}, ${palette.colors[palette.colors.length > 2 ? 2 : 0].hex})` :
                        "linear-gradient(to bottom right, #3B82F6, #2563EB)"
                    }}
                  >
                    {brandName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={downloadLogo}
                >
                  <Download size={16} className="mr-2" />
                  Download Logo
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
        
        {/* API Details */}
      </div>
    </GlassCard>
  );
};
