import { useState, useEffect } from "react";
import { gameAPI } from "../services/api";

function Dashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [steamId, setSteamId] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getAllGames();
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError("ゲームの読み込みに失敗しました。");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!steamId.trim()) {
      alert("Steam IDを入力してください");
      return;
    }

    try {
      setSyncing(true);
      await gameAPI.syncGames(steamId);
      await fetchGames();
      alert("ゲームの同期が完了しました！");
    } catch (err) {
      alert("同期に失敗しました: " + err.message);
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="loading">ゲームを読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalGames = games.length;
  const totalPlaytime = games.reduce(
    (sum, game) => sum + (game.playtimeForever || 0),
    0
  );
  const totalHours = Math.floor(totalPlaytime / 60);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>ゲーム統計ダッシュボード</h2>

        <div className="sync-container">
          <input
            type="text"
            placeholder="Steam IDを入力"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            className="steam-id-input"
          />
          <button
            onClick={handleSync}
            disabled={syncing}
            className="sync-button"
          >
            {syncing ? "同期中..." : "同期"}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>総ゲーム数</h3>
          <p className="stat-number">{totalGames}</p>
        </div>

        <div className="stat-card">
          <h3>総プレイ時間</h3>
          <p className="stat-number">{totalHours.toLocaleString()}時間</p>
        </div>

        <div className="stat-card">
          <h3>平均プレイ時間/ゲーム</h3>
          <p className="stat-number">
            {totalGames > 0 ? (totalHours / totalGames).toFixed(1) : 0}時間
          </p>
        </div>
      </div>

      <div className="top-games">
        <h3>最もプレイしたゲーム TOP5</h3>
        <div className="game-list">
          {games
            .sort((a, b) => (b.playtimeForever || 0) - (a.playtimeForever || 0))
            .slice(0, 5)
            .map((game) => (
              <div key={game.id} className="game-item">
                <img
                  src={game.headerImage}
                  alt={game.name}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/32")
                  }
                />
                <span className="game-name">{game.name}</span>
                <span className="game-hours">
                  {Math.floor((game.playtimeForever || 0) / 60)}時間
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
