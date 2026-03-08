import { useState, useRef } from "react";
import { FileText, Sparkles, Download, CheckCircle, AlertTriangle, Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Suggestion = {
  type: "improvement" | "warning";
  text: string;
  applied: boolean;
};

const atsTemplates = [
  { name: "Clássico ATS 2026", description: "Layout limpo, seções padronizadas, sem gráficos" },
  { name: "Moderno Profissional", description: "Design minimalista com hierarquia visual clara" },
  { name: "Tech & Digital", description: "Otimizado para vagas de tecnologia e startups" },
];

const generateSuggestions = (text: string): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  if (!text.toLowerCase().includes("objetivo") && !text.toLowerCase().includes("resumo")) {
    suggestions.push({ type: "improvement", text: "Adicione um resumo profissional no topo do currículo (2-3 linhas).", applied: false });
  }
  if (!text.toLowerCase().includes("resultado") && !text.toLowerCase().includes("meta") && !text.toLowerCase().includes("%")) {
    suggestions.push({ type: "improvement", text: "Inclua métricas e resultados concretos nas experiências (ex: 'Aumentei vendas em 30%').", applied: false });
  }
  if (text.length < 200) {
    suggestions.push({ type: "warning", text: "Seu currículo parece muito curto. Adicione mais detalhes sobre experiências e habilidades.", applied: false });
  }
  if (!text.toLowerCase().includes("linkedin")) {
    suggestions.push({ type: "improvement", text: "Adicione o link do seu perfil LinkedIn.", applied: false });
  }
  if (!text.toLowerCase().includes("formação") && !text.toLowerCase().includes("graduação") && !text.toLowerCase().includes("universidade")) {
    suggestions.push({ type: "improvement", text: "Inclua sua formação acadêmica com nome da instituição e ano de conclusão.", applied: false });
  }
  if (text.includes("  ") || text.includes("\t")) {
    suggestions.push({ type: "warning", text: "Remova espaços duplos e tabulações — sistemas ATS podem interpretar incorretamente.", applied: false });
  }
  suggestions.push({ type: "improvement", text: "Use palavras-chave da vaga desejada no resumo e nas experiências.", applied: false });
  suggestions.push({ type: "improvement", text: "Ordene as experiências da mais recente para a mais antiga (ordem cronológica inversa).", applied: false });
  return suggestions;
};

const ResumeOptimizerTab = () => {
  const [resumeText, setResumeText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Formato não suportado. Envie um arquivo PDF ou Word (.doc, .docx).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo: 10MB.");
      return;
    }

    setUploadedFile(file.name);

    // For text extraction from uploaded files (basic approach for .txt-like content)
    // PDF/Word parsing requires server-side processing. We inform the user.
    if (file.type === "application/pdf") {
      toast.info("PDF carregado! Para melhor análise, cole o conteúdo do seu currículo no campo de texto abaixo.");
    } else {
      toast.info("Arquivo Word carregado! Para melhor análise, cole o conteúdo do seu currículo no campo de texto abaixo.");
    }

    // Try reading as text (works for some cases)
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.length > 20 && !text.includes("\u0000")) {
        setResumeText(text);
        toast.success("Conteúdo extraído do arquivo com sucesso!");
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (resumeText.trim().length < 20) {
      toast.error("Cole seu currículo com pelo menos 20 caracteres para análise.");
      return;
    }
    const newSuggestions = generateSuggestions(resumeText);
    setSuggestions(newSuggestions);
    setAnalyzed(true);
    toast.success(`Análise concluída! ${newSuggestions.length} sugestões encontradas.`);
  };

  const handleApplySuggestion = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, applied: true } : s))
    );
    toast.success("Sugestão marcada como aplicada!");
  };

  const handleDownload = () => {
    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculo-otimizado.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Currículo baixado com sucesso!");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Otimizador de Currículo ATS</h2>
        <p className="text-muted-foreground mt-1">
          Envie seu currículo (PDF ou Word) ou cole o texto abaixo para receber sugestões de melhoria no formato ATS 2026.
        </p>
      </div>

      {/* Templates */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Modelos ATS Recomendados para 2026
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {atsTemplates.map((template, i) => (
            <button
              key={i}
              onClick={() => setSelectedTemplate(i)}
              className={`glass-card rounded-lg p-4 text-left transition-all duration-200 ${
                selectedTemplate === i
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">{template.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="glass-card rounded-lg p-6 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          Enviar Currículo
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <File className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">
            Clique para enviar ou arraste seu arquivo
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Formatos aceitos: PDF, DOC, DOCX (máx. 10MB)
          </p>
          {uploadedFile && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <FileText className="w-3 h-3" />
              {uploadedFile}
            </div>
          )}
        </div>
      </div>

      {/* Text Input Area */}
      <div className="glass-card rounded-lg p-6 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Ou cole o conteúdo do currículo
        </h3>
        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Cole aqui o conteúdo do seu currículo atual..."
          className="min-h-[250px] text-sm bg-background/50 border-border/50 resize-y"
        />
        <div className="flex flex-wrap gap-3 mt-4">
          <Button onClick={handleAnalyze} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Analisar Currículo
          </Button>
          <Button onClick={handleDownload} variant="outline" className="gap-2" disabled={!resumeText.trim()}>
            <Download className="w-4 h-4" />
            Baixar sem Alterações
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      {analyzed && suggestions.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground">
            Sugestões de Melhoria ({suggestions.filter((s) => !s.applied).length} pendentes)
          </h3>
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className={`glass-card rounded-lg p-4 flex items-start gap-3 transition-all ${
                suggestion.applied ? "opacity-50" : ""
              }`}
            >
              {suggestion.type === "improvement" ? (
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-foreground">{suggestion.text}</p>
              </div>
              {!suggestion.applied ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplySuggestion(i)}
                  className="shrink-0 gap-1 text-xs"
                >
                  <CheckCircle className="w-3 h-3" />
                  Aplicar
                </Button>
              ) : (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Aplicada ✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeOptimizerTab;
