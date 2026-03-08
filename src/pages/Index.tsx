import { useState } from "react";
import { Briefcase, FileText, Search, Globe, Heart, Building2 } from "lucide-react";
import PlatformsTab from "@/components/PlatformsTab";
import ResumeOptimizerTab from "@/components/ResumeOptimizerTab";
import LinkedInSearchTab from "@/components/LinkedInSearchTab";
import JobSearchTab from "@/components/JobSearchTab";
import RecruitmentAgenciesTab from "@/components/RecruitmentAgenciesTab";
import DonationTab from "@/components/DonationTab";

const tabs = [
  { id: "platforms", label: "Plataformas", icon: Briefcase },
  { id: "resume", label: "Currículo ATS", icon: FileText },
  { id: "linkedin", label: "Pesquisa LinkedIn", icon: Search },
  { id: "jobsearch", label: "Buscar Vagas", icon: Globe },
  { id: "agencies", label: "Recrutadores", icon: Building2 },
  { id: "donation", label: "Doações", icon: Heart },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("platforms");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground leading-tight">Buscador de Oportunidades</h1>
                <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  100% Gratuito
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Encontre sua próxima oportunidade profissional — totalmente grátis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "platforms" && <PlatformsTab />}
        {activeTab === "resume" && <ResumeOptimizerTab />}
        {activeTab === "linkedin" && <LinkedInSearchTab />}
        {activeTab === "jobsearch" && <JobSearchTab />}
        {activeTab === "agencies" && <RecruitmentAgenciesTab />}
        {activeTab === "donation" && <DonationTab />}
      </main>
    </div>
  );
};

export default Index;
