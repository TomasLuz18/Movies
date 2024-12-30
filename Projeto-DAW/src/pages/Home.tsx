import React, { useState, useCallback } from "react";
import CoverPage from "../components/CoverPage";
import FilterBar from "../components/FilterBar";
import Section from "../components/Section";
import coverImage from "../assets/img2.jpg";

// Endpoints pré-definidos
import {
  popularMovies,
  topRatedMovies,
  upcomingMovies,
  nowPlayingMovies,
} from "../modules/ApiLinks";

// Crie uma interface para evitar 'any'
interface Filters {
  genre: number | null;
  certification: string | null;
  year: number | null;
}

const Home: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    genre: null,
    certification: null,
    year: null,
  });

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div>
      <CoverPage
        title="Bem-vindo(a) ao Movies"
        description="O melhor site para se informar sobre filmes e séries!"
        catchyPhrase="Confira lançamentos, títulos populares e muito mais!"
        headerImage={coverImage}
        showSearch={true}
        showHeaderImage={true}
      />

      {/* Filtro */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Seções */}
      <Section
        heading="Populares"
        apiEndpoint={popularMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

      <Section
        heading="Melhor Avaliados"
        apiEndpoint={topRatedMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

      <Section
        heading="Próximos Lançamentos"
        apiEndpoint={upcomingMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

      <Section
        heading="Em Cartaz"
        apiEndpoint={nowPlayingMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />
    </div>
  );
};

export default Home;
