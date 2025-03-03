import React, { useState, useEffect } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const calculateWinner = (squares: Board): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Check for winner
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    // Check for draw
    if (squares.every(square => square !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'Draw') {
        setScores(prev => ({
          ...prev,
          [gameWinner]: prev[gameWinner as keyof typeof prev] + 1
        }));
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (index: number) => {
    const isWinningSquare = false; // TODO: Implement winning line highlight
    return (
      <button
        className={`square ${board[index] ? 'filled' : ''} ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="tic-tac-toe">
      <div className="game-info">
        <div className="scores">
          <div className="score">
            <span className="player x">X</span>
            <span className="score-value">{scores.X}</span>
          </div>
          <div className="score">
            <span className="player o">O</span>
            <span className="score-value">{scores.O}</span>
          </div>
        </div>
        
        {winner ? (
          <div className="status">
            {winner === 'Draw' ? (
              "It's a Draw!"
            ) : (
              <>Player {winner} Wins!</>
            )}
          </div>
        ) : (
          <div className="status">
            Next Player: {isXNext ? 'X' : 'O'}
          </div>
        )}
      </div>

      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>

      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
};

export default TicTacToe; 