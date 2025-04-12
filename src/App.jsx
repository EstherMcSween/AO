// Banque de ressources restaurée avec formulaire, filtres, tableau et favoris

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Headphones, FileText, GraduationCap } from "lucide-react";

const initialData = [
  {
    titre: "Guide de co-développement Aire ouverte",
    source: "Centre RBC d'expertise universitaire",
    competences: ["Collaborer efficacement au sein d’une équipe interprofessionnelle", "S’adapter avec agilité aux défis complexes"],
    thematique: "Travail interdisciplinaire",
    type: "Guide",
    format: "PDF - 15 pages",
    lien: "https://exemple.com/guide-codev"
  },
  {
    titre: "Capsule vidéo : Posture d'écoute active",
    source: "CIUSSS de l'Estrie",
    competences: ["Agir selon une approche centrée sur les jeunes"],
    thematique: "Relation avec les jeunes",
    type: "Vidéo",
    format: "Vidéo - 8 min",
    lien: "https://exemple.com/capsule-ecoute"
  },
  {
    titre: "Formation : Introduction à l’approche orientée vers les solutions",
    source: "Université de Sherbrooke",
    competences: ["Intervenir de manière adaptée en contexte de services ponctuels ou court terme", "S’adapter avec agilité aux défis complexes"],
    thematique: "Pratiques d’intervention",
    type: "Formation",
    format: "Module en ligne - 45 min",
    lien: "https://exemple.com/formation-aos"
  }
];

const iconMap = {
  "Vidéo": <Video className="w-4 h-4 inline" />,
  "Guide": <FileText className="w-4 h-4 inline" />,
  "Formation": <GraduationCap className="w-4 h-4 inline" />,
  "Balado": <Headphones className="w-4 h-4 inline" />,
  "Lecture": <BookOpen className="w-4 h-4 inline" />
};

export default function BanqueRessources() {
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem("ressourcesAO");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [search, setSearch] = useState("");
  const [selectedCompetence, setSelectedCompetence] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [favoris, setFavoris] = useState(new Set());
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [newResource, setNewResource] = useState({
    titre: "",
    source: "",
    competences: "",
    thematique: "",
    type: "",
    format: "",
    lien: ""
  });

  useEffect(() => {
    const savedFavs = localStorage.getItem("ressourcesFavoris") || "[]";
    setFavoris(new Set(JSON.parse(savedFavs)));
  }, []);

  const toggleFavori = (titre) => {
    const newSet = new Set(favoris);
    newSet.has(titre) ? newSet.delete(titre) : newSet.add(titre);
    setFavoris(newSet);
    localStorage.setItem("ressourcesFavoris", JSON.stringify([...newSet]));
  };

  const exportCSV = () => {
    const csvRows = [
      ["Titre", "Source", "Compétences liées", "Thématique", "Type", "Format", "Lien"],
      ...resources.map((res) => [
        res.titre,
        res.source,
        res.competences.join('; '),
        res.thematique,
        res.type,
        res.format,
        res.lien
      ])
    ];
    const csvContent = csvRows.map(row => row.map(field => `"${field}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'banque_ressources.csv');
    a.click();
  };

  const filteredResources = resources.filter((res) => {
    if (showOnlyFavs && !favoris.has(res.titre)) return false;
    if (selectedType && res.type !== selectedType) return false;
    if (selectedCompetence && !res.competences.includes(selectedCompetence)) return false;
    return Object.values(res).some((val) =>
      Array.isArray(val)
        ? val.some((v) => v.toLowerCase().includes(search.toLowerCase()))
        : val.toLowerCase().includes(search.toLowerCase())
    );
  });

  const competenceOptions = [
    "Agir selon une approche centrée sur les jeunes",
    "S’adapter avec agilité aux défis complexes",
    "Accueillir et analyser les demandes de services à Aire ouverte",
    "Intervenir de manière adaptée en contexte de services ponctuels ou court terme",
    "Accompagner vers des services et ressources dans la communauté et le RSSS",
    "Déployer des actions de démarchage (outreach) pour aller vers les jeunes",
    "Établir et maintenir des partenariats intersectoriels et intraétablissement",
    "Collaborer efficacement au sein d’une équipe interprofessionnelle",
    "Encourager et soutenir la participation des jeunes et des proches",
    "Incarner les valeurs et les principes éthiques d’Aire ouverte dans sa pratique",
    "Adopter une posture réflexive dans sa pratique",
    "S’engager dans une démarche de développement professionnel continu"
  ];

  const typeOptions = [...new Set(resources.map((r) => r.type))];

  return (
    <div className="p-8 space-y-6 bg-gradient-to-br from-[#74cbc6]/20 via-[#f7a08b]/10 to-[#dadb4a]/20 min-h-screen" style={{ fontFamily: 'Myriad Pro, sans-serif' }}>
      <div className="mb-6 px-6 py-4 bg-white rounded-xl shadow border border-[#dadb4a]/50">
        <h1 className="text-4xl font-bold text-[#214080] mb-2 tracking-tight leading-snug">
          Banque de ressources pour développer vos compétences
        </h1>
        <p className="text-sm text-[#071b4] leading-relaxed max-w-2xl">
          Cet outil soutient les équipes Aire ouverte en facilitant l’identification de ressources et d’activités de développement professionnel continu, alignées avec leurs besoins et les compétences du référentiel.
        </p>
        {!isAuthenticated && (
          <div className="flex gap-2 items-center justify-end mt-4">
            <Input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-48"
            />
            <Button className="bg-[#214080] text-white" onClick={() => setIsAuthenticated(password === 'admin123')}>Connexion admin</Button>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="p-6 bg-white border border-[#214080]/20 shadow rounded-xl">
          <h2 className="text-lg font-semibold text-[#214080] mb-4">Ajouter une ressource</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Titre de la ressource" onChange={(e) => setNewResource(prev => ({ ...prev, titre: e.target.value }))} />
            <Input placeholder="Source" onChange={(e) => setNewResource(prev => ({ ...prev, source: e.target.value }))} />
            <Input placeholder="Compétences (séparées par des virgules)" onChange={(e) => setNewResource(prev => ({ ...prev, competences: e.target.value }))} />
            <Input placeholder="Thématique" onChange={(e) => setNewResource(prev => ({ ...prev, thematique: e.target.value }))} />
            <Input placeholder="Type de ressource" onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))} />
            <Input placeholder="Format et durée" onChange={(e) => setNewResource(prev => ({ ...prev, format: e.target.value }))} />
            <Input placeholder="Lien vers la ressource" onChange={(e) => setNewResource(prev => ({ ...prev, lien: e.target.value }))} />
          </div>
          <Button className="mt-4 bg-[#214080] text-white" onClick={() => {
            if (newResource.titre && newResource.lien) {
              const ajoutée = {
                ...newResource,
                competences: newResource.competences.split(',').map(c => c.trim())
              };
              const updated = [...resources, ajoutée];
              setResources(updated);
              localStorage.setItem("ressourcesAO", JSON.stringify(updated));
            }
          }}>Ajouter</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <select className="border border-[#74cbc6] rounded p-2 bg-white" value={selectedCompetence} onChange={(e) => setSelectedCompetence(e.target.value)}>
          <option value="">Toutes les compétences</option>
          {competenceOptions.map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
        </select>

        <select className="border border-[#74cbc6] rounded p-2 bg-white" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Tous les types</option>
          {typeOptions.map((t, idx) => (<option key={idx} value={t}>{t}</option>))}
        </select>

        <div className="flex gap-2 ml-auto">
          <Button className="bg-[#214080] text-white" onClick={exportCSV}>Exporter en CSV</Button>
          <Button className="bg-[#dadb4a] hover:bg-[#c0c534] text-[#071b4] shadow-md flex items-center gap-2" onClick={() => setShowOnlyFavs(!showOnlyFavs)}>
            {showOnlyFavs ? "Afficher tout" : <><span>Afficher mes favoris</span> <span className="text-lg">★</span></>}
          </Button>
        </div>
      </div>

      <Input placeholder="Rechercher une ressource, une compétence, un thème..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-[#74cbc6] bg-white shadow-sm focus:ring-2 focus:ring-[#214080]" />

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-[#071b4]">
            <tr>
              <th className="p-4 w-1/4 text-left bg-[#dadb4a]">Titre de la ressource</th>
              <th className="p-4">Source</th>
              <th className="p-4">Compétences liées</th>
              <th className="p-4">Thématique</th>
              <th className="p-4">Type</th>
              <th className="p-4">Format</th>
              <th className="p-4">Lien</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((res, index) => (
              <tr key={index} className="border-t">
                <td className="p-4 max-w-xs font-semibold text-[#071b4] bg-[#f9f9d6]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavori(res.titre)}
                      className={`text-xl transition transform hover:scale-110 ${favoris.has(res.titre) ? 'text-[#dadb4a]' : 'text-gray-400'}`}
                      aria-label="Ajouter aux favoris"
                    >
                      {favoris.has(res.titre) ? '★' : '☆'}
                    </button>
                    {res.titre}
                  </div>
                </td>
                <td className="p-4">{res.source}</td>
                <td className="p-4">{res.competences.map((c, i) => (<div key={i}>{c}</div>))}</td>
                <td className="p-4">{res.thematique}</td>
                <td className="p-4">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium text-[#071b4] ${
                    res.type === 'Vidéo' ? 'bg-[#74cbc6]/30' :
                    res.type === 'Guide' ? 'bg-[#f7a08b]/30' :
                    res.type === 'Formation' ? 'bg-[#dadb4a]/40' :
                    'bg-gray-200'}`}>
                    {iconMap[res.type]} {res.type}
                  </div>
                </td>
                <td className="p-4">{res.format}</td>
                <td className="p-4 text-center align-middle">
                  <a href={res.lien} target="_blank" rel="noopener noreferrer">🔗</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
