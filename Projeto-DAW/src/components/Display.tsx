import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // <-- Token do seu backend
import { bearerToken } from "../modules/ApiLinks"; // <-- Token da API TMDB
import { getDiscoverMoviesUrl, getDiscoverTvUrl } from "../modules/ApiLinks";
import "../styles/DisplayStyle.css";

/** 
 * Representa um item de filme ou série (Media).
 * Ajuste conforme suas necessidades 
 */
interface Media {
  id: number;
  title?: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
  first_air_date?: string;
  name?: string;
}

/**
 * Se quiser aceitar filtros de "descoberta", crie esta interface.
 * Se você não usar, basta ignorar ou deixar undefined.
 */
interface Filters {
  genre?: number | null;
  certification?: string | null;
  year?: number | null;
}

/**
 * Props para o componente Display
 */
interface DataProps {
  apiEndPoint: string;      // Endpoint fixo, ex: popularMovies, topRatedMovies etc.
  numberOfMedia: number;    // Quantos itens exibir
  showButtons: boolean;     // Se mostra botões de navegação (página)
  tvShowOn: boolean;        // Se é para exibir "name" e "first_air_date"
  moviesOn: boolean;        // Se é para exibir "title" e "release_date"
  itemHeading: string;      // Título para exibir na sessão
  customMedia?: Media[];    // Lista manual de mídia (ex: resultados customizados)
  filters?: Filters;        // Filtros de discover (opcional)
}

const Display: React.FC<DataProps> = ({
  apiEndPoint,
  numberOfMedia,
  showButtons,
  tvShowOn,
  moviesOn,
  itemHeading,
  customMedia,
  filters,
}) => {
  const [showItems, setShowItems] = useState<Media[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Efeito principal: se recebermos `customMedia`, usamos direto;
   * caso contrário, buscamos via endpoint fixo OU discover (se `filters` estiver preenchido).
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Se houver customMedia, apenas exibe-a (sem chamada à API).
        if (customMedia) {
          setShowItems(customMedia.slice(0, numberOfMedia));
          setTotalPages(1);
          return;
        }

        let finalEndpoint = apiEndPoint;

        // Se tivermos filtros de discover selecionados (genre, certification ou year),
        // podemos montar uma URL de discover. 
        const hasFilters =
          filters &&
          (filters.genre || filters.certification || filters.year);

        if (hasFilters) {
          if (moviesOn) {
            // Descobrir filmes
            finalEndpoint = getDiscoverMoviesUrl({
              with_genres: filters?.genre ? String(filters.genre) : undefined,
              certification: filters?.certification || undefined,
              primary_release_year: filters?.year || undefined,
            });
          } else if (tvShowOn) {
            // Descobrir séries
            finalEndpoint = getDiscoverTvUrl({
              with_genres: filters?.genre ? String(filters.genre) : undefined,
              certification: filters?.certification || undefined,
              first_air_date_year: filters?.year || undefined,
            });
          }
        }

        const response = await axios.get(finalEndpoint, {
          params: { page: currentPage },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        const { results, total_pages } = response.data;
        setShowItems(results.slice(0, numberOfMedia));
        setTotalPages(total_pages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customMedia, currentPage, apiEndPoint, numberOfMedia, filters, tvShowOn, moviesOn]);

  /**
   * Busca IDs de favoritos do backend local, se o usuário estiver logado (token).
   */
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteIds(response.data.favorites);
      } catch (error) {
        console.error("Error fetching favorite IDs:", error);
      }
    };
    fetchFavoriteIds();
  }, [token]);

  /**
   * Funções de Paginação
   */
  const prevItemsPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const nextItemsPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  /**
   * Lidar com Favoritos (adicionar ou remover)
   */
  const handleFavoriteClick = async (movieId: string) => {
    if (!token) {
      alert("You need to log in to add favorites!");
      return;
    }

    const isFavorited = favoriteIds.includes(movieId);

    try {
      if (isFavorited) {
        await axios.delete(`http://localhost:8080/favorites/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteIds((prev) => prev.filter((id) => id !== movieId));
        alert("Favorite removed!");
      } else {
        await axios.post(
          "http://localhost:8080/favorites",
          { movieId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavoriteIds((prev) => [...prev, movieId]);
        alert("Added to favorites!");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("An error occurred while updating favorites.");
    }
  };

  /**
   * Formatação de data (dia, mês e ano)
   */
  const getFormattedDate = (dateString: string | number | Date) => {
    const options = { year: "numeric", month: "short", day: "numeric" } as Intl.DateTimeFormatOptions;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="MovieShowWrapper">
      {loading ? (
        <div className="loadingOverlay">
          <CircularProgress size={80} style={{ color: "#ffffff" }} />
          <p>Loading</p>
        </div>
      ) : (
        <>
          <div className="mediaHeading">
            <h1>{itemHeading}</h1>
          </div>

          <div className="mediaCard">
            {showItems.map((item) => {
              const isFavorited = favoriteIds.includes(item.id.toString());

              return (
                <div className="media" key={item.id}>
                  <div
                    className="mediaImage"
                    onClick={() => navigate(`/movie/${item.id}`)}
                  >
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w200/${item.poster_path}`
                          : "https://dummyimage.com/200x300/cccccc/000000&text=No+Image"
                      }
                      alt={item.title || item.name}
                    />
                    <span>{Math.round(item.vote_average * 10) / 10}</span>
                  </div>

                  <div className="mediaInfo">
                    {moviesOn && (
                      <>
                        <h4>{item.title}</h4>
                        <p>{item.release_date ? getFormattedDate(item.release_date) : "N/A"}</p>
                      </>
                    )}
                    {tvShowOn && (
                      <>
                        <h4>{item.name}</h4>
                        <p>{item.first_air_date ? getFormattedDate(item.first_air_date) : "N/A"}</p>
                      </>
                    )}
                  </div>

                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      color: isFavorited ? "red" : "grey",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(item.id.toString());
                    }}
                  >
                    ♥
                  </button>
                </div>
              );
            })}

            {showButtons && !customMedia && (
              <div className="buttons">
                {currentPage > 1 && (
                  <button className="btnPrev" onClick={prevItemsPage}>
                    Back
                  </button>
                )}
                <p>
                  Page <b>{currentPage}</b>
                </p>
                {currentPage < totalPages && (
                  <button className="btnNext" onClick={nextItemsPage}>
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Display;
