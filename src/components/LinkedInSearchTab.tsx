import { useState } from "react";
import { Search, Copy, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const regions = [
  "Brasil",
  "São Paulo",
  "Rio de Janeiro",
  "Rio Grande do Sul",
  "Minas Gerais",
  "Paraná",
  "Santa Catarina",
  "Bahia",
  "Distrito Federal",
  "Pernambuco",
  "Ceará",
  "Goiás",
];

const LinkedInSearchTab = () => {
  const [cargo, setCargo] = useState("");
  const [regiao, setRegiao] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [searchString, setSearchString] = useState("");

  const generateSearchString = () => {
    if (!cargo.trim()) {
      toast.error("Informe pelo menos o cargo desejado.");
      return;
    }

    const parts: string[] = [];

    // Cargo com aspas para busca exata
    parts.push(`"${cargo.trim()}"`);

    // Região
    if (regiao.trim()) {
      parts.push(`"${regiao.trim()}"`);
    }

    // Habilidades como OR
    if (habilidades.trim()) {
      const skills = habilidades
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skills.length > 1) {
        parts.push(`(${skills.map((s) => `"${s}"`).join(" OR ")})`);
      } else if (skills.length === 1) {
        parts.push(`"${skills[0]}"`);
      }
    }

    // Empresa
    if (empresa.trim()) {
      parts.push(`"${empresa.trim()}"`);
    }

    setSearchString(parts.join(" AND "));
    toast.success("String de pesquisa gerada com sucesso!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(searchString);
    toast.success("Copiado para a área de transferência!");
  };

  const openInLinkedIn = () => {
    const encoded = encodeURIComponent(searchString);
    window.open(
      `https://www.linkedin.com/search/results/people/?keywords=${encoded}`,
      "_blank"
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Gerador de Pesquisa LinkedIn</h2>
        <p className="text-muted-foreground mt-1">
          Crie buscas avançadas (Boolean Search) para encontrar profissionais no LinkedIn.
        </p>
      </div>

      {/* Info box */}
      <div className="glass-card rounded-lg p-4 mb-6 flex gap-3 items-start border-primary/20">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Como funciona?</p>
          <p>
            Preencha os campos abaixo e o sistema vai gerar uma string de busca booleana otimizada.
            Copie e cole diretamente na barra de pesquisa do LinkedIn para resultados mais precisos.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Cargo / Função *
            </label>
            <Input
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder='Ex: "Comprador", "Analista de RH"'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Região de Atuação
            </label>
            <select
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Selecione a região</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Habilidades / Palavras-chave
            </label>
            <Input
              value={habilidades}
              onChange={(e) => setHabilidades(e.target.value)}
              placeholder="Separadas por vírgula: Excel, SAP, Negociação"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Empresa (opcional)
            </label>
            <Input
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Ex: Ambev, Vale, Grupo Boticário"
            />
          </div>
        </div>

        <Button onClick={generateSearchString} className="mt-5 gap-2">
          <Search className="w-4 h-4" />
          Gerar String de Pesquisa
        </Button>
      </div>

      {/* Result */}
      {searchString && (
        <div className="glass-card rounded-lg p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Sua String de Pesquisa
          </h3>
          <div className="bg-background rounded-lg p-4 font-mono text-sm text-foreground border border-border/50 mb-4 break-all">
            {searchString}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={copyToClipboard} variant="outline" className="gap-2">
              <Copy className="w-4 h-4" />
              Copiar
            </Button>
            <Button onClick={openInLinkedIn} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Pesquisar no LinkedIn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInSearchTab;
