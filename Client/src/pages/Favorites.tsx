import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importa as funções do serviço de favoritos
import {
  getFavoriteIds,
  getFavoritesDetails,
  Media,
} from "../modules/FavoritesService";

function Favorites() {
  // Estado para armazenar os IDs dos favoritos
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Estado para armazenar os detalhes dos filmes favoritos
  const [favorites, setFavorites] = useState<Media[]>([]);

  // Estado para indicar se os dados estão sendo carregados
  const [loading, setLoading] = useState(true);

  // Hook para navegação entre páginas
  const navigate = useNavigate();

  // 1º Efeito: buscar IDs dos filmes favoritos no backend
  useEffect(() => {
    async function fetchFavorites() {
      try {
        // Chama o serviço para obter os IDs dos favoritos
        const ids = await getFavoriteIds();
        setFavoriteIds(ids); // Atualiza o estado com os IDs obtidos
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }
    fetchFavorites(); // Executa a função ao montar o componente
  }, []);

  // 2º Efeito: buscar detalhes dos filmes favoritos utilizando os IDs
  useEffect(() => {
    async function fetchFavoriteDetails() {
      if (favoriteIds.length === 0) {
        setLoading(false); // Atualiza o estado de carregamento se não houver favoritos
        return;
      }

      try {
        setLoading(true); // Define o estado como carregando
        // Chama o serviço para obter os detalhes dos filmes favoritos
        const movieData = await getFavoritesDetails(favoriteIds);
        setFavorites(movieData); // Atualiza o estado com os detalhes dos filmes
      } catch (error) {
        console.error("Error fetching favorite details:", error);
      } finally {
        setLoading(false); // Define o estado como carregado
      }
    }

    fetchFavoriteDetails(); // Executa a função sempre que `favoriteIds` mudar
  }, [favoriteIds]);

  // Exibe uma mensagem enquanto os dados estão sendo carregados
  if (loading) {
    return <div>Loading favorites...</div>;
  }

  // Exibe uma mensagem caso não haja filmes favoritos
  if (favoriteIds.length === 0) {
    return <div>You have no favorite movies yet.</div>;
  }

  return (
    <div>
      <h2>Your Favorite Movies</h2>
      <div className="mediaCard" style={{ marginTop: "100px" }}>
        {/* Itera sobre os favoritos e renderiza os detalhes de cada filme */}
        {favorites.map((item) => (
          <div
            className="media"
            key={item.id}
            onClick={() => navigate(`/movie/${item.id}`)} // Navega para a página do filme ao clicar
          >
            <div className="mediaImage">
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w200/${item.poster_path}` // URL da imagem do filme
                    : "https://dummyimage.com/200x300/cccccc/000000&text=No+Image" // Placeholder caso não haja imagem
                }
                alt={item.title}
              />
              <span>{Math.round(item.vote_average * 10) / 10}</span> {/* Exibe a nota média */}
            </div>
            <div className="mediaInfo">
              <h4>{item.title}</h4> {/* Exibe o título do filme */}
              <p>{item.release_date}</p> {/* Exibe a data de lançamento */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
