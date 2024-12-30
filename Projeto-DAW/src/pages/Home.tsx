import React, { useState, useCallback } from "react";
import CoverPage from "../components/CoverPage";
import FilterBar from "../components/FilterBar";
import Section from "../components/Section";
import coverImage from "../assets/img2.jpg";

// Predefined endpoints
import {
  popularMovies,
  topRatedMovies,
  upcomingMovies,
  nowPlayingMovies,
} from "../modules/ApiLinks";

// Create an interface to avoid 'any'
interface Filters {
  genre: number | null;
  certification: string | null;
  year: number | null;
}

const Home: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    genre: null,
    certification: null,
    year: null,
  });

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div>
      <CoverPage
        title="Welcome to Movies"
        description="The best Website to stay updated on movies and TV shows!"
        catchyPhrase="Check out new releases, popular titles, and much more!"
        headerImage={coverImage}
        showSearch={true}
        showHeaderImage={true}
      />

      {/* Filter */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Sections */}
      <Section
        heading="Popular"
        apiEndpoint={popularMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

      <Section
        heading="Top Rated"
        apiEndpoint={topRatedMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

      <Section
        heading="Upcoming Releases"
        apiEndpoint={upcomingMovies}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
        filters={filters}
      />

    </div>
  );
};

export default Home;
