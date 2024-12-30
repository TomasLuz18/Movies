// pages/MovieDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/MovieDetailsStyle.css"; // Continua importando o CSS

import {
  getMovieDetails,
  MovieDetailsType,
} from "../modules/MovieDetailsService";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Chama a função do service
      if (!id) return;
      const details = await getMovieDetails(id);
      setMovieDetails(details);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <p className="loadingText">Loading...</p>;
  }

  if (!movieDetails) {
    return <p className="errorText">Movie details not found!</p>;
  }

  const {
    title,
    poster_path,
    backdrop_path,
    overview,
    release_date,
    vote_average,
    tagline,
    genres,
    runtime,
    production_companies,
    budget,
    revenue,
    vote_count,
  } = movieDetails;

  const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
    : "";

  return (
    <div
      className="mainContainer"
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
      }}
    >
      <div className="overlay">
        <div className="contentWrapper">
          <div className="posterSection">
            <img
              src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
              alt={title}
              className="poster"
            />
          </div>
          <div className="infoSection">
            <h1 className="title">{title}</h1>
            {tagline && <h3 className="tagline">"{tagline}"</h3>}

            <div className="rating">
              <span className="star">★</span>
              <b>{vote_average.toFixed(1)}</b>
              <span style={{ marginLeft: "8px" }}>
                ({vote_count.toLocaleString()} votos)
              </span>
            </div>

            <div className="releaseRuntime">
              <p>
                <b>Release Date:</b> {release_date}
              </p>
              <p>
                <b>Runtime:</b> {runtime} min
              </p>
            </div>

            {genres && genres.length > 0 && (
              <div className="genreList">
                <b>Genres:</b>
                <div className="genreWrapper">
                  {genres.map((genre) => (
                    <span key={genre.id} className="genreBadge">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="overview">
              <b>Overview:</b> {overview}
            </p>

            <p>
              <b>Budget:</b>{" "}
              {budget === 0 ? "Not Available" : `$${budget.toLocaleString()}`}
            </p>
            <p>
              <b>Revenue:</b>{" "}
              {revenue === 0 ? "Not Available" : `$${revenue.toLocaleString()}`}
            </p>

            {production_companies && production_companies.length > 0 && (
              <div className="productionContainer">
                <b>Production Companies:</b>
                <div className="companyList">
                  {production_companies.map((company) => (
                    <div key={company.id} className="companyItem">
                      {company.logo_path && (
                        <img
                          className="companyLogo"
                          src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                          alt={company.name}
                        />
                      )}
                      <p>
                        {company.name} ({company.origin_country})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
