// CreateAccount.tsx
import React, { useState } from "react";

// Importa a função de serviço para criar a conta e a interface dos dados do formulário.
import { createAccountRequest, CreateAccountFormData } from "../modules/UserService";

// Importa o arquivo CSS para estilização.
import "../styles/CreateAccountStyle.css";

// Componente funcional para a página de criação de conta.
const CreateAccount: React.FC = () => {
  // Define o estado do formulário com os dados iniciais.
  const [formData, setFormData] = useState<CreateAccountFormData>({
    username: "",
    email: "",
    password: "",
    age: "",
  });

  // Estado para exibir mensagens de sucesso ou erro.
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para lidar com alterações nos campos do formulário.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página.
    setMessage(null);   // Reseta a mensagem de sucesso.
    setError(null);     // Reseta a mensagem de erro.

    try {
      // Envia os dados do formulário para o serviço que cria a conta.
      const response = await createAccountRequest(formData);
      setMessage(response.data.message); // Define a mensagem de sucesso retornada pelo serviço.
    } catch (err: any) {
      // Define a mensagem de erro caso a solicitação falhe.
      setError(err.response?.data?.message || "Erro ao criar conta.");
    }
  };

  // Renderiza o formulário e exibe mensagens de feedback.
  return (
    <div className="create-account-container">
      <h1 style={{ fontFamily: "Tahoma, sans-serif" }}>
        Create Account
      </h1>
      <form onSubmit={handleSubmit} className="create-account-form">
        {/* Campo para o nome de usuário */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="create-account-input"
          required
        />
        {/* Campo para o email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="create-account-input"
          required
        />
        {/* Campo para a senha */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="create-account-input"
          required
        />
        {/* Campo para a idade (opcional) */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="create-account-input"
        />
        {/* Botão para submeter o formulário */}
        <button
          type="submit"
          className="create-account-button"
          style={{ backgroundColor: "black", fontFamily: "Tahoma, sans-serif" }}
        >
          Create Account
        </button>
      </form>
      {/* Mensagem de sucesso, caso exista */}
      {message && <p className="create-account-success">{message}</p>}
      {/* Mensagem de erro, caso exista */}
      {error && <p className="create-account-error">{error}</p>}
    </div>
  );
};

export default CreateAccount;
