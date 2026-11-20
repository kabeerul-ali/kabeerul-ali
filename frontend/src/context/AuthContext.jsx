
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        setAdmin(response.admin);
      } catch (error) {
        localStorage.removeItem("adminToken");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!response.token) {
      throw new Error("Authentication token was not received");
    }

    localStorage.setItem("adminToken", response.token);
    setAdmin(response.admin);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: Boolean(admin),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
