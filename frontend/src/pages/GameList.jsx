import { useState, useEffect } from "react";
import { gameAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await gameAPI.getAllGames();
      setGames(response.data);
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => navigate(`/games/${game.id}`)}
          >
            <img
              src={game.headerImage}
              alt={game.name}
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
