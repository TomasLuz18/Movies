import React from 'react';
import { AppBar, Toolbar, Typography, Tab, Button } from '@mui/material';
import "../styles/HeaderStyle.css";
import { NavLink } from 'react-router-dom';

const tabItems = [
    { name: "Home", link: "/" },
    { name: "Now playing", link: "now_playing" },
    { name: "Popular", link: "popular" },
    { name: "Tv Shows", link: "tv_shows" },
];

const Header: React.FC = () => {
    return (
        <div className="navBarWrapper">
            <AppBar sx={{ padding: '10px', backgroundColor: '#000000' }}>
                <Toolbar>
                    <Typography className="logo">Movies</Typography>
                    <div className="navLinks">
                        {tabItems.map((nav, index) => (
                            <NavLink to={nav.link} key={index}>
                                <Tab className="links" label={nav.name} />
                            </NavLink>
                        ))}
                    </div>
                    <div className="authButtons">
                        <NavLink to="/login">
                            <Button className="loginButton" variant="contained" color="info">
                                Login
                            </Button>
                        </NavLink>
                        <NavLink to="/create_account">
                            <Button className="signupButton" variant="outlined" color="info" sx={{ marginLeft: '10px' }}>
                                Sign Up
                            </Button>
                        </NavLink>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
