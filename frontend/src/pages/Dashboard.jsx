import { useState, useEffect } from "react";
import { gameAPI } from "../services/api";
import { useSearchParams } from "react-router-dom";

function Dashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [steamId, setSteamId] = useState(searchParams.get("steamId") || "");

  useEffect(() => {
    const loadGames = async () => {
      if (!steamId.trim()) {
        setGames([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await gameAPI.getPlaytimeForUser(steamId);

        const gamesWithPlaytime = response.data.map((record) => ({
          id: record.game.id,
          appId: record.game.appId,
          name: record.game.name,
          headerImage: record.game.headerImage,
          playtimeForever: record.totalMinutesPlayed,
          playtime2Weeks: 0,
        }));

        setGames(gamesWithPlaytime);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError(
            "このユーザーのデータがありません。同期ボタンを押してください。"
          );
          setGames([]);
        } else {
          setError("ゲームの読み込みに失敗しました。");
        }
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [steamId]);

  const handleSync = async () => {
    if (!steamId.trim()) {
      alert("Steam IDを入力してください");
      return;
    }

    try {
      setSyncing(true);
      await gameAPI.syncGames(steamId);
      setSearchParams({ steamId });

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
            onChange={(e) => {
              const newSteamId = e.target.value;
              setSteamId(newSteamId);
              if (newSteamId) {
                setSearchParams({ steamId: newSteamId });
              } else {
                setSearchParams({});
              }
            }}
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
                  alt="Game icon"
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
