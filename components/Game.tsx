import React, { useEffect, useRef } from 'react';
import { useSnakeGame, GRID_SIZE } from '@/hooks/useSnakeGame';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import Controls from './Controls';

export default function Game() {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  } = useSnakeGame();

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
        case 'Escape':
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, pauseGame]);

  // Touch controls (swipe)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        if (dx > 0) changeDirection({ x: 1, y: 0 });
        else changeDirection({ x: -1, y: 0 });
      }
    } else {
      if (Math.abs(dy) > 30) {
        if (dy > 0) changeDirection({ x: 0, y: 1 });
        else changeDirection({ x: 0, y: -1 });
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="game-container">
      <ScoreBoard score={score} highScore={highScore} />
      
      <div 
        className="board-wrapper"
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <GameBoard snake={snake} food={food} gridSize={GRID_SIZE} />
        
        {status === 'IDLE' && (
          <div className="overlay">
            <h2>Snake</h2>
            <button className="btn" onClick={startGame}>Play Game</button>
          </div>
        )}
        
        {status === 'PAUSED' && (
          <div className="overlay">
            <h2>Paused</h2>
            <button className="btn" onClick={pauseGame}>Resume</button>
          </div>
        )}
        
        {status === 'GAME_OVER' && (
          <div className="overlay">
            <h2>Game Over!</h2>
            <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Score: {score}</p>
            <button className="btn" onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>

      <Controls changeDirection={changeDirection} />
    </div>
  );
}
