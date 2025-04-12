import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { hasGitHubToken } from "@/services/githubAI";
import { KeyRound, Check, X } from "lucide-react";
import { toast } from "sonner";

export const TokenManager = () => {
  const [token, setToken] = useState("");
  const [showInput, setShowInput] = useState(false);
  const tokenExists = hasGitHubToken();

  const handleSaveToken = () => {
    if (!token.trim()) {
      toast.error("Please enter a valid token");
      return;
    }
    
    try {
      localStorage.setItem("github_ai_token", token);
      toast.success("Token saved successfully");
      setToken("");
      setShowInput(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save token");
    }
  };

  return (
    <div className="mb-4">
      {showInput ? (
        <div className="flex flex-col space-y-2 animate-fade-in">
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your GitHub token"
              className="flex-1"
            />
            <AnimatedButton
              size="sm"
              onClick={handleSaveToken}
              variant="outline"
              className="bg-background/50"
            >
              <Check size={16} />
            </AnimatedButton>
            <AnimatedButton
              size="sm"
              onClick={() => setShowInput(false)}
              variant="outline"
              className="bg-background/50"
            >
              <X size={16} />
            </AnimatedButton>
          </div>
          <p className="text-xs text-muted-foreground">
            Your token will be stored locally and used for AI model access.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyRound size={16} className={tokenExists ? "text-green-500" : "text-amber-500"} />
            <span className="text-sm">
              {tokenExists 
                ? "GitHub AI token is configured" 
                : "GitHub AI token not set"}
            </span>
          </div>
          <AnimatedButton 
            size="sm" 
            variant="outline" 
            onClick={() => setShowInput(true)}
            className="bg-background/50"
          >
            {tokenExists ? "Update Token" : "Set Token"}
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};
