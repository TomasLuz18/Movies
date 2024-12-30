import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// 1. Importe o serviço de login
import { doLogin } from "../modules/LoginService"; 
import type { LoginFormData } from "../modules/LoginService";

// 2. Importe o CSS (parte visual)
import "../styles/LoginStyle.css";

const Login: React.FC = () => {
  // Estados locais do formulário
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  // AuthContext e navigate (para lidar com o token e redirecionamento)
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Agora chamamos a função do serviço no submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = await doLogin(formData);    // <-- Lógica vem do service
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/"); // Redireciona para a página inicial após login
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    }
  };

  return (
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
