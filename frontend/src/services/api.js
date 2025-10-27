import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const gameAPI = {
  getAllGames: () => api.get("/games"),

  getGameById: (id) => api.get(`/games/${id}`),

  syncGames: (steamId) => api.post(`/sync/user/${steamId}`),

  getGameStats: (gameId) => api.get(`/games/${gameId}/stats`),
};

export const playerAPI = {
  getPlayer: (steamId) => api.get(`/players/${steamId}`),
  updatePlayer: (steamId, data) => api.put(`/players/${steamId}`, data),
};

export default api;
