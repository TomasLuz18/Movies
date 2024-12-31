// pages/MovieDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/MovieDetailsStyle.css"; // Importa o CSS para estilização

// Importa o serviço para buscar os detalhes do filme e a tipagem associada
import {
  getMovieDetails,
  MovieDetailsType,
} from "../modules/MovieDetailsService";

const MovieDetails: React.FC = () => {
  // Obtém o parâmetro `id` da URL (representando o ID do filme).
  const { id } = useParams<{ id: string }>();

  // Estado para armazenar os detalhes do filme.
  const [movieDetails, setMovieDetails] = useState<MovieDetailsType | null>(null);

  // Estado para indicar se os dados estão sendo carregados.
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os detalhes do filme quando o `id` mudar.
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Garante que o `id` seja válido.
      const details = await getMovieDetails(id); // Chama o serviço para buscar os detalhes.
      setMovieDetails(details); // Atualiza o estado com os detalhes obtidos.
      setLoading(false); // Indica que o carregamento foi concluído.
    };
    fetchData();
  }, [id]); // Executa sempre que `id` mudar.

  // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados.
  if (loading) {
    return <p className="loadingText">Loading...</p>;
  }

  // Exibe uma mensagem de erro se os detalhes do filme não forem encontrados.
  if (!movieDetails) {
    return <p className="errorText">Movie details not found!</p>;
  }

  // Desestrutura os detalhes do filme para facilitar o uso no JSX.
  const {
    title,
    poster_path,
    backdrop_path,
    overview,
    release_date,
    vote_average,
    tagline,
    genres,
    runtime,
    production_companies,
    budget,
    revenue,
    vote_count,
  } = movieDetails;

  // URL da imagem de fundo (backdrop).
  const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
    : "";

  return (
    <div
      className="mainContainer"
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
      }}
    >
      {/* Overlay para efeito visual */}
      <div className="overlay">
        <div className="contentWrapper">
          {/* Seção do poster do filme */}
          <div className="posterSection">
            <img
              src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
              alt={title}
              className="poster"
            />
          </div>

          {/* Seção de informações do filme */}
          <div className="infoSection">
            <h1 className="title">{title}</h1>
            {tagline && <h3 className="tagline">"{tagline}"</h3>}

            {/* Nota média e contagem de votos */}
            <div className="rating">
              <span className="star">★</span>
              <b>{vote_average.toFixed(1)}</b>
              <span style={{ marginLeft: "8px" }}>
                ({vote_count.toLocaleString()} votos)
              </span>
            </div>

            {/* Data de lançamento e duração do filme */}
            <div className="releaseRuntime">
              <p>
                <b>Release Date:</b> {release_date}
              </p>
              <p>
                <b>Runtime:</b> {runtime} min
              </p>
            </div>

            {/* Lista de gêneros do filme */}
            {genres && genres.length > 0 && (
              <div className="genreList">
                <b>Genres:</b>
                <div className="genreWrapper">
                  {genres.map((genre) => (
                    <span key={genre.id} className="genreBadge">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resumo do filme */}
            <p className="overview">
              <b>Overview:</b> {overview}
            </p>

            {/* Orçamento e receita do filme */}
            <p>
              <b>Budget:</b>{" "}
              {budget === 0 ? "Not Available" : `$${budget.toLocaleString()}`}
            </p>
            <p>
              <b>Revenue:</b>{" "}
              {revenue === 0 ? "Not Available" : `$${revenue.toLocaleString()}`}
            </p>

            {/* Lista de companhias de produção */}
            {production_companies && production_companies.length > 0 && (
              <div className="productionContainer">
                <b>Production Companies:</b>
                <div className="companyList">
                  {production_companies.map((company) => (
                    <div key={company.id} className="companyItem">
                      {/* Exibe o logo da companhia, se disponível */}
                      {company.logo_path && (
                        <img
                          className="companyLogo"
                          src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                          alt={company.name}
                        />
                      )}
                      <p>
                        {company.name} ({company.origin_country})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
