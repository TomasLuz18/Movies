// Section.tsx
import React from "react";
import Display from "./Display"; // Importa o componente Display para exibir os itens.
import "../styles/FilterBarStyle.css"; // Importa o CSS para estilização.

// Define as propriedades aceitas pelo componente Section.
interface SectionProps {
    heading: string; // Cabeçalho da seção (título).
    apiEndpoint?: string; // Endpoint da API (opcional).
    moviesOn?: boolean; // Define se a seção exibe filmes (opcional, padrão: true).
    tvShowOn?: boolean; // Define se a seção exibe séries de TV (opcional, padrão: false).
    numberOfMedia?: number; // Número de itens a serem exibidos (opcional, padrão: 10).
    filters?: {
        genre: number | null; // Filtro de gênero (opcional).
        certification: string | null; // Filtro de certificação (opcional).
        year: number | null; // Filtro por ano (opcional).
    };
}

// Componente funcional Section que renderiza uma seção configurável de mídia.
const Section: React.FC<SectionProps> = ({
    heading, // Título da seção.
    apiEndpoint, // Endpoint da API para buscar os itens.
    moviesOn = true, // Exibe filmes por padrão.
    tvShowOn = false, // Não exibe séries de TV por padrão.
    numberOfMedia = 10, // Exibe até 10 itens por padrão.
    filters, // Filtros personalizados.
}) => {
    return (
        <div className="section-container">
            {/* Componente Display responsável por renderizar os itens */}
            <Display
                apiEndPoint={apiEndpoint ?? ""} // Usa o endpoint ou string vazia se indefinido.
                itemHeading={heading} // Define o título da seção.
                showButtons={true} // Exibe botões de navegação.
                moviesOn={moviesOn} // Configura a exibição de filmes.
                tvShowOn={tvShowOn} // Configura a exibição de séries de TV.
                numberOfMedia={numberOfMedia} // Define o número de itens exibidos.
                filters={filters} // Aplica os filtros personalizados.
            />
        </div>
    ); 
};

export default Section;
