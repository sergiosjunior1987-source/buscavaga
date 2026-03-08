import { useState } from "react";
import {
  MessageSquare,
  Video,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  CalendarDays,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Types ──────────────────────────────────────────────
type ScheduleEvent = {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: "entrevista" | "envio_cv" | "followup" | "estudo" | "outro";
};

const eventTypes = [
  { value: "entrevista", label: "Entrevista", color: "bg-primary/15 text-primary" },
  { value: "envio_cv", label: "Envio de CV", color: "bg-accent/15 text-accent-foreground" },
  { value: "followup", label: "Follow-up", color: "bg-yellow-500/15 text-yellow-600" },
  { value: "estudo", label: "Estudo/Preparo", color: "bg-green-500/15 text-green-600" },
  { value: "outro", label: "Outro", color: "bg-muted text-muted-foreground" },
] as const;

// ── Interview tips data ────────────────────────────────
const interviewTips = [
  {
    category: "Antes da Entrevista",
    icon: BookOpen,
    tips: [
      "Pesquise a empresa: história, missão, valores, produtos e concorrentes",
      "Revise a descrição da vaga e prepare exemplos para cada requisito",
      "Prepare respostas STAR (Situação, Tarefa, Ação, Resultado)",
      "Escolha a roupa adequada ao dress code da empresa",
      "Teste equipamentos se for entrevista online (câmera, microfone, internet)",
      "Tenha cópias do currículo e portfólio prontos",
      "Prepare 3-5 perguntas inteligentes sobre a empresa e a vaga",
    ],
  },
  {
    category: "Durante a Entrevista",
    icon: MessageSquare,
    tips: [
      "Chegue 10-15 minutos antes (presencial) ou 5 minutos antes (online)",
      "Mantenha contato visual e linguagem corporal positiva",
      "Escute atentamente antes de responder",
      "Use exemplos concretos com dados e resultados mensuráveis",
      "Seja honesto sobre lacunas ou falta de experiência",
      "Demonstre entusiasmo genuíno pela oportunidade",
      "Anote o nome dos entrevistadores para follow-up",
    ],
  },
  {
    category: "Depois da Entrevista",
    icon: CheckCircle2,
    tips: [
      "Envie um e-mail de agradecimento em até 24 horas",
      "Reforce seu interesse e mencione pontos discutidos",
      "Faça follow-up se não receber retorno em 1 semana",
      "Anote suas impressões e aprendizados para futuras entrevistas",
      "Continue se candidatando a outras vagas enquanto aguarda",
    ],
  },
];

const commonQuestions = [
  { question: "Fale sobre você", tip: "Use a fórmula: presente (o que faz) → passado (experiência relevante) → futuro (por que quer essa vaga)" },
  { question: "Quais são seus pontos fortes?", tip: "Escolha 3 qualidades relevantes para a vaga com exemplos concretos" },
  { question: "Qual seu maior defeito?", tip: "Cite algo real que você está trabalhando para melhorar, com exemplo de progresso" },
  { question: "Por que quer trabalhar aqui?", tip: "Conecte valores da empresa com seus objetivos e como pode contribuir" },
  { question: "Onde se vê em 5 anos?", tip: "Mostre ambição realista e alinhamento com o plano de carreira da empresa" },
  { question: "Por que saiu do emprego anterior?", tip: "Seja positivo — foque em busca de crescimento, nunca fale mal do ex-empregador" },
  { question: "Qual sua pretensão salarial?", tip: "Pesquise a faixa do mercado no Glassdoor/Levels.fyi e dê uma faixa, não valor fixo" },
  { question: "Como lida com pressão?", tip: "Dê exemplo real usando método STAR com resultado positivo" },
];

const tools = [
  { name: "Glassdoor", desc: "Pesquisa de salários e avaliações de empresas", url: "https://www.glassdoor.com.br", category: "Pesquisa" },
  { name: "Google Meet", desc: "Videoconferência para entrevistas online", url: "https://meet.google.com", category: "Videoconferência" },
  { name: "Zoom", desc: "Plataforma de videoconferência muito usada em entrevistas", url: "https://zoom.us", category: "Videoconferência" },
  { name: "Microsoft Teams", desc: "Ferramenta corporativa de reuniões e entrevistas", url: "https://teams.microsoft.com", category: "Videoconferência" },
  { name: "HackerRank", desc: "Testes técnicos para vagas de TI", url: "https://www.hackerrank.com", category: "Testes Técnicos" },
  { name: "LeetCode", desc: "Preparação para entrevistas técnicas de programação", url: "https://leetcode.com", category: "Testes Técnicos" },
  { name: "Pramp", desc: "Simulação de entrevistas com outros candidatos", url: "https://www.pramp.com", category: "Simulação" },
  { name: "Big Interview", desc: "Treino de entrevistas com IA", url: "https://biginterview.com", category: "Simulação" },
  { name: "Canva", desc: "Crie apresentações e portfólios visuais", url: "https://www.canva.com", category: "Portfólio" },
  { name: "Loom", desc: "Grave vídeos de apresentação pessoal", url: "https://www.loom.com", category: "Portfólio" },
];

// ── Component ──────────────────────────────────────────
const InterviewGuideTab = () => {
  const [activeSection, setActiveSection] = useState<"guia" | "perguntas" | "ferramentas" | "agenda">("guia");

  // Agenda state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem("job-search-events");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
    }
    return [];
  });
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<ScheduleEvent["type"]>("entrevista");

  const saveEvents = (updated: ScheduleEvent[]) => {
    setEvents(updated);
    localStorage.setItem("job-search-events", JSON.stringify(updated));
  };

  const addEvent = () => {
    if (!selectedDate || !newTitle.trim()) {
      toast.error("Selecione uma data e informe o título");
      return;
    }
    const event: ScheduleEvent = {
      id: crypto.randomUUID(),
      date: selectedDate,
      title: newTitle.trim(),
      description: newDesc.trim(),
      type: newType,
    };
    saveEvents([...events, event]);
    setNewTitle("");
    setNewDesc("");
    toast.success("Evento adicionado à agenda!");
  };

  const removeEvent = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
    toast.success("Evento removido");
  };

  const eventsForDate = (date: Date) =>
    events.filter(
      (e) =>
        e.date.getFullYear() === date.getFullYear() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getDate() === date.getDate()
    );

  const datesWithEvents = events.map((e) => e.date);

  const upcomingEvents = [...events]
    .filter((e) => e.date >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const sections = [
    { id: "guia" as const, label: "Guia", icon: Lightbulb },
    { id: "perguntas" as const, label: "Perguntas Comuns", icon: MessageSquare },
    { id: "ferramentas" as const, label: "Ferramentas", icon: Video },
    { id: "agenda" as const, label: "Minha Agenda", icon: CalendarDays },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Guia de Entrevistas & Agenda</h2>
        <p className="text-muted-foreground">
          Prepare-se para entrevistas e organize sua busca de emprego
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ── Guia Section ── */}
      {activeSection === "guia" && (
        <div className="grid gap-6">
          {interviewTips.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.category} className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Perguntas Comuns Section ── */}
      {activeSection === "perguntas" && (
        <div className="grid gap-4">
          {commonQuestions.map((q, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                "{q.question}"
              </h4>
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                <span><strong>Dica:</strong> {q.tip}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Ferramentas Section ── */}
      {activeSection === "ferramentas" && (
        <div className="space-y-6">
          {["Videoconferência", "Pesquisa", "Testes Técnicos", "Simulação", "Portfólio"].map((cat) => {
            const catTools = tools.filter((t) => t.category === cat);
            if (!catTools.length) return null;
            return (
              <div key={cat}>
                <h3 className="text-base font-semibold text-foreground mb-3">{cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-sm transition-all flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                          {tool.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Agenda Section ── */}
      {activeSection === "agenda" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar + Add event */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="pointer-events-auto"
                modifiers={{ hasEvent: datesWithEvents }}
                modifiersClassNames={{ hasEvent: "bg-primary/20 font-bold rounded-full" }}
              />
            </div>

            {/* Add event form */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Novo evento{" "}
                {selectedDate && (
                  <span className="text-muted-foreground font-normal">
                    — {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                )}
              </h3>
              <Input
                placeholder="Título (ex: Entrevista na XYZ Corp)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Detalhes (opcional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ScheduleEvent["type"])}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {eventTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <Button onClick={addEvent} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Adicionar à Agenda
              </Button>
            </div>
          </div>

          {/* Events list */}
          <div className="space-y-4">
            {/* Events for selected date */}
            {selectedDate && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </h3>
                {eventsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum evento neste dia.</p>
                ) : (
                  <div className="space-y-2">
                    {eventsForDate(selectedDate).map((ev) => {
                      const evType = eventTypes.find((t) => t.value === ev.type);
                      return (
                        <div
                          key={ev.id}
                          className="flex items-start justify-between gap-3 bg-muted/30 rounded-lg p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${evType?.color}`}>
                                {evType?.label}
                              </span>
                              <span className="font-medium text-sm text-foreground truncate">{ev.title}</span>
                            </div>
                            {ev.description && (
                              <p className="text-xs text-muted-foreground">{ev.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeEvent(ev.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Upcoming events */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Próximos Eventos
              </h3>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum evento futuro agendado.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((ev) => {
                    const evType = eventTypes.find((t) => t.value === ev.type);
                    return (
                      <div
                        key={ev.id}
                        className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedDate(new Date(ev.date))}
                      >
                        <div className="text-center shrink-0 w-12">
                          <p className="text-lg font-bold text-foreground leading-none">
                            {format(ev.date, "dd")}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {format(ev.date, "MMM", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${evType?.color}`}>
                            {evType?.label}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEvent(ev.id);
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewGuideTab;
