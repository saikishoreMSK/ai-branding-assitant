
import React from "react";
import { Header } from "@/components/Header";
import { PromptInput } from "@/components/PromptInput";
import { ColorPalette } from "@/components/ColorPalette";
import { LogoGenerator } from "@/components/LogoGenerator";
import { ImageThemer } from "@/components/ImageThemer";
import { ThemePreview } from "@/components/ThemePreview";
import { BrandingSuggestions } from "@/components/BrandingSuggestions";
import { useColorGeneration } from "@/hooks/useColorGeneration";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Palette, Sparkles } from "lucide-react";

const Index = () => {
  const {
    isLoading,
    currentPalette,
    savedPalettes,
    generatePalette,
    savePalette,
    deletePalette,
    usingAI,
    toggleAIMode,
  } = useColorGeneration();

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-white to-accent/20">
      <div className="w-full max-w-6xl px-4 pb-16">
        <Header />
        
        {/* Heading */}
        <div className="mt-8 text-center max-w-3xl mx-auto animate-slide-down">
          <h2 className="text-3xl font-bold tracking-tight">
            Transform Your Brand Identity with AI
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Generate beautiful color palettes, logos, and themed images with our AI-powered branding assistant.
          </p>
        </div>
        
        {/* Main content */}
        <div className="mt-12">
          <GlassCard className="mb-8">
            <div className="px-6 py-4 border-b border-border/40">
              <h3 className="text-lg font-medium">Chromatic AI Branding Assistant</h3>
              <p className="text-sm text-foreground/70 mt-1">
                Choose a tab to get started with your branding journey
              </p>
            </div>
            <div className="p-6">
              <Tabs defaultValue="color-palette" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="color-palette" className="flex items-center gap-2">
                    <Palette size={16} />
                    <span className="hidden sm:inline">Color Palette</span>
                  </TabsTrigger>
                  <TabsTrigger value="image-conversion" className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    <span className="hidden sm:inline">Image Conversion</span>
                  </TabsTrigger>
                  <TabsTrigger value="logo-generator" className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="hidden sm:inline">Logo Generator</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Color Palette Tab */}
                <TabsContent value="color-palette" className="animate-fade-in">
                  <div className="space-y-8">
                    <PromptInput 
                      onGeneratePalette={generatePalette} 
                      isLoading={isLoading}
                      usingAI={usingAI}
                      onToggleAI={toggleAIMode}
                    />
                    
                    {currentPalette && (
                      <div className="space-y-8 animate-fade-in">
                        <ColorPalette palette={currentPalette} onSave={savePalette} />
                        <ThemePreview palette={currentPalette} />
                        <BrandingSuggestions branding={currentPalette.branding} />
                      </div>
                    )}
                    
                    {/* Saved palettes */}
                    {savedPalettes.length > 0 && (
                      <div className="mt-16">
                        <h3 className="text-xl font-semibold mb-4">Saved Palettes</h3>
                        <div className="grid gap-6">
                          {savedPalettes.map((palette) => (
                            <ColorPalette
                              key={palette.id}
                              palette={palette}
                              onSave={() => deletePalette(palette.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Image Conversion Tab */}
                <TabsContent value="image-conversion" className="animate-fade-in">
                  <ImageThemer palette={currentPalette} />
                </TabsContent>
                
                {/* Logo Generator Tab */}
                <TabsContent value="logo-generator" className="animate-fade-in">
                  {currentPalette ? (
                    <LogoGenerator palette={currentPalette} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You need to generate a color palette first.</p>
                      <p className="text-sm">Switch to the Color Palette tab to create one.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-6 border-t border-border/20 bg-secondary/30 mt-auto">
        <div className="container flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
          <p>© 2023 Chromatic AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
