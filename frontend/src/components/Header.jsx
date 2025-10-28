import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const currentSteamId =
    new URLSearchParams(location.search).get("steamId") || "";

  return (
    <header className="app-header">
      <h1>Fog Game Stats</h1>
      <nav>
        <a href={`/?steamId=${currentSteamId}`}>ダッシュボード</a>
        <a href={`/games?steamId=${currentSteamId}`}>ゲーム一覧</a>
      </nav>
    </header>
  );
}

export default Header;
