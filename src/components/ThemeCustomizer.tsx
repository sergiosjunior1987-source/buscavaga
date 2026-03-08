import { useState, useEffect } from "react";
import { Palette, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  accent: string;
  foreground: string;
};

const defaultColors: ThemeColors = {
  primary: "#2563b8",
  background: "#f5f6f8",
  card: "#ffffff",
  accent: "#1a9a6b",
  foreground: "#151a23",
};

const presets: { name: string; colors: ThemeColors }[] = [
  { name: "Padrão (Azul)", colors: defaultColors },
  { name: "Roxo Elegante", colors: { primary: "#7c3aed", background: "#f8f5ff", card: "#ffffff", accent: "#ec4899", foreground: "#1e1033" } },
  { name: "Verde Natureza", colors: { primary: "#16a34a", background: "#f0fdf4", card: "#ffffff", accent: "#0d9488", foreground: "#14271a" } },
  { name: "Laranja Quente", colors: { primary: "#ea580c", background: "#fff7ed", card: "#ffffff", accent: "#d97706", foreground: "#27150a" } },
  { name: "Modo Escuro", colors: { primary: "#3b82f6", background: "#0f172a", card: "#1e293b", accent: "#22d3ee", foreground: "#e2e8f0" } },
  { name: "Rosa Moderno", colors: { primary: "#e11d48", background: "#fff1f2", card: "#ffffff", accent: "#be185d", foreground: "#1c0a0f" } },
];

function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(hsl: string): string {
  const parts = hsl.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return "#000000";
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function applyColors(colors: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty("--primary", hexToHSL(colors.primary));
  root.style.setProperty("--ring", hexToHSL(colors.primary));
  root.style.setProperty("--background", hexToHSL(colors.background));
  root.style.setProperty("--card", hexToHSL(colors.card));
  root.style.setProperty("--popover", hexToHSL(colors.card));
  root.style.setProperty("--accent", hexToHSL(colors.accent));
  root.style.setProperty("--success", hexToHSL(colors.accent));
  root.style.setProperty("--foreground", hexToHSL(colors.foreground));
  root.style.setProperty("--card-foreground", hexToHSL(colors.foreground));
  root.style.setProperty("--popover-foreground", hexToHSL(colors.foreground));
}

const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem("theme-colors");
    return saved ? JSON.parse(saved) : defaultColors;
  });

  useEffect(() => {
    applyColors(colors);
  }, []);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    const updated = { ...colors, [key]: value };
    setColors(updated);
    applyColors(updated);
    localStorage.setItem("theme-colors", JSON.stringify(updated));
  };

  const applyPreset = (preset: ThemeColors) => {
    setColors(preset);
    applyColors(preset);
    localStorage.setItem("theme-colors", JSON.stringify(preset));
    toast.success("Tema aplicado!");
  };

  const resetColors = () => {
    setColors(defaultColors);
    applyColors(defaultColors);
    localStorage.removeItem("theme-colors");
    toast.success("Cores restauradas ao padrão");
  };

  const colorFields: { key: keyof ThemeColors; label: string }[] = [
    { key: "primary", label: "Cor Principal" },
    { key: "accent", label: "Cor de Destaque" },
    { key: "background", label: "Fundo" },
    { key: "card", label: "Cartões" },
    { key: "foreground", label: "Texto" },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Personalizar cores"
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl animate-fade-in overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Personalizar Cores
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Presets */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Temas prontos</p>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p.colors)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colors.primary }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colors.accent }} />
                      <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: p.colors.background }} />
                    </div>
                    <span className="text-[9px] text-muted-foreground leading-tight text-center">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom colors */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Cores personalizadas</p>
              <div className="space-y-2">
                {colorFields.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-foreground">{label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colors[key]}
                        onChange={(e) => updateColor(key, e.target.value)}
                        className="w-8 h-8 rounded-md border border-border cursor-pointer"
                      />
                      <span className="text-[10px] text-muted-foreground font-mono w-16">{colors[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={resetColors} className="w-full gap-2 text-xs">
              <RotateCcw className="w-3 h-3" />
              Restaurar Padrão
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeCustomizer;
