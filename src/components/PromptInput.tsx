
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ChevronRight, Sparkles, Bot, Cpu } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { hasGitHubToken } from "@/services/githubAI";

interface PromptInputProps {
  onGeneratePalette: (prompt: string) => Promise<void>;
  isLoading: boolean;
  usingAI?: boolean;
  onToggleAI?: () => void;
}

export const PromptInput = ({ 
  onGeneratePalette, 
  isLoading, 
  usingAI = false, 
  onToggleAI 
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePalette(prompt);
  };

  const tokenExists = hasGitHubToken();
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 animate-fade-in">
        <label 
          htmlFor="prompt-input" 
          className="text-sm font-medium text-foreground/80"
        >
          Describe your brand or website
        </label>
        <Textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., A modern tech startup focused on sustainable energy solutions with a fresh, innovative feel..."
          className="min-h-[120px] resize-none bg-white transition-all focus-visible:ring-primary/40"
        />
        
        {/* Only show AI toggle if token exists and toggle is provided */}
        {tokenExists && onToggleAI && (
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center space-x-2">
              <Cpu size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Use AI generation</span>
            </div>
            <Switch 
              checked={usingAI} 
              onCheckedChange={onToggleAI}
            />
          </div>
        )}
        
        <div className="flex justify-end">
          <AnimatedButton 
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="mt-2"
            glowEffect
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">Generating</span>
                <span className="relative h-4 w-4">
                  <span className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></span>
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {usingAI && tokenExists ? (
                  <Bot size={16} className="text-primary-foreground" />
                ) : (
                  <Sparkles size={16} className="text-primary-foreground" />
                )}
                Generate Palette
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </AnimatedButton>
        </div>
      </div>
    </form>
  );
};
