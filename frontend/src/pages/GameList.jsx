import { useState, useEffect, useCallback } from "react";
import { gameAPI } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const steamId = searchParams.get("steamId") || "";
  const navigate = useNavigate();

  const fetchGames = useCallback(async () => {
    try {
      const response = await gameAPI.getPlaytimeForUser(steamId);

      const gamesWithPlaytime = response.data.map((record) => ({
        id: record.game.id,
        appId: record.game.appId,
        name: record.game.name,
        headerImage: record.game.headerImage,
        playtimeForever: record.totalMinutesPlayed,
      }));

      setGames(gamesWithPlaytime);
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  }, [steamId]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">ゲームを読み込み中...</div>;

  return (
    <div className="game-list-page">
      <h2>ゲームライブラリ ({games.length}本)</h2>

      <input
        type="text"
        placeholder="ゲームを検索..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="games-grid">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => navigate(`/games/${game.id}?steamId=${steamId}`)}
          >
            <img
              src={game.headerImage}
              alt="Game icon"
              onError={(e) => (e.target.src = "https://via.placeholder.com/64")}
            />
            <div className="game-info">
              <h3>{game.name}</h3>
              <p>{Math.floor((game.playtimeForever || 0) / 60)}時間プレイ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameList;
