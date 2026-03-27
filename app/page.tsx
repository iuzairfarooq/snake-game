'use client';

import React, { useState, useEffect } from 'react';
import Game from '@/components/Game';
import { toggleMute, getIsMuted } from '@/lib/audio';

export default function Page() {
  const [darkMode, setDarkMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Snake</h1>
        <div>
          <button className="theme-toggle" onClick={() => setIsMuted(toggleMute())} style={{ marginRight: '10px' }}>
            {isMuted ? '🔇 Muted' : '🔊 Sound'}
          </button>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>
      <main style={{ width: '100%' }}>
        <Game />
      </main>
      <div className="ai-enhancements">
        <h3>✨ AI Enhancements (Ideas)</h3>
        <ul>
          <li><strong>Adaptive Difficulty:</strong> Use an AI model to analyze player reaction times and dynamically adjust the speed curve or spawn obstacles to keep the game in the &quot;flow state&quot;.</li>
          <li><strong>AI Opponent:</strong> Train an RL agent (or use A* pathfinding) to control a second snake on the board competing for the same food.</li>
          <li><strong>Procedural Levels:</strong> Use LLMs to generate interesting maze layouts or obstacle patterns that change every 50 points.</li>
        </ul>
      </div>
    </div>
  );
}
