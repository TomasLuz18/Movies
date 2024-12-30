// FilterBar.tsx

import React, { useState, useEffect } from "react";
import "../styles/FilterBarStyle.css"; // Importa o CSS

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

// Função para gerar uma lista de anos
const generateYearOptions = (startYear: number, endYear: number): number[] => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
};

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedCertification] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Gerar anos de 1900 até o ano atual
  const currentYear = new Date().getFullYear();
  const yearOptions = generateYearOptions(1900, currentYear);

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

      {/* Substituição do input de número por um select de anos */}
      <select
        className="filter-select"
        value={selectedYear ?? ""}
        onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">-- Ano --</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
