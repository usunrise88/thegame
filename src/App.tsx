import React, { useState, useEffect } from 'react';
import './App.css';
import { Registration } from './Registration';
import { GameScreen } from './GameScreen';
import { Leaderboard } from './Leaderboard';
import { UserData, LeaderboardEntry } from './types';

type Screen = 'registration' | 'game' | 'leaderboard';

function App() {
  const [screen, setScreen] = useState<Screen>('registration');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('devgame_current_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleRegistration = (user: UserData) => {
    setCurrentUser(user);
    localStorage.setItem('devgame_current_user', JSON.stringify(user));
    setScreen('game');
  };

  const handleGameEnd = (coins: number) => {
    if (!currentUser) return;
    const entry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: currentUser.name,
      nickname: currentUser.nickname,
      coins,
      date: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('devgame_leaderboard') || '[]');
    existing.push(entry);
    existing.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.coins - a.coins);
    localStorage.setItem('devgame_leaderboard', JSON.stringify(existing));
    setScreen('leaderboard');
  };

  const handlePlayAgain = () => {
    setScreen('game');
  };

  const handleNewPlayer = () => {
    localStorage.removeItem('devgame_current_user');
    setCurrentUser(null);
    setScreen('registration');
  };

  const handleShowLeaderboard = () => {
    setScreen('leaderboard');
  };

  return (
    <div className="App">
      <div className="app-bg-decoration">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
      </div>

      {screen === 'registration' && (
        <Registration
          onRegister={handleRegistration}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          user={currentUser!}
          onGameEnd={handleGameEnd}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
      {screen === 'leaderboard' && (
        <Leaderboard
          onPlayAgain={handlePlayAgain}
          onNewPlayer={handleNewPlayer}
        />
      )}
    </div>
  );
}

export default App;
