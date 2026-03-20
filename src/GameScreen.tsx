import React from 'react';
import { GameSettingsContextProvider } from './GameSettingsContext';
import { GameResultContextProvider } from './GameResultContext';
import { GameRunner } from './GameRunner';
import { GameTable } from './GameTable';
import { UserData } from './types';
import './GameScreen.css';

interface Props {
  user: UserData;
  onGameEnd: (coins: number) => void;
  onShowLeaderboard: () => void;
}

export const GameScreen: React.FC<Props> = ({ user, onGameEnd, onShowLeaderboard }) => {
  return (
    <div className="game-screen">
      <div className="game-top-bar">
        <div className="game-top-left">
          <span className="game-top-logo-dot" />
          <span className="game-top-title">DEV GAME</span>
        </div>
        <div className="game-top-right">
          <span className="game-top-user">{user.nickname || user.name}</span>
          <button className="game-top-lb-btn" onClick={onShowLeaderboard}>
            🏆 Лидерборд
          </button>
        </div>
      </div>

      <GameSettingsContextProvider>
        <GameResultContextProvider>
          <GameRunner onGameEnd={onGameEnd} />
          <GameTable />
        </GameResultContextProvider>
      </GameSettingsContextProvider>
    </div>
  );
};
