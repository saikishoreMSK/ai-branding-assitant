
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { type BrandingContent } from "@/hooks/useColorGeneration";
import { Lightbulb, Quote, Sparkles } from "lucide-react";

interface BrandingSuggestionsProps {
  branding: BrandingContent | undefined;
}

export const BrandingSuggestions = ({ branding }: BrandingSuggestionsProps) => {
  if (!branding) return null;
  
  return (
    <GlassCard className="mt-8 overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border/40">
        <h3 className="text-lg font-medium">Brand Identity Suggestions</h3>
        <p className="text-sm text-foreground/70 mt-1">
          AI-generated branding ideas based on your description
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Brand Title */}
        <div className="flex items-start space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <h4 className="text-md font-semibold">Brand Title</h4>
            <p className="text-2xl mt-1 font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              {branding.title}
            </p>
          </div>
        </div>
        
        {/* Brand Slogan */}
        <div className="flex items-start space-x-3">
          <div className="bg-secondary/30 p-2 rounded-lg">
            <Quote size={18} className="text-secondary-foreground" />
          </div>
          <div>
            <h4 className="text-md font-semibold">Slogan</h4>
            <p className="text-lg mt-1 italic text-foreground/90">"{branding.slogan}"</p>
          </div>
        </div>
        
        {/* Brand Tips */}
        <div className="flex items-start space-x-3">
          <div className="bg-accent/10 p-2 rounded-lg">
            <Lightbulb size={18} className="text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="text-md font-semibold">Improvement Tips</h4>
            <ul className="mt-2 space-y-2">
              {branding.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="inline-flex items-center justify-center bg-accent/20 text-accent rounded-full w-6 h-6 text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground/80">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
