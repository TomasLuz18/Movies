// FilterBar.tsx

import React, { useState, useEffect } from "react";
import "../styles/FilterBar.css"; // Importa o CSS

interface FilterBarProps {
  onFilterChange: (filters: {
    genre: number | null;
    certification: string | null;
    year: number | null;
  }) => void;
}

// Exemplo de gêneros (substitua se quiser buscar da API)
const mockGenres = [
  { id: 28, name: "Ação" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animação" },
  { id: 35, name: "Comédia" },
  { id: 18, name: "Drama" },
];

// Exemplo de classificações
const mockCertifications = ["G", "PG", "PG-13", "R", "NC-17"];

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    onFilterChange({
      genre: selectedGenre,
      certification: selectedCertification,
      year: selectedYear,
    });
  }, [selectedGenre, selectedCertification, selectedYear, onFilterChange]);

  return (
    <div className="filter-bar">
      <select
        className="filter-select"
        value={selectedGenre ?? ""}
        onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">-- Gênero --</option>
        {mockGenres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={selectedCertification ?? ""}
        onChange={(e) => setSelectedCertification(e.target.value || null)}
      >
        <option value="">-- Classificação --</option>
        {mockCertifications.map((cert) => (
          <option key={cert} value={cert}>
            {cert}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="filter-input"
        placeholder="Ano"
        value={selectedYear ?? ""}
        onChange={(e) => {
          const yearValue = e.target.value ? parseInt(e.target.value, 10) : null;
          setSelectedYear(yearValue);
        }}
      />
    </div>
  );
};

export default FilterBar;