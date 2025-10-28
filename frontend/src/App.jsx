import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GameList from "./pages/GameList";
import GameDetail from "./pages/GameDetail";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

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
