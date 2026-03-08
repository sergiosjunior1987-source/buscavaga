import { Heart, Copy, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PIX_KEY = "51983006067";
const LINKEDIN_URL = "https://br.linkedin.com/in/s%C3%A9rgio-da-silva-junior-pcd-pwd-6a755a60";
const LINKEDIN_PHOTO = "https://media.licdn.com/dms/image/v2/D4D03AQH0y0z0z0z0zA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1700000000000?e=1700000000&v=beta&t=placeholder";

const DonationTab = () => {
  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave PIX copiada!");
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto text-center">
      <div className="bg-card border border-border rounded-2xl p-8 mt-4">
        {/* Profile section */}
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <span className="text-3xl font-bold text-primary">SJ</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">Sérgio da Silva Junior</h3>
          <p className="text-sm text-muted-foreground mb-3">Criador do Buscador de Oportunidades</p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            Ver perfil no LinkedIn
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="border-t border-border pt-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-primary" />
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
    </div>
  );
};

export default DonationTab;
