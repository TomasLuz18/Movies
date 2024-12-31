// modules/movieDetailsService.ts
import axios from "axios";
import { bearerToken } from "./ApiLinks"; // Token de autenticação para a API do The Movie Database (TMDb)

// Interface para representar o formato de um gênero de filme
export interface Genre {
  id: number; // ID do gênero
  name: string; // Nome do gênero
}

// Interface para representar o formato de uma companhia de produção
export interface ProductionCompany {
  id: number; // ID da companhia
  logo_path: string | null; // Caminho para o logo (pode ser nulo)
  name: string; // Nome da companhia
  origin_country: string; // País de origem
}

// Interface para representar os detalhes completos de um filme
export interface MovieDetailsType {
  title: string; // Título do filme
  poster_path: string; // Caminho para o poster do filme
  backdrop_path: string; // Caminho para o fundo do filme
  overview: string; // Resumo do filme
  release_date: string; // Data de lançamento
  vote_average: number; // Nota média
  tagline: string; // Tagline do filme
  genres: Genre[]; // Lista de gêneros
  runtime: number; // Duração do filme (em minutos)
  production_companies: ProductionCompany[]; // Lista de companhias de produção
  budget: number; // Orçamento do filme
  revenue: number; // Receita do filme
  vote_count: number; // Número de votos recebidos
}

/**
 * Função responsável por buscar detalhes de um filme pelo ID.
 * @param id - O ID do filme a ser buscado.
 * @returns Os detalhes do filme ou null em caso de erro.
 */
export async function getMovieDetails(id: string): Promise<MovieDetailsType | null> {
  try {
    // Faz uma requisição GET à API do TMDb usando o ID fornecido
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`, // URL da API com o ID do filme
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // Adiciona o token de autenticação no cabeçalho
          accept: "application/json", // Define que o cliente aceita respostas em JSON
        },
      }
    );
    return response.data; // Retorna os dados do filme obtidos da API
  } catch (error) {
    // Exibe uma mensagem de erro no console caso a requisição falhe
    console.error("Error fetching movie details:", error);
    return null; // Retorna null em caso de erro
  }
}
