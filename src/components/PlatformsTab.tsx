import { ExternalLink } from "lucide-react";

const platforms = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs",
    description: "Maior rede profissional do mundo. Ideal para networking e vagas corporativas.",
    color: "bg-[#0A66C2]",
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com.br",
    description: "Agregador global de vagas com milhões de oportunidades em diversas áreas.",
    color: "bg-[#2164F3]",
  },
  {
    name: "InfoJobs",
    url: "https://www.infojobs.com.br",
    description: "Uma das maiores plataformas de emprego do Brasil com vagas em todas as regiões.",
    color: "bg-[#FF6600]",
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com.br",
    description: "Avaliações de empresas e vagas. Ótimo para pesquisar cultura organizacional.",
    color: "bg-[#0CAA41]",
  },
  {
    name: "Catho",
    url: "https://www.catho.com.br",
    description: "Plataforma brasileira tradicional com grande base de vagas e candidatos.",
    color: "bg-[#F7941D]",
  },
  {
    name: "Vagas.com",
    url: "https://www.vagas.com.br",
    description: "Portal gratuito com vagas em todo o Brasil e processo seletivo simplificado.",
    color: "bg-[#00A651]",
  },
  {
    name: "Gupy",
    url: "https://portal.gupy.io",
    description: "Plataforma de recrutamento usada por grandes empresas brasileiras.",
    color: "bg-[#E91E63]",
  },
  {
    name: "Trampos.co",
    url: "https://trampos.co",
    description: "Focado em vagas de tecnologia, design e comunicação.",
    color: "bg-[#1A1A2E]",
  },
];

const PlatformsTab = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Plataformas de Emprego</h2>
        <p className="text-muted-foreground mt-1">
          Acesse as principais plataformas de recrutamento do mercado.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-card rounded-lg p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${platform.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <span className="text-sm font-bold text-primary-foreground">
                  {platform.name.charAt(0)}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">{platform.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {platform.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PlatformsTab;
