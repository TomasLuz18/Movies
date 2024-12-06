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
        description="Welcome, to the best site in Ualg"
        catchyPhrase="never stop dreaming"
        headerImage={coverImage}
        showSearch={true}
        showHeaderImage={true}
      />
      
      <Display 
        
        apiEndPoint ={nowPlayingMovies}
        itemHeading="Now Playing Movies"
        showButtons= {true}
        moviesOn={true}
        tvShowOn={false}
        numberOfMedia={10}
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