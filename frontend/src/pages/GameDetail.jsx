import { useState, useEffect } from "react";
import { gameAPI } from "../services/api";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const steamId = searchParams.get("steamId") || "";
  const [playtimeRecord, setPlaytimeRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!steamId) {
        console.error("No Steam ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching playtime for steamId:", steamId, "gameId:", id);
        const response = await gameAPI.getPlaytimeForGame(steamId, id);
        setPlaytimeRecord(response.data);
      } catch (err) {
        console.error("Error fetching game details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id, steamId]);

  if (loading) return <div className="loading">ゲーム詳細を読み込み中...</div>;
  if (!playtimeRecord)
    return <div className="error">ゲームが見つかりません</div>;

  const game = playtimeRecord.game;
  const totalHours = Math.floor((playtimeRecord.totalMinutesPlayed || 0) / 60);

  return (
    <div className="game-detail">
      <button
        onClick={() => navigate(`/games?steamId=${steamId}`)}
        className="back-button"
      >
        ← ゲーム一覧に戻る
      </button>

      <div className="game-header">
        <img
          src={game.headerImage}
          alt={game.name}
          className="game-icon-large"
          onError={(e) => (e.target.src = "https://via.placeholder.com/128")}
        />
        <div>
          <h2>{game.name}</h2>
          <p>Steam App ID: {game.appId}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>総プレイ時間</h3>
          <p className="stat-number">{totalHours}時間</p>
        </div>

        <div className="stat-card">
          <h3>記録日時</h3>
          <p className="stat-number">
            {new Date(playtimeRecord.recordedAt).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
