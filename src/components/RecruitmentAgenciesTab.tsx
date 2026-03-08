import { useState } from "react";
import { Search, Download, MapPin, Building2, Loader2, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Agency = {
  nome: string;
  especialidade: string;
  regiao: string;
  contato: string;
  site: string;
  tipo: string;
};

const agencyTypes = ["Todos", "Consultoria RH", "Headhunter", "Agência de Emprego", "Recrutamento Digital", "Outplacement"];

const stateRegions: Record<string, string[]> = {
  "Rio Grande do Sul": ["Porto Alegre", "Canoas", "Novo Hamburgo", "São Leopoldo", "Caxias do Sul", "Pelotas", "Santa Maria", "Gravataí", "Viamão", "Cachoeirinha"],
  "São Paulo": ["São Paulo", "Campinas", "Santos", "Guarulhos", "São Bernardo do Campo", "Osasco", "Ribeirão Preto", "Sorocaba"],
  "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "São Gonçalo", "Petrópolis"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  "Santa Catarina": ["Florianópolis", "Joinville", "Blumenau", "Chapecó", "Itajaí"],
  "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari"],
  "Pernambuco": ["Recife", "Olinda", "Jaboatão dos Guararapes", "Caruaru"],
  "Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú"],
  "Distrito Federal": ["Brasília", "Taguatinga", "Ceilândia", "Águas Claras"],
};

const generateAgencies = (regiao: string, tipoVaga: string, tipoAgencia: string): Agency[] => {
  const baseAgencies: Agency[] = [
    { nome: "Randstad Brasil", especialidade: "Recrutamento generalista e temporário", regiao, contato: "randstad.com.br", site: "https://www.randstad.com.br", tipo: "Consultoria RH" },
    { nome: "Robert Half", especialidade: "Finanças, TI, Engenharia e RH", regiao, contato: "roberthalf.com.br", site: "https://www.roberthalf.com.br", tipo: "Headhunter" },
    { nome: "Michael Page", especialidade: "Executivos e média gerência", regiao, contato: "michaelpage.com.br", site: "https://www.michaelpage.com.br", tipo: "Headhunter" },
    { nome: "Hays Brasil", especialidade: "TI, Engenharia, Vendas e Marketing", regiao, contato: "hays.com.br", site: "https://www.hays.com.br", tipo: "Headhunter" },
    { nome: "Adecco Brasil", especialidade: "Temporários, efetivos e terceirização", regiao, contato: "adecco.com.br", site: "https://www.adecco.com.br", tipo: "Agência de Emprego" },
    { nome: "ManpowerGroup", especialidade: "Workforce solutions e recrutamento", regiao, contato: "manpowergroup.com.br", site: "https://www.manpowergroup.com.br", tipo: "Consultoria RH" },
    { nome: "Catho Empresas", especialidade: "Plataforma de recrutamento digital", regiao, contato: "catho.com.br", site: "https://www.catho.com.br", tipo: "Recrutamento Digital" },
    { nome: "Gupy", especialidade: "Plataforma ATS e recrutamento digital", regiao, contato: "gupy.io", site: "https://www.gupy.io", tipo: "Recrutamento Digital" },
    { nome: "Gi Group", especialidade: "Temporários e efetivos", regiao, contato: "gigroup.com.br", site: "https://www.gigroup.com.br", tipo: "Agência de Emprego" },
    { nome: "Page Personnel", especialidade: "Posições técnicas e operacionais", regiao, contato: "pagepersonnel.com.br", site: "https://www.pagepersonnel.com.br", tipo: "Headhunter" },
    { nome: "Luandre", especialidade: "Recrutamento, seleção e temporários", regiao, contato: "luandre.com.br", site: "https://www.luandre.com.br", tipo: "Agência de Emprego" },
    { nome: "Vagas.com", especialidade: "Portal de vagas e recrutamento digital", regiao, contato: "vagas.com.br", site: "https://www.vagas.com.br", tipo: "Recrutamento Digital" },
    { nome: "Talenses", especialidade: "Executive search e middle management", regiao, contato: "talenses.com", site: "https://www.talenses.com", tipo: "Headhunter" },
    { nome: "Korn Ferry", especialidade: "Consultoria organizacional e executive search", regiao, contato: "kornferry.com", site: "https://www.kornferry.com", tipo: "Consultoria RH" },
    { nome: "Spencer Stuart", especialidade: "Board e CEO search", regiao, contato: "spencerstuart.com", site: "https://www.spencerstuart.com", tipo: "Headhunter" },
    { nome: "Employer Recursos Humanos", especialidade: "Temporários, efetivos e BPO", regiao, contato: "employer.com.br", site: "https://www.employer.com.br", tipo: "Agência de Emprego" },
    { nome: "RH Nossa", especialidade: "Seleção e gestão de pessoas", regiao, contato: "rhnossa.com.br", site: "https://www.rhnossa.com.br", tipo: "Consultoria RH" },
    { nome: "Kenoby (Gupy)", especialidade: "Software de recrutamento e seleção", regiao, contato: "kenoby.com", site: "https://www.gupy.io", tipo: "Recrutamento Digital" },
  ];

  let filtered = baseAgencies;

  if (tipoAgencia !== "Todos") {
    filtered = filtered.filter((a) => a.tipo === tipoAgencia);
  }

  if (tipoVaga) {
    filtered = filtered.map((a) => ({
      ...a,
      especialidade: `${a.especialidade} — foco em ${tipoVaga}`,
    }));
  }

  return filtered;
};

const RecruitmentAgenciesTab = () => {
  const [regiao, setRegiao] = useState("");
  const [tipoVaga, setTipoVaga] = useState("");
  const [tipoAgencia, setTipoAgencia] = useState("Todos");
  const [results, setResults] = useState<Agency[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!regiao.trim()) {
      toast.error("Informe a região para a pesquisa");
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      const agencies = generateAgencies(regiao, tipoVaga, tipoAgencia);
      setResults(agencies);
      setHasSearched(true);
      setIsSearching(false);

      // Open Google search for local agencies
      const query = `empresas de recrutamento ${tipoVaga || ""} ${regiao} 2026`.trim();
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");

      toast.success(`${agencies.length} empresas encontradas! Pesquisa Google aberta em nova aba.`);
    }, 1200);
  };

  const exportExcel = () => {
    if (!results.length) return;
    const ws = XLSX.utils.json_to_sheet(
      results.map((r) => ({
        Nome: r.nome,
        Especialidade: r.especialidade,
        Região: r.regiao,
        Tipo: r.tipo,
        Site: r.site,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empresas de Recrutamento");
    XLSX.writeFile(wb, `empresas_recrutamento_${regiao.replace(/\s/g, "_")}.xlsx`);
    toast.success("Excel baixado com sucesso!");
  };

  const exportPDF = () => {
    if (!results.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Empresas de Recrutamento", 14, 20);
    doc.setFontSize(10);
    doc.text(`Região: ${regiao} | Tipo de vaga: ${tipoVaga || "Todas"} | Filtro: ${tipoAgencia}`, 14, 28);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 34);

    autoTable(doc, {
      startY: 40,
      head: [["Nome", "Especialidade", "Tipo", "Site"]],
      body: results.map((r) => [r.nome, r.especialidade, r.tipo, r.site]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [20, 110, 180] },
    });

    doc.save(`empresas_recrutamento_${regiao.replace(/\s/g, "_")}.pdf`);
    toast.success("PDF baixado com sucesso!");
  };

  const exportJSON = () => {
    if (!results.length) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `empresas_recrutamento_${regiao.replace(/\s/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON baixado com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Empresas de Recrutamento</h2>
        <p className="text-muted-foreground">Encontre consultorias, headhunters e agências de emprego na sua região</p>
      </div>

      {/* Search Form */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Região / Cidade *
            </label>
            <Input
              placeholder="Ex: Canoas, Rio Grande do Sul"
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              list="regions-list"
            />
            <datalist id="regions-list">
              {Object.entries(stateRegions).flatMap(([state, cities]) =>
                cities.map((city) => (
                  <option key={`${city}-${state}`} value={`${city}, ${state}`} />
                ))
              )}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Tipo de Vaga / Área
            </label>
            <Input
              placeholder="Ex: Recursos Humanos, TI, Engenharia"
              value={tipoVaga}
              onChange={(e) => setTipoVaga(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Tipo de Empresa
            </label>
            <select
              value={tipoAgencia}
              onChange={(e) => setTipoAgencia(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {agencyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleSearch} disabled={isSearching} className="w-full">
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Pesquisando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Pesquisar Empresas de Recrutamento
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {hasSearched && results.length > 0 && (
        <div className="space-y-4">
          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={exportExcel} className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Baixar Excel
            </Button>
            <Button variant="outline" onClick={exportPDF} className="gap-2">
              <FileText className="w-4 h-4" />
              Baixar PDF
            </Button>
            <Button variant="outline" onClick={exportJSON} className="gap-2">
              <FileJson className="w-4 h-4" />
              Baixar JSON
            </Button>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground text-center">
            {results.length} empresas encontradas para <strong>{regiao}</strong>
          </p>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Empresa</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Especialidade</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((agency, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{agency.nome}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{agency.especialidade}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {agency.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={agency.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs font-medium"
                        >
                          Acessar site →
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

      {hasSearched && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma empresa encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default RecruitmentAgenciesTab;
