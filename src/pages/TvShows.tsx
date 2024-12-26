import React from "react";
import Display from "../components/Display";
import { nowPlayingMovies, popularShows, onTheAirShows, topRatedMovies, topRatedShows, airingTodayShows, popularMovies, upcomingMovies} from "../modules/ApiLinks";
const TvShows = () => {
    return (
        <div>
             <Display  
      apiEndPoint ={popularShows}
      itemHeading="Popular Shows"
      showButtons= {true}
        moviesOn={false}
        tvShowOn={true}
        numberOfMedia={10}
      />

      <Display 
        
        apiEndPoint ={topRatedShows}
        itemHeading="Top Rated Shows"
        showButtons= {true}
        moviesOn={false}
        tvShowOn={true}
        numberOfMedia={10}
      />

<Display 
        
        apiEndPoint ={onTheAirShows}
        itemHeading="On The Air Shows"
        showButtons= {true}
        moviesOn={false}
        tvShowOn={true}
        numberOfMedia={10}
      />
        </div>

      );
}
 
export default TvShows;