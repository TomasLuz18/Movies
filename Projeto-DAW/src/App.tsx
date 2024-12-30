import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import NowPlaying from "./pages/NowPlaying";
import Popular from "./pages/Popular";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import EditAccount from "./pages/EditAccount"; // Importa a nova página
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites"; // ou onde quer que esteja

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        {/* Outras rotas */}

        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="/" element={<Home />} />
        <Route path="now_playing" element={<NowPlaying />} />
        <Route path="popular" element={<Popular />} />
        <Route path="login" element={<Login />} />
        <Route path="create_account" element={<CreateAccount />} />
        <Route path="account" element={<EditAccount />} /> {/* Nova rota */}
        
      </Routes>
    </AuthProvider>
  );
}

export default App;
