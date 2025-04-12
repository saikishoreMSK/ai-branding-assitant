
import React from "react";
import { Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-6 flex items-center justify-center animate-fade-in">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center mr-3">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            Chromatic
          </h1>
          <p className="text-sm text-muted-foreground">AI Branding Assistant</p>
        </div>
      </div>
    </header>
  );
};
