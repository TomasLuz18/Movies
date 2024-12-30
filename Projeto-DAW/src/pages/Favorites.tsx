import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importa as funções do serviço
import {
  getFavoriteIds,
  getFavoritesDetails,
  Media,
} from "../modules/FavoritesService";

function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 1º Efeito: buscar IDs de favoritos no backend local
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const ids = await getFavoriteIds(); // <-- chamada ao service
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }
    fetchFavorites();
  }, []);

  // 2º Efeito: buscar detalhes dos filmes no TheMovieDB a partir dos IDs
  useEffect(() => {
    async function fetchFavoriteDetails() {
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const movieData = await getFavoritesDetails(favoriteIds); // <-- chamada ao service
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
      <div className="mediaCard" style={{ marginTop: "100px" }}>
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
