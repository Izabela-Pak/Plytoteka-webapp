import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
  exp?: number;
}

const api = axios.create({
    baseURL: ""
})

//Dodanie tokenu JWT (JSON Web Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

//Pobieranie maila z tokena i sprawdzanie czasu wygaśnięcia
export const getEmailFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // brak exp → traktujemy jak nieważny token
    if (!decoded.exp) {
      localStorage.removeItem("token");
      return null;
    }

    // token wygasł
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    // brak sub → brak emaila
    if (!decoded.sub) {
      return null;
    }

    return decoded.sub;
  } catch (error) {
    console.error("Niepoprawny token", error);
    localStorage.removeItem("token");
    return null;
  }
};