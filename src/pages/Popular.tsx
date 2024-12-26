import React from "react";
import Display from "../components/Display";
import { nowPlayingMovies, popularShows, onTheAirShows, topRatedMovies, topRatedShows, airingTodayShows, popularMovies, upcomingMovies} from "../modules/ApiLinks";

import CoverPage from "../components/CoverPage";
import coverImage from "../assets/img2.jpg";
const Popular = () => {
    return (
        <div>
            
      
      <Display  
      apiEndPoint ={popularMovies}
      itemHeading="Popular Movies"
      showButtons= {true}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
      />

      <Display 
        
        apiEndPoint ={popularShows}
        itemHeading="Popular Shows"
        showButtons= {true}
        moviesOn={false}
        tvShowOn={true}
        numberOfMedia={10}
      />
        </div>

      );
}
 
export default Popular;