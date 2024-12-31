// modules/searchModule.ts
import axios from "axios";
import { bearerToken } from "./ApiLinks"; // Ajuste o caminho caso esteja em outra pasta

/**
 * Função para buscar os resultados de filmes pelo `query`.
 */
export async function fetchSearchResults(query: string) {
  if (!query) return [];
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          accept: "application/json",
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}
