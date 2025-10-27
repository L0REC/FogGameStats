import { useState, useEffect } from "react";
import { gameAPI } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await gameAPI.getGameById(id);
        setGame(response.data);
      } catch (err) {
        console.error("Error fetching game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <div className="loading">ゲーム詳細を読み込み中...</div>;
  if (!game) return <div className="error">ゲームが見つかりません</div>;

  const totalHours = Math.floor((game.playtimeForever || 0) / 60);
  const recentHours = Math.floor((game.playtime2Weeks || 0) / 60);

  return (
    <div className="game-detail">
      <button onClick={() => navigate("/games")} className="back-button">
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
          <h3>最近2週間</h3>
          <p className="stat-number">{recentHours}時間</p>
        </div>

        <div className="stat-card">
          <h3>最後にプレイ</h3>
          <p className="stat-number">
            {game.rtimeLastPlayed
              ? new Date(game.rtimeLastPlayed * 1000).toLocaleDateString(
                  "ja-JP"
                )
              : "未プレイ"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
