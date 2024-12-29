import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Tab, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/HeaderStyle.css';

const tabItems = [
  { name: "Home", link: "/" },
  { name: "Now playing", link: "/now_playing" },
  { name: "Popular", link: "/popular" },
  { name: "Tv Shows", link: "/tv_shows" },
];

const Header: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <div className="navBarWrapper">
      <AppBar sx={{ padding: '10px', backgroundColor: '#000000' }}>
        <Toolbar>
          <Typography className="logo">Movies</Typography>
          <div className="navLinks">
            {tabItems.map((tab, index) => (
              <NavLink to={tab.link} key={index}>
                <Tab className="links" label={tab.name} />
              </NavLink>
            ))}
          </div>
          {token ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate('/favorites')}>Filmes Favoritos</MenuItem>
                <MenuItem onClick={() => {
                  navigate('/account');
                  handleMenuClose();
                }}>
                  Definições de Conta
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
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
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
