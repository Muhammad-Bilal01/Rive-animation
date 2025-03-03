import { useState } from "react";
import "./App.css";
import BallAnimation from "./ball";
import SnakeGame from './components/SnakeGame';
import AstroTrash from './components/AstroTrash';
import TicTacToe from './components/TicTacToe';

function App() {
  const [activeGame, setActiveGame] = useState("face-viseme");

  const renderContent = () => {
    switch (activeGame) {
      case "face-viseme":
        return <BallAnimation />;
      case "snake":
        return <SnakeGame />;
      case "astro":
        return <AstroTrash />;
      case "snak":
        return <TicTacToe />;
      default:
        return <BallAnimation />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <h1>GameVerse<span className="game-icon" style={{marginLeft: "10px", fontSize: "2rem"}}>🚀</span></h1>
        </div>
        <nav className="header-nav">
          <button className="nav-link active">Home</button>
          <button className="nav-link">Games</button>
          <button className="nav-link">Contact</button>
        </nav>
      </header>

      {/* Main content area with sidebar */}
      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Games</h2>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <button 
                  className={`nav-button ${activeGame === "face-viseme" ? "active" : ""}`}
                  onClick={() => setActiveGame("face-viseme")}
                >
                  <span className="game-icon">😀</span>
                  Face Viseme
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeGame === "snake" ? "active" : ""}`}
                  onClick={() => setActiveGame("snake")}
                >
                  <span className="game-icon">🐍</span>
                  Snake Game
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeGame === "astro" ? "active" : ""}`}
                  onClick={() => setActiveGame("astro")}
                >
                  <span className="game-icon">🚀</span>
                  Astro Trash
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeGame === "snak" ? "active" : ""}`}
                  onClick={() => setActiveGame("snak")}
                >
                  <span className="game-icon">🎮</span>
                  Tik Tac Toe
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
