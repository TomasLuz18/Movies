 import React from "react";
 import Display from "../components/Display";
import { nowPlayingMovies, popularShows, onTheAirShows, topRatedMovies, topRatedShows, airingTodayShows, popularMovies, upcomingMovies} from "../modules/ApiLinks";

import CoverPage from "../components/CoverPage";
import coverImage from "../assets/img2.jpg";

 
 const Home = () => {
    return ( 
        <div>
        <CoverPage
         title="Movies"
        description="Welcome, to the best site ever made"
        catchyPhrase="Here you have the best information about movies"
        headerImage={coverImage}
        showSearch={true}
        showHeaderImage={true}
      />
      
      <Display  
      apiEndPoint ={popularMovies}
      itemHeading="Popular Movies"
      showButtons= {true}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
      />

      <Display 
        
        apiEndPoint ={topRatedMovies}
        itemHeading="Top Rated Movies"
        showButtons= {true}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
      />

<Display 
        
        apiEndPoint ={upcomingMovies}
        itemHeading="Upcoming Movies"
        showButtons= {true}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
      />
        </div>

     );
 }
  
 export default Home;