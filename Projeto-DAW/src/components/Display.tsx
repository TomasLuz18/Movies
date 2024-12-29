import React, { useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { bearerToken } from "../modules/ApiLinks";
import { useNavigate } from "react-router-dom";
import "../styles/DisplayStyle.css";

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
  const [showItems, setShowItems] = React.useState<Media[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true); // Default to true
  const navigate = useNavigate();

  useEffect(() => {
    if (customMedia) {
      // Usa mídia personalizada se fornecida
      setShowItems(customMedia.slice(0, numberOfMedia));
      setLoading(false);
      setTotalPages(1);
    } else {
      // Faz a requisição somente se não houver mídia personalizada
      const fetchMovies = async () => {
        setLoading(true); // Show loading spinner
        try {
          const response = await axios.get(apiEndPoint, {
            params: { page: currentPage },
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
          });

          const { results, total_pages } = response.data;
          setShowItems(results.slice(0, numberOfMedia));
          setTotalPages(total_pages);
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setLoading(false); // Hide loading spinner after fetching
        }
      };

      fetchMovies();
    }
  }, [customMedia, currentPage, apiEndPoint, numberOfMedia]);

  const getFormattedDate = (dateString: string | number | Date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-Us", options);
  };

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
            {showItems.map((items) => (
              <div
                className="media"
                key={items.id}
                onClick={() => navigate(`/movie/${items.id}`)} // Navega para a página de detalhes
              >
                <div className="mediaImage">
                  <img
                    src={`https://image.tmdb.org/t/p/w200/${items.poster_path}`}
                    alt={items.title || items.name}
                  />
                  <span>
                    {Math.round(items.vote_average * 10) / 10}
                  </span>
                </div>
                <div className="mediaInfo">
                  {moviesOn && (
                    <>
                      <h4>{items.title}</h4>
                      <p>{getFormattedDate(items.release_date)}</p>
                    </>
                  )}
                  {tvShowOn && (
                    <>
                      <h4>{items.name}</h4>
                      <p>{getFormattedDate(items.first_air_date)}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            {showButtons && !customMedia && (
              <div className="buttons">
                {currentPage > 1 && (
                  <button
                    className="btnPrev"
                    onClick={prevItemsPage}
                  >
                    Back
                  </button>
                )}
                <p>
                  Page <b>{currentPage}</b>
                </p>
                {currentPage < totalPages && (
                  <button
                    className="btnNext"
                    onClick={nextItemsPage}
                  >
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
