// =====================
// CONFIGURAÇÕES GERAIS
// =====================
export const apiKey = "6b4c2206e7e56c18e5e168a62d31a19d";
export const bearerToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjRjMjIwNmU3ZTU2YzE4ZTVlMTY4YTYyZDMxYTE5ZCIsIm5iZiI6MTczMjk5MDY4OS41MzIsInN1YiI6IjY3NGI1NmUxM2Q5MjU0MjNkOWYyOTA2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SeAF-rDQ_e2voWRJYttoWt3416jYvPQHfOHYKWHTqLY";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Parâmetros padrão (ajuste o language se quiser "en-US")
const defaultParams = {
  language: "pt-BR",
  include_adult: false,
  include_video: false,
  sort_by: "popularity.desc",
};

// =====================
// FUNÇÕES DE DISCOVER
// =====================
export function getDiscoverMoviesUrl(options: Record<string, any> = {}) {
  const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
  url.searchParams.set("api_key", apiKey);

  const params = { ...defaultParams, ...options };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Converte value para string para evitar erro TS2345
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function getDiscoverTvUrl(options: Record<string, any> = {}) {
  const url = new URL(`${TMDB_BASE_URL}/discover/tv`);
  url.searchParams.set("api_key", apiKey);

  const params = { ...defaultParams, ...options };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Converte value para string
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

// =====================================
// ENDPOINTS “PRÉ-PRONTOS” PARA FILMES
// =====================================
export const nowPlayingMovies = `${TMDB_BASE_URL}/movie/now_playing?api_key=${apiKey}&language=pt-BR`;
export const popularMovies = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=pt-BR`;
export const topRatedMovies = `${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}&language=pt-BR`;
export const upcomingMovies = `${TMDB_BASE_URL}/movie/upcoming?api_key=${apiKey}&language=pt-BR`;

// =====================================
// ENDPOINTS “PRÉ-PRONTOS” PARA SÉRIES
// =====================================
export const onTheAirShows = `${TMDB_BASE_URL}/tv/on_the_air?api_key=${apiKey}&language=pt-BR`;
export const popularShows = `${TMDB_BASE_URL}/tv/popular?api_key=${apiKey}&language=pt-BR`;
export const topRatedShows = `${TMDB_BASE_URL}/tv/top_rated?api_key=${apiKey}&language=pt-BR`;
export const airingTodayShows = `${TMDB_BASE_URL}/tv/airing_today?api_key=${apiKey}&language=pt-BR`;
