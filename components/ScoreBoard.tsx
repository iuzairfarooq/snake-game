import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export default function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className="scoreboard">
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
    </div>
  );
}
