import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // <-- Token do seu backend
import { bearerToken } from "../modules/ApiLinks"; // <-- Token da API TMDB
import "../styles/DisplayStyle.css";

interface Media {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
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
  customMedia?: Media[];
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

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

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
            params: { page: currentPage },
            headers: {
              Authorization: `Bearer ${bearerToken}`,
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

  const getFormattedDate = (dateString: string | number | Date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-Us", options);
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
            {showItems.map((item) => (
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
              </div>
            ))}
            {showButtons && !customMedia && (
              <div className="buttons">
                {currentPage > 1 && (
                  <button className="btnPrev" onClick={prevItemsPage}>
                    Back
                  </button>
                )}
                <p>
                  Page <b>{currentPage}</b> of <b>{totalPages}</b>
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