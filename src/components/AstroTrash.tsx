import React, { useState, useEffect, useCallback } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Trash extends GameObject {
  speed: number;
}

const AstroTrash = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ship, setShip] = useState<GameObject>({
    x: window.innerWidth / 2,
    y: window.innerHeight - 100,
    width: 50,
    height: 50
  });
  const [trash, setTrash] = useState<Trash[]>([]);
  const [gameArea, setGameArea] = useState({
    width: 800,
    height: 600
  });

  // Initialize game area size
  useEffect(() => {
    const updateGameArea = () => {
      setGameArea({
        width: Math.min(800, window.innerWidth - 40),
        height: 600
      });
      setShip(prev => ({
        ...prev,
        x: Math.min(800, window.innerWidth - 40) / 2
      }));
    };

    updateGameArea();
    window.addEventListener('resize', updateGameArea);
    return () => window.removeEventListener('resize', updateGameArea);
  }, []);

  // Generate new trash
  const generateTrash = useCallback(() => {
    if (!isPlaying) return;
    
    const newTrash: Trash = {
      x: Math.random() * (gameArea.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 2 + Math.random() * 3
    };
    
    setTrash(prev => [...prev, newTrash]);
  }, [gameArea.width, isPlaying]);

  // Move ship with keyboard
  useEffect(() => {
    if (!isPlaying) return;

    const moveShip = (e: KeyboardEvent) => {
      const speed = 20;
      setShip(prev => {
        let newX = prev.x;
        
        if (e.key === 'ArrowLeft') {
          newX = Math.max(0, prev.x - speed);
        } else if (e.key === 'ArrowRight') {
          newX = Math.min(gameArea.width - prev.width, prev.x + speed);
        }

        return {
          ...prev,
          x: newX
        };
      });
    };

    window.addEventListener('keydown', moveShip);
    return () => window.removeEventListener('keydown', moveShip);
  }, [gameArea.width, isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      // Move trash down
      setTrash(prevTrash => {
        const updatedTrash = prevTrash.map(item => ({
          ...item,
          y: item.y + item.speed
        })).filter(item => item.y < gameArea.height);

        // Check collisions
        updatedTrash.forEach(item => {
          if (
            item.x < ship.x + ship.width &&
            item.x + item.width > ship.x &&
            item.y < ship.y + ship.height &&
            item.y + item.height > ship.y
          ) {
            setScore(prev => prev + 1);
            updatedTrash.splice(updatedTrash.indexOf(item), 1);
          }
        });

        // Game over if trash reaches bottom
        if (updatedTrash.some(item => item.y + item.height >= gameArea.height)) {
          setIsGameOver(true);
          setIsPlaying(false);
        }

        return updatedTrash;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [isPlaying, ship, gameArea.height]);

  // Generate new trash periodically
  useEffect(() => {
    if (!isPlaying) return;

    const trashInterval = setInterval(generateTrash, 1000);
    return () => clearInterval(trashInterval);
  }, [isPlaying, generateTrash]);

  const startGame = () => {
    setScore(0);
    setTrash([]);
    setIsGameOver(false);
    setIsPlaying(true);
    setShip(prev => ({
      ...prev,
      x: gameArea.width / 2
    }));
  };

  return (
    <div className="astro-trash">
      <div className="game-info">
        <h2>Score: {score}</h2>
        {!isPlaying && (
          <button onClick={startGame} className="start-button">
            {isGameOver ? 'Play Again' : 'Start Game'}
          </button>
        )}
        {isGameOver && <div className="game-over">Game Over!</div>}
      </div>
      <div 
        className="game-board"
        style={{
          width: gameArea.width,
          height: gameArea.height,
          position: 'relative',
          backgroundColor: '#0a192f',
          overflow: 'hidden',
          borderRadius: '8px'
        }}
      >
        {/* Ship */}
        <div
          style={{
            position: 'absolute',
            left: ship.x,
            bottom: 20,
            width: ship.width,
            height: ship.height,
            backgroundColor: '#00ff88',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transition: 'left 0.1s'
          }}
        />
        
        {/* Trash */}
        {trash.map((item, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              backgroundColor: '#ff3860',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>
      {isPlaying && (
        <div className="game-controls">
          <p>Use ← → arrow keys to move the ship</p>
        </div>
      )}
    </div>
  );
};

export default AstroTrash; 