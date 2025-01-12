import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Tab, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/HeaderStyle.css';

// Lista de itens para as tabs de navegação
const tabItems = [
  { name: "Home", link: "/" }, // Página inicial
  { name: "Now playing", link: "/now_playing" }, // Filmes em exibição
  { name: "Popular", link: "/popular" }, // Filmes populares
];

// Componente funcional Header
const Header: React.FC = () => {
  const { token, logout } = useContext(AuthContext); // Obtém o token e a função de logout do AuthContext
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para controlar o menu dropdown
  const navigate = useNavigate(); // Hook para redirecionamento de páginas

  // Função para abrir o menu ao clicar no ícone do utilizador
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para fechar o menu dropdown
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Função para realizar o logout
  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    handleMenuClose(); // Fecha o menu
    navigate('/'); // Redireciona para a página inicial
  };

  return (
    <div className="navBarWrapper">
      {/* Barra de navegação principal */}
      <AppBar sx={{ padding: '10px', backgroundColor: '#000000' }}>
        <Toolbar>
          {/* Logo que redireciona para a página inicial */}
          <Typography
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            Movies
          </Typography>

          {/* Links de navegação */}
          <div className="navLinks">
            {tabItems.map((tab, index) => (
              <NavLink to={tab.link} key={index}>
                <Tab className="links" label={tab.name} />
              </NavLink>
            ))}
          </div>

          {/* Menu para utilizadors autenticados */}
          {token ? (
            <div>
              {/* Ícone para abrir o menu do utilizador */}
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              {/* Menu dropdown com opções de favoritos, conta e logout */}
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
                <MenuItem onClick={() => navigate('/favorites')}>
                  Filmes Favoritos
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/account');
                    handleMenuClose();
                  }}
                >
                  Definições de Conta
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            // Botões para login e criação de conta para utilizadors não autenticados
            <div className="authButtons">
              <NavLink to="/login">
                <Button
                  className="authButton"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    border: "2px solid white", // Borda branca
                    '&:hover': { backgroundColor: "#333", border: "2px solid white" }, // Hover com borda branca
                  }}
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to="/create_account">
                <Button
                  className="authButton"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    border: "2px solid white", // Borda branca
                    marginLeft: '10px',
                    '&:hover': { backgroundColor: "#333", border: "2px solid white" }, // Hover com borda branca
                  }}
                >
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
