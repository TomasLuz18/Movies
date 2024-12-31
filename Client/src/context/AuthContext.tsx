// context/AuthContext.tsx
import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: { username: string; email: string } | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => { },
  user: null,
  logout: () => { },
});
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token); // Decodifica o token
        setUser({
          username: decoded.username, // Agora inclui o username
          email: decoded.email,
        });
      } catch (err) {
        console.error("Token inválido.");
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};