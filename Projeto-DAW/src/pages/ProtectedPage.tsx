import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedPage: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <p>Carregando... ou não autenticado!</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Protected Page</h1>
      {/* Use non-null assertion or optional chaining */}
      <p>Bem-vindo, {user!.email}!</p>
      <button onClick={logout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default ProtectedPage;
