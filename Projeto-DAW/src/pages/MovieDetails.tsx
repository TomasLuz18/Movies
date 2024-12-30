import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { bearerToken } from "../modules/ApiLinks"; // Importar token

interface Genre {
    id: number;
    name: string;
}

interface ProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}

interface MovieDetailsType {
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

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movieDetails, setMovieDetails] = useState<MovieDetailsType | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {

                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${bearerToken}`, // Usar token centralizado
                            accept: "application/json",
                        },
                    }
                );

                setMovieDetails(response.data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return <p style={styles.loadingText}>Loading...</p>;
    }

    if (!movieDetails) {
        return <p style={styles.errorText}>Movie details not found!</p>;
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
            style={{
                ...styles.mainContainer,
                backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
            }}
        >
            {/* Para escurecer um pouco o background e dar contraste ao texto */}
            <div style={styles.overlay}>
                <div style={styles.contentWrapper}>
                    <div style={styles.posterSection}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
                            alt={title}
                            style={styles.poster}
                        />
                    </div>
                    <div style={styles.infoSection}>
                        <h1 style={styles.title}>{title}</h1>
                        {tagline && <h3 style={styles.tagline}>"{tagline}"</h3>}

                        <div style={styles.rating}>
                            <span style={styles.star}>★</span>
                            <b>{vote_average.toFixed(1)}</b>
                            <span style={{ marginLeft: "8px" }}>
                                ({vote_count.toLocaleString()} votos)
                            </span>
                        </div>

                        <div style={styles.releaseRuntime}>
                            <p>
                                <b>Release Date:</b> {release_date}
                            </p>
                            <p>
                                <b>Runtime:</b> {runtime} min
                            </p>
                        </div>

                        {genres && genres.length > 0 && (
                            <div style={styles.genreList}>
                                <b>Genres:</b>
                                <div style={styles.genreWrapper}>
                                    {genres.map((genre) => (
                                        <span key={genre.id} style={styles.genreBadge}>
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p style={styles.overview}>
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
                            <div style={styles.productionContainer}>
                                <b>Production Companies:</b>
                                <div style={styles.companyList}>
                                    {production_companies.map((company) => (
                                        <div key={company.id} style={styles.companyItem}>
                                            {company.logo_path && (
                                                <img
                                                    style={styles.companyLogo}
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

const styles: { [key: string]: React.CSSProperties } = {
    mainContainer: {
        position: "fixed", // Garante que ocupa toda a tela
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto", // Permite scroll se necessário
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.85)", // Fundo escuro com opacidade ajustada
        flex: 1,
        padding: "20px", // Margem padrão para o conteúdo
        paddingTop: "80px", // Adicionado para compensar o header
    },
    contentWrapper: {
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        gap: "40px",
        padding: "40px 20px",
    },
    posterSection: {
        flex: "0 0 300px",
        textAlign: "center",
    },
    poster: {
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Adiciona sombra para destaque
    },
    infoSection: {
        flex: 1,
        minWidth: "280px",
    },
    title: {
        marginTop: 0,
        marginBottom: "10px",
        fontSize: "2.5rem",
        fontWeight: "bold",
    },
    tagline: {
        fontStyle: "italic",
        fontWeight: "normal",
        color: "#ccc",
        marginTop: 0,
        marginBottom: "20px",
    },
    rating: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        fontSize: "1.2rem",
    },
    star: {
        color: "#ffc107",
        marginRight: "6px",
    },
    releaseRuntime: {
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
    },
    genreList: {
        marginBottom: "20px",
    },
    genreWrapper: {
        marginTop: "6px",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },
    genreBadge: {
        padding: "6px 10px",
        backgroundColor: "#444",
        borderRadius: "4px",
        fontSize: "0.9rem",
    },
    overview: {
        marginBottom: "20px",
        lineHeight: "1.6",
    },
    productionContainer: {
        marginTop: "20px",
    },
    companyList: {
        marginTop: "10px",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
    },
    companyItem: {
        textAlign: "center",
        maxWidth: "120px",
    },
    companyLogo: {
        width: "100%",
        maxHeight: "60px",
        objectFit: "contain",
        marginBottom: "6px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        padding: "4px",
    },
    loadingText: {
        textAlign: "center",
        marginTop: "40px",
        fontSize: "1.5rem",
        color: "#fff",
    },
    errorText: {
        textAlign: "center",
        marginTop: "40px",
        color: "#ff5555",
        fontSize: "1.5rem",
    },
};



export default MovieDetails;
