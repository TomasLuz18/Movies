
import React from "react";
import Display from "../components/Display";
import { nowPlayingMovies, popularShows, onTheAirShows, topRatedMovies, topRatedShows, airingTodayShows, popularMovies, upcomingMovies } from "../modules/ApiLinks";

import CoverPage from "../components/CoverPage";
import coverImage from "../assets/img2.jpg";

const NowPlaying = () => {
  return (
    <div>
      <Display
        apiEndPoint={nowPlayingMovies}
        itemHeading="Now Playing Movies"
        showButtons={true}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
      />
    </div>

  );
}

export default NowPlaying;