import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { bearerToken } from "../modules/ApiLinks";

interface Media {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const userToken = localStorage.getItem("token");
        if (!userToken) {
          console.log("User not logged in or token missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setFavoriteIds(response.data.favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }

    fetchFavorites();
  }, []);

  useEffect(() => {
    async function fetchFavoriteDetails() {
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const promises = favoriteIds.map((id) =>
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          })
        );
        const results = await Promise.all(promises);
        const movieData = results.map((res) => res.data);
        setFavorites(movieData);
      } catch (error) {
        console.error("Error fetching favorite details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteDetails();
  }, [favoriteIds]);

  if (loading) {
    return <div>Loading favorites...</div>;
  }

  if (favoriteIds.length === 0) {
    return <div>You have no favorite movies yet.</div>;
  }

  return (
    <div>
      <h2>Your Favorite Movies</h2>
      <div className="mediaCard">
        {favorites.map((item) => (
          <div
            className="media"
            key={item.id}
            onClick={() => navigate(`/movie/${item.id}`)}
          >
            <div className="mediaImage">
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w200/${item.poster_path}`
                    : "https://dummyimage.com/200x300/cccccc/000000&text=No+Image"
                }
                alt={item.title}
              />
              <span>{Math.round(item.vote_average * 10) / 10}</span>
            </div>
            <div className="mediaInfo">
              <h4>{item.title}</h4>
              <p>{item.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;