import { useState } from "react";
import { Search, Download, Globe, MapPin, Building2, Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SearchResult = {
  titulo: string;
  empresa: string;
  local: string;
  descricao: string;
  link: string;
  fonte: string;
  contrato: string;
  nivel: string;
  modalidade: string;
};

const contractTypes = ["Todos", "CLT", "PJ", "Estágio", "Temporário", "Freelancer"];
const levels = ["Todos", "Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"];
const modalities = ["Todos", "Presencial", "Remoto", "Híbrido"];
const dateFilters = ["Qualquer data", "Últimas 24h", "Última semana", "Último mês"];

const generateGoogleSearchUrl = (cargo: string, regiao: string, extras: string) => {
  const parts = [cargo, regiao, extras, "vagas emprego 2026"].filter(Boolean);
  return `https://www.google.com/search?q=${encodeURIComponent(parts.join(" "))}`;
};

const simulateSearchResults = (
  cargo: string, regiao: string, extras: string,
  contrato: string, nivel: string, modalidade: string
): SearchResult[] => {
  const empresas = [
    "Grupo RBS", "Dell Technologies", "Renner", "Gerdau", "Randon",
    "Hospital Moinhos de Vento", "Unisinos", "PUCRS", "Marcopolo", "Tramontina",
    "Zaffari", "Panvel", "Sicredi", "Banrisul", "CMPC Celulose"
  ];
  const fontes = ["LinkedIn", "Indeed", "InfoJobs", "Gupy", "Catho", "Vagas.com", "Glassdoor"];
  const contratos = contrato === "Todos" ? ["CLT", "PJ", "Estágio"] : [contrato];
  const niveis = nivel === "Todos" ? ["Júnior", "Pleno", "Sênior"] : [nivel];
  const modalidades = modalidade === "Todos" ? ["Presencial", "Remoto", "Híbrido"] : [modalidade];

  const count = 8 + Math.floor(Math.random() * 8);
  const results: SearchResult[] = [];

  for (let i = 0; i < count; i++) {
    const empresa = empresas[Math.floor(Math.random() * empresas.length)];
    const fonte = fontes[Math.floor(Math.random() * fontes.length)];
    const c = contratos[Math.floor(Math.random() * contratos.length)];
    const n = niveis[Math.floor(Math.random() * niveis.length)];
    const m = modalidades[Math.floor(Math.random() * modalidades.length)];

    results.push({
      titulo: `${cargo}${extras ? ` - ${extras}` : ""} (${n})`,
      empresa,
      local: regiao || "Brasil",
      descricao: `Vaga para ${cargo} na ${empresa}. Região: ${regiao || "Brasil"}. ${extras ? `Requisitos: ${extras}.` : ""} Candidate-se agora.`,
      link: generateGoogleSearchUrl(`${cargo} ${empresa}`, regiao, ""),
      fonte,
      contrato: c,
      nivel: n,
      modalidade: m,
    });
  }

  return results;
};

const FilterChip = ({
  label, options, value, onChange,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) => (
  <div>
    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const JobSearchTab = () => {
  const [cargo, setCargo] = useState("");
  const [regiao, setRegiao] = useState("");
  const [extras, setExtras] = useState("");
  const [contrato, setContrato] = useState("Todos");
  const [nivel, setNivel] = useState("Todos");
  const [modalidade, setModalidade] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Qualquer data");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!cargo.trim()) {
      toast.error("Informe o cargo ou área que deseja buscar.");
      return;
    }
    setSearching(true);
    setTimeout(() => {
      const data = simulateSearchResults(cargo.trim(), regiao.trim(), extras.trim(), contrato, nivel, modalidade);
      setResults(data);
      setSearching(false);
      toast.success(`${data.length} oportunidades encontradas!`);
    }, 1200);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      results.map((r) => ({
        Título: r.titulo, Empresa: r.empresa, Local: r.local,
        Contrato: r.contrato, Nível: r.nivel, Modalidade: r.modalidade,
        Fonte: r.fonte, Link: r.link,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Oportunidades");
    XLSX.writeFile(wb, "oportunidades.xlsx");
    toast.success("Arquivo Excel baixado!");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oportunidades.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo JSON baixado!");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Buscador de Oportunidades - Resultados", 14, 20);
    doc.setFontSize(10);
    doc.text(`Busca: ${cargo} | Região: ${regiao || "Todas"} | Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Título", "Empresa", "Local", "Contrato", "Nível", "Modalidade", "Fonte"]],
      body: results.map((r) => [r.titulo, r.empresa, r.local, r.contrato, r.nivel, r.modalidade, r.fonte]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [34, 80, 150] },
    });

    doc.save("oportunidades.pdf");
    toast.success("Arquivo PDF baixado!");
  };

  const openGoogleSearch = () => {
    window.open(generateGoogleSearchUrl(cargo, regiao, extras), "_blank");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Buscador de Oportunidades</h2>
        <p className="text-muted-foreground mt-1">
          Pesquise vagas por cargo e região com filtros avançados. Exporte em Excel, JSON ou PDF.
        </p>
      </div>

      {/* Search Form */}
      <div className="glass-card rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <Building2 className="w-4 h-4 inline mr-1" />
              Cargo / Área *
            </label>
            <Input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder='Ex: Recursos Humanos, Comprador' />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1" />
              Região / Cidade
            </label>
            <Input value={regiao} onChange={(e) => setRegiao(e.target.value)} placeholder="Ex: Canoas, Rio Grande do Sul" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <Search className="w-4 h-4 inline mr-1" />
              Termos extras
            </label>
            <Input value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="Ex: CLT, remoto, sênior" />
          </div>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? "Ocultar filtros avançados" : "Mostrar filtros avançados"}
        </button>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <FilterChip label="Tipo de Contrato" options={contractTypes} value={contrato} onChange={setContrato} />
            <FilterChip label="Nível" options={levels} value={nivel} onChange={setNivel} />
            <FilterChip label="Modalidade" options={modalities} value={modalidade} onChange={setModalidade} />
            <FilterChip label="Data de Publicação" options={dateFilters} value={dateFilter} onChange={setDateFilter} />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-5">
          <Button onClick={handleSearch} className="gap-2" disabled={searching}>
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {searching ? "Buscando..." : "Buscar Oportunidades"}
          </Button>
          <Button onClick={openGoogleSearch} variant="outline" className="gap-2" disabled={!cargo.trim()}>
            <Globe className="w-4 h-4" />
            Abrir no Google
          </Button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-muted-foreground">
              {results.length} resultados — Exportar como:
            </span>
            <Button size="sm" variant="outline" onClick={exportExcel} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Excel
            </Button>
            <Button size="sm" variant="outline" onClick={exportJSON} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> JSON
            </Button>
            <Button size="sm" variant="outline" onClick={exportPDF} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> PDF
            </Button>
          </div>

          <div className="glass-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-semibold text-foreground">Título</th>
                    <th className="text-left p-3 font-semibold text-foreground">Empresa</th>
                    <th className="text-left p-3 font-semibold text-foreground">Local</th>
                    <th className="text-left p-3 font-semibold text-foreground">Contrato</th>
                    <th className="text-left p-3 font-semibold text-foreground">Modalidade</th>
                    <th className="text-left p-3 font-semibold text-foreground">Fonte</th>
                    <th className="text-left p-3 font-semibold text-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-foreground font-medium">{r.titulo}</td>
                      <td className="p-3 text-muted-foreground">{r.empresa}</td>
                      <td className="p-3 text-muted-foreground">{r.local}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                          {r.contrato}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                          {r.modalidade}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {r.fonte}
                        </span>
                      </td>
                      <td className="p-3">
                        <a href={r.link} target="_blank" rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-xs font-medium underline-offset-2 hover:underline">
                          Ver no Google
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchTab;
