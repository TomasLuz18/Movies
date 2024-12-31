import React, { useState, useCallback } from "react";
import CoverPage from "../components/CoverPage";
import FilterBar from "../components/FilterBar";
import Section from "../components/Section";
import coverImage from "../assets/img2.jpg";

// Importa os endpoints predefinidos da API.
import {
  popularMovies,
  topRatedMovies,
  upcomingMovies,
} from "../modules/ApiLinks";

// Interface para definir o formato dos filtros, evitando o uso de 'any'.
interface Filters {
  genre: number | null;           // ID do gênero selecionado.
  certification: string | null;   // Certificação selecionada (ex.: PG, R).
  year: number | null;            // Ano selecionado para filtrar os filmes.
}

// Componente funcional para a página inicial.
const Home: React.FC = () => {
  // Estado para armazenar os filtros selecionados pelo usuário.
  const [filters, setFilters] = useState<Filters>({
    genre: null,
    certification: null,
    year: null,
  });

  // Função para atualizar os filtros, utilizando `useCallback` para otimização.
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters); // Atualiza o estado com os novos filtros.
  }, []);

  return (
    <div>
      {/* Componente de página de capa */}
      <CoverPage
        title="Welcome to Movies" // Título principal da página.
        description="The best Website to stay updated on movies!" // Descrição do site.
        catchyPhrase="Check out new releases, popular titles, and much more!" // Frase de destaque.
        headerImage={coverImage} // Imagem de capa.
        showSearch={true} // Exibe a barra de pesquisa.
        showHeaderImage={true} // Exibe a imagem de cabeçalho.
      />

      {/* Barra de Filtros */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Seção de filmes populares */}
      <Section
        heading="Popular" // Título da seção.
        apiEndpoint={popularMovies} // Endpoint da API para filmes populares.
        moviesOn={true} // Define que a seção exibe filmes.
        tvShowOn={false} // Define que a seção não exibe séries.
        numberOfMedia={10} // Número de mídias exibidas.
        filters={filters} // Aplica os filtros selecionados pelo usuário.
      />

      {/* Seção de filmes mais bem avaliados */}
      <Section
        heading="Top Rated"
        apiEndpoint={topRatedMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

      {/* Seção de lançamentos futuros */}
      <Section
        heading="Upcoming Releases"
        apiEndpoint={upcomingMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />
    </div>
  );
};

export default Home;
