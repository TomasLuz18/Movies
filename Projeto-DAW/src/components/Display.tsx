import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // <-- Precisamos do token
import "../styles/DisplayStyle.css";
import { bearerToken } from "../modules/ApiLinks"; // Importar token


// Se você usa "bearerToken" apenas para chamar a API do TMDB,
// importe se precisar buscar filmes de lá. Ex:
// import { bearerToken } from "../modules/ApiLinks";

interface Media {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;

  // TV shows
  first_air_date: string;
  name: string;
}

interface DataProps {
  apiEndPoint: string;
  numberOfMedia: number;
  showButtons: boolean;
  tvShowOn: boolean;
  moviesOn: boolean;
  itemHeading: string;
  customMedia?: Media[]; // Adicionado para suportar resultados personalizados
}

const Display: React.FC<DataProps> = ({
  apiEndPoint,
  numberOfMedia,
  showButtons,
  tvShowOn,
  moviesOn,
  itemHeading,
  customMedia,
}) => {
  const [showItems, setShowItems] = useState<Media[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Lista de IDs favoritados que buscamos do back-end
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const { token } = useContext(AuthContext); // <-- Token do seu back-end
  const navigate = useNavigate();

  // 1) Ao montar, buscarmos filmes/séries da API (ou do customMedia)
  useEffect(() => {
    if (customMedia) {
      setShowItems(customMedia.slice(0, numberOfMedia));
      setLoading(false);
      setTotalPages(1);
    } else {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const response = await axios.get(apiEndPoint, {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Usar token centralizado
            },
          });

          const { results, total_pages } = response.data;
          setShowItems(results.slice(0, numberOfMedia));
          setTotalPages(total_pages);
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMovies();
    }
  }, [customMedia, currentPage, apiEndPoint, numberOfMedia]);

  // 2) Ao montar (e/ou quando o token mudar), busca do back-end quais IDs já estão favoritados
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (!token) return; // se não estiver logado, não busca
      try {
        const response = await axios.get("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // response.data.favorites deve ser um array de strings (ex: ["550", "299536"])
        setFavoriteIds(response.data.favorites);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    };

    fetchFavoriteIds();
  }, [token]);

  // Auxiliar para formatar data
  const getFormattedDate = (dateString: string | number | Date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-Us", options);
  };

  // Paginação
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

  // 3) Clique no coração: se já estiver nos favoritos, REMOVE. Se não estiver, ADICIONA.
  const handleFavoriteClick = async (movieId: string) => {
    if (!token) {
      alert("Você precisa estar logado para favoritar!");
      return;
    }

    const isFavorited = favoriteIds.includes(movieId);
    try {
      if (isFavorited) {
        // Já está favoritado -> então vamos REMOVER
        await axios.delete(`http://localhost:8080/favorites/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove localmente da lista
        setFavoriteIds((prev) => prev.filter((id) => id !== movieId));
        alert("Favorito removido!");
      } else {
        // Não está favorito ainda -> vamos ADICIONAR
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
        // Adiciona localmente
        setFavoriteIds((prev) => [...prev, movieId]);
        alert("Adicionado aos favoritos!");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao atualizar favorito.");
    }
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
              // Verifica se esse ID está no array de favoritos
              const isFavorited = favoriteIds.includes(item.id.toString());

              return (
                <div className="media" key={item.id}>
                  <div
                    className="mediaImage"
                    onClick={() => navigate(`/movie/${item.id}`)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                      alt={item.title || item.name}
                    />
                    <span>{Math.round(item.vote_average * 10) / 10}</span>
                  </div>
                  <div className="mediaInfo">
                    {moviesOn && (
                      <>
                        <h4>{item.title}</h4>
                        <p>{getFormattedDate(item.release_date)}</p>
                      </>
                    )}
                    {tvShowOn && (
                      <>
                        <h4>{item.name}</h4>
                        <p>{getFormattedDate(item.first_air_date)}</p>
                      </>
                    )}
                  </div>

                  {/* ÍCONE DE CORAÇÃO */}
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      color: isFavorited ? "red" : "grey", // se já for favorito, exibe vermelho
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // impede de abrir os detalhes
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
