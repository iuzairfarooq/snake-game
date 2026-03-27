import React from 'react';
import { Point } from '@/hooks/useSnakeGame';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  gridSize: number;
}

export default function GameBoard({ snake, food, gridSize }: GameBoardProps) {
  // Create a grid array
  const grid = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const x = i % gridSize;
    const y = Math.floor(i / gridSize);
    return { x, y };
  });

  return (
    <div 
      className="game-board"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }}
    >
      {grid.map((cell) => {
        const isHead = snake[0].x === cell.x && snake[0].y === cell.y;
        const isBody = snake.some((segment, idx) => idx !== 0 && segment.x === cell.x && segment.y === cell.y);
        const isFood = food.x === cell.x && food.y === cell.y;

        let className = 'cell';
        if (isHead) className += ' snake-head';
        else if (isBody) className += ' snake-body';
        else if (isFood) className += ' food';

        return <div key={`${cell.x}-${cell.y}`} className={className} />;
      })}
    </div>
  );
}
