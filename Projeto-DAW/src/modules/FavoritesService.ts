// modules/favoritesService.ts

import axios from "axios";
import { bearerToken } from "./ApiLinks";

// Define a interface do tipo que você está manipulando
export interface Media {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

/**
 * Retorna os IDs de filmes favoritos armazenados no backend local.
 * Se não houver token no localStorage, retorna array vazio.
 */
export async function getFavoriteIds(): Promise<string[]> {
  const userToken = localStorage.getItem("token");
  if (!userToken) {
    console.log("User not logged in or token missing.");
    return [];
  }

  const response = await axios.get("http://localhost:8080/favorites", {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  return response.data.favorites; // supondo que o backend retorne algo como { favorites: string[] }
}

/**
 * Retorna os detalhes de cada filme favorito, chamando a API do TheMovieDB.
 */
export async function getFavoritesDetails(favoriteIds: string[]): Promise<Media[]> {
  if (favoriteIds.length === 0) return [];

  const promises = favoriteIds.map((id) =>
    axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
  );
  const results = await Promise.all(promises);
  // Extraímos os dados .data de cada chamada
  const movieData = results.map((res) => res.data);
  return movieData;
}
