// App.tsx (atualizado)
import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import NowPlaying from "./pages/NowPlaying";
import TvShows from "./pages/TvShows";
import Popular from "./pages/Popular";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { AuthProvider } from "./context/AuthContext";
import ProtectedPage from "./pages/ProtectedPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="now_playing" element={<NowPlaying />} />
        <Route path="popular" element={<Popular />} />
        <Route path="tv_shows" element={<TvShows />} />
        <Route path="login" element={<Login />} />
        <Route path="create_account" element={<CreateAccount />} />
        <Route
          path="protected"
          element={
            <ProtectedRoute>
              <ProtectedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;