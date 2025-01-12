// context/AuthContext.tsx
import { jwtDecode } from "jwt-decode"; // Importa a função para decodificar o token JWT.
import React, { createContext, useState, useEffect } from "react";

// Interface para definir o formato do contexto de autenticação.
interface AuthContextType {
  token: string | null; // Token JWT armazenado.
  setToken: (token: string | null) => void; // Função para atualizar o token.
  user: { username: string; email: string } | null; // Informações do utilizador autenticado.
  logout: () => void; // Função para realizar o logout.
}

// Cria o contexto de autenticação com valores padrão.
export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => { }, // Função vazia padrão.
  user: null,
  logout: () => { }, // Função vazia padrão.
});

// Componente AuthProvider para gerenciar o estado de autenticação.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para armazenar o token JWT, inicializado com o valor armazenado no localStorage.
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Estado para armazenar as informações do utilizador decodificadas do token.
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  // Efeito para decodificar o token JWT e extrair as informações do utilizador.
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token); // Decodifica o token.
        setUser({
          username: decoded.username, // Extrai o nome de utilizador do token.
          email: decoded.email, // Extrai o email do token.
        });
      } catch (err) {
        console.error("Token inválido."); // Exibe um erro se o token não puder ser decodificado.
        setUser(null); // Reseta as informações do utilizador.
        setToken(null); // Reseta o token.
        localStorage.removeItem("token"); // Remove o token inválido do localStorage.
      }
    } else {
      setUser(null); // Reseta o utilizador caso não haja token.
    }
  }, [token]); // Executa sempre que o token mudar.

  // Função para realizar o logout do utilizador.
  const logout = () => {
    setToken(null); // Reseta o token no estado.
    setUser(null); // Reseta as informações do utilizador.
    localStorage.removeItem("token"); // Remove o token do localStorage.
  };

  // Retorna o provedor do contexto de autenticação com os valores necessários.
  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children} {/* Renderiza os filhos do AuthProvider */}
    </AuthContext.Provider>
  );
};
