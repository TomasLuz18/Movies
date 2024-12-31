import React from "react";
import Display from "../components/Display"; // Importa o componente Display, responsável por exibir mídias.
import { popularMovies } from "../modules/ApiLinks"; // Importa o endpoint da API para filmes populares.

const Popular = () => {
  return (
    <div>
      {/* Componente Display que exibe os filmes populares */}
      <Display
        apiEndPoint={popularMovies} // URL da API para obter os filmes populares.
        itemHeading="Popular Movies" // Título exibido no componente.
        showButtons={true} // Indica se os botões (ex.: próximo/anterior) devem ser exibidos.
        moviesOn={true} // Define que a mídia exibida será de filmes.
        tvShowOn={false} // Define que séries de TV não serão exibidas.
        numberOfMedia={10} // Número máximo de mídias a serem exibidas.
      />
    </div>
  );
};

export default Popular;
