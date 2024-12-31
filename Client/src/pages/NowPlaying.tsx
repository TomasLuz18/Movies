import React from "react";
import Display from "../components/Display"; // Importa o componente Display, responsável por exibir mídias.
import { nowPlayingMovies } from "../modules/ApiLinks"; // Importa o endpoint da API para filmes em exibição atualmente.

const NowPlaying = () => {
  return (
    <div>
      {/* Componente Display que exibe os filmes em exibição */}
      <Display
        apiEndPoint={nowPlayingMovies} // URL da API para obter os filmes em exibição.
        itemHeading="Now Playing Movies" // Título exibido no componente.
        showButtons={true} // Indica se os botões (ex.: próximo/anterior) devem ser exibidos.
        moviesOn={true} // Define que a mídia exibida será de filmes.
        tvShowOn={false} // Define que séries de TV não serão exibidas.
        numberOfMedia={10} // Número máximo de mídias a serem exibidas.
      />
    </div>
  );
};

export default NowPlaying;
