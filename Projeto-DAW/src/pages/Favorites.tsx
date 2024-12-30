import React, { useEffect, useState } from "react";
import axios from "axios";
// O bearerToken deve continuar para chamar a API do TMDB
import { bearerToken } from "../modules/ApiLinks"; // Importar token

interface Media {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Busca lista de IDs favoritados do back
    async function fetchFavorites() {
      try {
        // Pega o token JWT do SEU BACKEND guardado no localStorage
        // (Você salvou isso depois de fazer login)
        const userToken = localStorage.getItem("token");
        if (!userToken) {
          console.log("Usuário não está logado ou token não existe no localStorage.");
          setLoading(false);
          return; 
        }

        const response = await axios.get("http://localhost:8080/favorites", {
          headers: {
            // AQUI usamos o token do NOSSO backend
            Authorization: `Bearer ${userToken}`,
          },
        });

        const ids = response.data.favorites; // array de movieIds (strings)
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Erro ao buscar favoritos", error);
      }
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    // 2. Para cada ID, faz chamada ao TMDB para pegar detalhes do filme
    async function fetchFavoritesDetails() {
      try {
        setLoading(true);

        // Aqui usamos o token da TMDB (bearerToken)
        // pois estamos consultando https://api.themoviedb.org
        const promises = favoriteIds.map((id) =>
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // TOKEN DO TMDB
            },
          })
        );
        const results = await Promise.all(promises);
        const movieData = results.map((res) => res.data);
        setFavorites(movieData);
      } catch (error) {
        console.error("Erro ao buscar detalhes dos favoritos", error);
      } finally {
        setLoading(false);
      }
    }

    if (favoriteIds.length > 0) {
      fetchFavoritesDetails();
    } else {
      // se não houver favoritos, podemos setar loading como false
      setLoading(false);
    }
  }, [favoriteIds]);

  if (loading) {
    return <div>Carregando favoritos...</div>;
  }

  if (favoriteIds.length === 0) {
    return <div>Você não tem favoritos ainda.</div>;
  }

  return (
    <div>
      <h2>Seus Filmes Favoritos</h2>
      <div className="mediaCard">
        {favorites.map((item) => (
          <div className="media" key={item.id}>
            <div className="mediaImage">
              <img
                src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
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
