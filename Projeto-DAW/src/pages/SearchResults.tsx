import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Display from "../components/Display";
import { bearerToken } from "../modules/ApiLinks"; // Importar token

const SearchResults: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            try {

                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${bearerToken}`, // Usar token centralizado
                            accept: "application/json",
                        },
                    }
                );

                setResults(response.data.results);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div>
            <h1>Search Results for "{query}"</h1>
            <Display
                apiEndPoint=""
                numberOfMedia={results.length}
                showButtons={false}
                tvShowOn={false}
                moviesOn={true}
                itemHeading="Search Results"
                customMedia={results} // Passa resultados personalizados
            />
        </div>
    );
};

export default SearchResults;
