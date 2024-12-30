// modules/movieDetailsService.ts
import axios from "axios";
import { bearerToken } from "./ApiLinks"; // Ajuste o caminho se necessário

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MovieDetailsType {
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  tagline: string;
  genres: Genre[];
  runtime: number;
  production_companies: ProductionCompany[];
  budget: number;
  revenue: number;
  vote_count: number;
}

/**
 * Função responsável por buscar detalhes de um filme pelo ID.
 */
export async function getMovieDetails(id: string): Promise<MovieDetailsType | null> {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          accept: "application/json",
        },
      }
    );
    return response.data; // Retorna os detalhes do filme
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}
