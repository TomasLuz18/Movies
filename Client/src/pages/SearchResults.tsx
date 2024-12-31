// pages/SearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Display from "../components/Display"; // Importa o componente para exibir resultados
// Importa a função de busca para obter os resultados da pesquisa
import { fetchSearchResults } from "../modules/Search";

const SearchResults: React.FC = () => {
  // Obtém a localização atual (query string da URL)
  const location = useLocation();

  // Extrai o parâmetro "query" da query string
  const query = new URLSearchParams(location.search).get("query") || "";

  // Estado para armazenar os resultados da pesquisa
  const [results, setResults] = useState<any[]>([]);

  // Efeito para buscar os resultados da pesquisa quando a query mudar
  useEffect(() => {
    const getResults = async () => {
      // Chama a função para obter os dados com base na query
      const data = await fetchSearchResults(query);
      setResults(data); // Atualiza o estado com os resultados obtidos
    };
    getResults(); // Executa a busca
  }, [query]); // Dependência: executa novamente sempre que "query" mudar

  return (
    <div>
      {/* Cabeçalho com o termo pesquisado */}
      <h1>Search Results for "{query}"</h1>

      {/* Componente Display para exibir os resultados da pesquisa */}
      <Display
        apiEndPoint="" // Não utiliza endpoint fixo, pois usa dados personalizados
        numberOfMedia={results.length} // Define o número de mídias a serem exibidas
        showButtons={false} // Não exibe botões de navegação
        tvShowOn={false} // Define que séries de TV não serão exibidas
        moviesOn={true} // Define que a mídia exibida será de filmes
        itemHeading="Search Results" // Cabeçalho do componente
        customMedia={results} // Passa os resultados personalizados para exibição
      />
    </div>
  );
};

export default SearchResults;
