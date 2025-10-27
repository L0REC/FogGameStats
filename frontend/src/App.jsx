import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GameList from "./pages/GameList";
import GameDetail from "./pages/GameDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Fog Game Stats</h1>
          <nav>
            <a href="/">ダッシュボード</a>
            <a href="/games">ゲーム一覧</a>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/games/:id" element={<GameDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
