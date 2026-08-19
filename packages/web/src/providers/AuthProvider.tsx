import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "../lib/api-client";
import { getErrorMessage } from "../lib/error-handler";
import axios from "axios";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount — access token cookie is sent automatically
  useEffect(() => {
    apiClient
      .get<{ data: AuthUser }>("/auth/me")
      .then(({ data }) => setUser(data.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<void> {
    try {
      const { data } = await apiClient.post<{
        data: { user: AuthUser };
      }>("/auth/login", { email, password });
      setUser(data.data.user);
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      if (axios.isAxiosError(err)) {
        console.log("STATUS:", err.response?.status);
        console.log("RESPONSE DATA:", err.response?.data);
      }

      throw new Error(getErrorMessage(err, "Login failed."));
    }
  }

  async function register(
    email: string,
    password: string,
    name: string,
  ): Promise<void> {
    try {
      await apiClient.post("/auth/register", { email, password, name });
    } catch (err) {
      throw new Error(getErrorMessage(err, "Registration failed. "));
    }

  }

  async function logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within <AuthProvider>");
  return ctx;
}
