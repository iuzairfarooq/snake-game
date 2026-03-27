import React from 'react';
import { Point } from '@/hooks/useSnakeGame';

interface ControlsProps {
  changeDirection: (dir: Point) => void;
}

export default function Controls({ changeDirection }: ControlsProps) {
  return (
    <div className="mobile-controls">
      <button className="control-up" onClick={() => changeDirection({ x: 0, y: -1 })}>↑</button>
      <button className="control-left" onClick={() => changeDirection({ x: -1, y: 0 })}>←</button>
      <button className="control-down" onClick={() => changeDirection({ x: 0, y: 1 })}>↓</button>
      <button className="control-right" onClick={() => changeDirection({ x: 1, y: 0 })}>→</button>
    </div>
  );
}
