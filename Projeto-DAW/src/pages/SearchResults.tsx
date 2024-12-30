// pages/SearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Display from "../components/Display";
// Importe a função de busca da pasta modules
import { fetchSearchResults } from "../modules/Search";


const SearchResults: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query") || "";
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        // Chame a função do 'modules/searchModule'
        const getResults = async () => {
            const data = await fetchSearchResults(query);
            setResults(data);
        };
        getResults();
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
