import { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from './useInterval';
import { initAudio, playEatSound, playGameOverSound } from '@/lib/audio';

export type Point = { x: number; y: number };
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // UP
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_DECREMENT = 3;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>(() => generateFood(INITIAL_SNAKE));
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('snakeHighScore');
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Use refs for state that needs to be accessed in the interval without causing re-renders/re-bindings
  const directionRef = useRef(direction);
  // Track if a move has been processed since the last direction change
  // This prevents rapid double key presses from reversing the snake into itself
  const moveProcessedRef = useRef(true);

  const startGame = useCallback(() => {
    initAudio();
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    moveProcessedRef.current = true;
    setFood(generateFood(INITIAL_SNAKE));
    setStatus('PLAYING');
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, []);

  const pauseGame = useCallback(() => {
    if (status === 'PLAYING') setStatus('PAUSED');
    else if (status === 'PAUSED') setStatus('PLAYING');
  }, [status]);

  const gameOver = useCallback(() => {
    setStatus('GAME_OVER');
    playGameOverSound();
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const moveSnake = useCallback(() => {
    if (status !== 'PLAYING') return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(generateFood(newSnake));
        playEatSound();
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      moveProcessedRef.current = true;
      return newSnake;
    });
  }, [status, food, gameOver]);

  useInterval(moveSnake, status === 'PLAYING' ? speed : null);

  const changeDirection = useCallback((newDir: Point) => {
    // Prevent changing direction multiple times before a move is processed
    if (!moveProcessedRef.current) return;

    const currentDir = directionRef.current;
    
    // Prevent 180 degree turns
    if (currentDir.x === 0 && newDir.x === 0) return; // Up/Down to Down/Up
    if (currentDir.y === 0 && newDir.y === 0) return; // Left/Right to Right/Left

    directionRef.current = newDir;
    setDirection(newDir);
    moveProcessedRef.current = false;
  }, []);

  return {
    snake,
    direction,
    food,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  };
}
