import React from 'react';
import { AppBar, Toolbar, Typography, Tab, Button } from '@mui/material';
import "../styles/HeaderStyle.css"// importe o CSS puro
import { NavLink } from 'react-router-dom';

const tabItems = [
    { name: "Home", link: "/" },
    { name: "Now playing", link: "now_playing" },
    { name: "Popular", link: "popular" },
    { name: "Tv Shows", link: "tv_shows" },
];

const Header = () => {
    return (
        <div className="navBarWrapper">
            <AppBar sx={{ padding: '10px', backgroundColor: '#000000' }}>
                <Toolbar>
                    <Typography className="logo">Movies</Typography>
                    <div className="navLinks">
                        {tabItems.map((nav, index) => (
                            <NavLink to={nav.link} key={index}>
                            
                                <Tab className="links" label={nav.name}/>
                            </NavLink>

                        ))}
                    </div>
                    <Button className="loginButton" variant="contained" color="info">
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
