import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para redirecionamento
import "../styles/CoverPageStyle.css"; // Importa o CSS para estilização

// Interface que define as propriedades aceitas pelo componente CoverPage
interface CoverProps {
  title: string; // Título principal da página
  description: string; // Descrição secundária
  catchyPhrase: string; // Frase de destaque
  headerImage: string; // Caminho para a imagem de cabeçalho
  showHeaderImage: boolean; // Indica se a imagem deve ser exibida
  showSearch: boolean; // Indica se a barra de busca deve ser exibida
}

// Componente funcional CoverPage que exibe a capa principal do site
const CoverPage: React.FC<CoverProps> = ({
  title,
  description,
  catchyPhrase,
  headerImage,
  showHeaderImage,
  showSearch,
}) => {
  // Estado local para armazenar o texto da busca
  const [searchText, setSearchText] = useState("");

  // Hook para redirecionamento de páginas
  const navigate = useNavigate();

  // Função que lida com a busca ao clicar no botão "Search"
  const handleSearch = () => {
    if (searchText.trim() !== "") {
      // Redireciona para a página de resultados de busca com o texto da busca na query string
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <div className="cover">
      {/* Texto principal da capa */}
      <div className="coverText">
        <h1>{title}</h1> {/* Exibe o título */}
        <p>{description}</p> {/* Exibe a descrição */}
        <em>{catchyPhrase}</em> {/* Exibe a frase de destaque */}
      </div>

      {/* Exibe a imagem de cabeçalho se showHeaderImage for true */}
      {showHeaderImage && <img src={headerImage} alt="img" />}

      {/* Exibe a barra de busca se showSearch for true */}
      {showSearch && (
        <div className="searchBar">
          <input
            type="search"
            placeholder="Search a Movie OR TV Show..." // Placeholder do campo de busca
            value={searchText} // Valor atual do estado da busca
            onChange={(e) => setSearchText(e.target.value)} // Atualiza o estado com o texto digitado
          />
          <button onClick={handleSearch}>Search</button> {/* Botão para iniciar a busca */}
        </div>
      )}
    </div>
  );
};

export default CoverPage;
