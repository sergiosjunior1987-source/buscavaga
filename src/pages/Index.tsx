import { useState } from "react";
import { Briefcase, FileText, Search } from "lucide-react";
import PlatformsTab from "@/components/PlatformsTab";
import ResumeOptimizerTab from "@/components/ResumeOptimizerTab";
import LinkedInSearchTab from "@/components/LinkedInSearchTab";

const tabs = [
  { id: "platforms", label: "Plataformas", icon: Briefcase },
  { id: "resume", label: "Currículo ATS", icon: FileText },
  { id: "linkedin", label: "Pesquisa LinkedIn", icon: Search },
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
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">RecrutaFácil</h1>
              <p className="text-xs text-muted-foreground">Sistema de Recrutamento Inteligente</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
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
      </main>
    </div>
  );
};

export default Index;
