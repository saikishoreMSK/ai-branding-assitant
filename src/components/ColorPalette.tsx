
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { type ColorPalette as ColorPaletteType, type Color } from "@/hooks/useColorGeneration";
import { Copy, Download, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ColorPaletteProps {
  palette: ColorPaletteType;
  onSave: () => void;
}

const ColorSwatch = ({ color }: { color: Color }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div 
      className="group relative flex flex-col animate-scale-up glass backdrop-blur-md p-4 rounded-lg soft-shadow"
    >
      <div 
        className="w-full h-24 rounded-md mb-2 transition-transform duration-300 group-hover:scale-[1.02]" 
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{color.name}</span>
        <div className="flex items-center justify-between mt-1">
          <span 
            className="text-xs text-foreground/70 hover:text-foreground cursor-pointer transition-colors"
            onClick={() => copyToClipboard(color.hex, "HEX code")}
          >
            {color.hex}
          </span>
          <button 
            className="text-foreground/50 hover:text-foreground transition-colors"
            onClick={() => copyToClipboard(color.hex, "HEX code")}
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ColorPalette = ({ palette, onSave }: ColorPaletteProps) => {
  const downloadPalette = () => {
    // Create a JSON blob with the palette data
    const blob = new Blob([JSON.stringify(palette, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${palette.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Palette downloaded successfully");
  };

  return (
    <div className="animate-fade-in">
      <GlassCard className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{palette.name}</h3>
              <p className="text-sm text-foreground/70 mt-1 line-clamp-1">{palette.description}</p>
            </div>
            <div className="flex gap-2">
              <AnimatedButton 
                variant="outline" 
                size="sm"
                onClick={downloadPalette}
                className="bg-background/50"
              >
                <Download size={16} className="mr-2" />
                Export
              </AnimatedButton>
              <AnimatedButton 
                size="sm"
                onClick={onSave}
              >
                <Save size={16} className="mr-2" />
                Save
              </AnimatedButton>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {palette.colors.map((color, index) => (
              <ColorSwatch key={`${color.hex}-${index}`} color={color} />
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
