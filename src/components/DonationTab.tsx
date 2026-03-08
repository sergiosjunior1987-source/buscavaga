import { Heart, Copy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PIX_KEY = "51983006067";

const DonationTab = () => {
  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave PIX copiada!");
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto text-center">
      <div className="glass-card rounded-2xl p-8 mt-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">Apoie este projeto</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Se este sistema lhe ajudou a encontrar oportunidades e você deseja retribuir, 
          ficaremos muito gratos pela sua contribuição! Qualquer valor faz a diferença. 💙
        </p>

        <div className="bg-background rounded-lg border border-border/50 p-5 mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Chave PIX (Telefone)
          </p>
          <p className="text-xl font-mono font-bold text-foreground tracking-wider mb-4">
            {PIX_KEY}
          </p>
          <Button onClick={copyPix} className="gap-2">
            <Copy className="w-4 h-4" />
            Copiar Chave PIX
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Este é um sistema 100% gratuito. Doações são voluntárias e opcionais.
        </p>
      </div>
    </div>
  );
};

export default DonationTab;
