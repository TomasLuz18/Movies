import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// 1. Importe o CSS
import "../styles/LoginStyle.css";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://localhost:8080/login", formData);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);
      navigate("/"); // Redireciona para a página inicial após login
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    }
  };

  return (
    // 2. Use className em vez de style
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Submit
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Login;
