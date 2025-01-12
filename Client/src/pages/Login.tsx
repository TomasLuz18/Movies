import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// 1. Importa o serviço de login e a interface para os dados do formulário.
import { doLogin } from "../modules/LoginService";
import type { LoginFormData } from "../modules/LoginService";

// 2. Importa o CSS para estilização.
import "../styles/LoginStyle.css";

const Login: React.FC = () => {
  // Estado local para armazenar os dados do formulário de login.
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Estado para exibir mensagens de erro caso algo dê errado.
  const [error, setError] = useState<string | null>(null);

  // Obtém o contexto de autenticação e a função para redirecionamento.
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Atualiza o estado do formulário conforme o utilizador preenche os campos.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lida com o envio do formulário e chama o serviço de login.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página.
    setError(null); // Reseta o erro antes de tentar o login.

    try {
      // Chama a função `doLogin` do serviço para autenticar o utilizador.
      const token = await doLogin(formData);

      // Armazena o token no localStorage para persistência.
      localStorage.setItem("token", token);

      // Define o token no contexto para manter o utilizador autenticado.
      setToken(token);

      // Redireciona para a página inicial após login bem-sucedido.
      navigate("/");
    } catch (err: any) {
      // Define a mensagem de erro retornada pelo serviço ou uma mensagem genérica.
      setError(err.response?.data?.message || "Erro ao fazer login.");
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ fontFamily: "Tahoma, sans-serif" }}>Login</h1>

      {/* Formulário de login */}
      <form onSubmit={handleSubmit} className="login-form">
        {/* Campo para o email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />

        {/* Campo para a senha */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />

        {/* Botão para submeter o formulário */}
        <button type="submit" className="login-button">
          Submit
        </button>
      </form>

      {/* Exibe uma mensagem de erro, se houver */}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Login;
