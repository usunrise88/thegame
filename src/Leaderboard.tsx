import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from './types';
import './Leaderboard.css';

interface Props {
  onPlayAgain: () => void;
  onNewPlayer: () => void;
}

export const Leaderboard: React.FC<Props> = ({ onPlayAgain, onNewPlayer }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [slidePage, setSlidePage] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('devgame_leaderboard') || '[]');
    data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.coins - a.coins);
    setEntries(data);
  }, []);

  const top10 = entries.slice(0, 10);
  const rest = entries.slice(10);
  const totalRestPages = Math.ceil(rest.length / 10);
  const currentRestPage = rest.slice(slidePage * 10, (slidePage + 1) * 10);

  const nextPage = useCallback(() => {
    if (totalRestPages > 0) {
      setSlidePage(prev => (prev + 1) % totalRestPages);
    }
  }, [totalRestPages]);

  useEffect(() => {
    if (totalRestPages <= 0) return;
    const interval = setInterval(nextPage, 5000);
    return () => clearInterval(interval);
  }, [totalRestPages, nextPage]);

  const formatCoins = (n: number) => n.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const displayName = (entry: LeaderboardEntry) => entry.nickname || entry.name;

  return (
    <div className="lb-container">
      <div className="lb-content">
        <div className="lb-header">
          <div className="lb-logo">
            <span className="lb-logo-dot" />
            <span className="lb-logo-text">DEV GAME</span>
          </div>
          <h1 className="lb-title">Лидерборд</h1>
          <p className="lb-subtitle">Лучшие менеджеры стартапов</p>
        </div>

        <div className="lb-body">
          {/* Left: Top 10 */}
          <div className="lb-top-section">
            <h2 className="lb-section-title">
              <span className="lb-section-icon">🏆</span> Топ-10
            </h2>
            <div className="lb-top-list">
              {top10.length === 0 && (
                <div className="lb-empty">
                  Пока никто не играл.<br />Будь первым!
                </div>
              )}
              {top10.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`lb-entry lb-entry-top ${i < 3 ? 'lb-entry-medal' : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="lb-rank">
                    {getMedal(i + 1) || <span className="lb-rank-num">{i + 1}</span>}
                  </div>
                  <div className="lb-entry-info">
                    <span className="lb-entry-name">{displayName(entry)}</span>
                  </div>
                  <div className="lb-entry-coins">
                    {formatCoins(entry.coins)} <span className="lb-coin-label">coin</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Rest + QR */}
          <div className="lb-right-section">
            {rest.length > 0 && (
              <div className="lb-rest-section">
                <h2 className="lb-section-title">
                  <span className="lb-section-icon">📊</span> Остальные участники
                </h2>
                <div className="lb-rest-list">
                  {currentRestPage.map((entry, i) => {
                    const rank = 10 + slidePage * 10 + i + 1;
                    return (
                      <div
                        key={entry.id}
                        className="lb-entry lb-entry-rest"
                        style={{ animationDelay: `${i * 0.03}s` }}
                      >
                        <div className="lb-rank">
                          <span className="lb-rank-num">{rank}</span>
                        </div>
                        <div className="lb-entry-info">
                          <span className="lb-entry-name">{displayName(entry)}</span>
                        </div>
                        <div className="lb-entry-coins">
                          {formatCoins(entry.coins)} <span className="lb-coin-label">coin</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {totalRestPages > 1 && (
                  <div className="lb-pagination">
                    {Array.from({ length: totalRestPages }, (_, i) => (
                      <button
                        key={i}
                        className={`lb-page-dot ${i === slidePage ? 'lb-page-dot-active' : ''}`}
                        onClick={() => setSlidePage(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="lb-qr-section">
              <div className="lb-qr-placeholder">
                <div className="lb-qr-icon">📱</div>
                <p className="lb-qr-text">QR-код для начала игры</p>
                <div className="lb-qr-box">
                  <svg viewBox="0 0 100 100" className="lb-qr-svg">
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="#C084FC" />
                    <rect x="70" y="5" width="25" height="25" rx="3" fill="#C084FC" />
                    <rect x="5" y="70" width="25" height="25" rx="3" fill="#C084FC" />
                    <rect x="10" y="10" width="15" height="15" rx="2" fill="#0D0D1A" />
                    <rect x="75" y="10" width="15" height="15" rx="2" fill="#0D0D1A" />
                    <rect x="10" y="75" width="15" height="15" rx="2" fill="#0D0D1A" />
                    <rect x="14" y="14" width="7" height="7" rx="1" fill="#C084FC" />
                    <rect x="79" y="14" width="7" height="7" rx="1" fill="#C084FC" />
                    <rect x="14" y="79" width="7" height="7" rx="1" fill="#C084FC" />
                    <rect x="35" y="5" width="5" height="5" fill="#E84D8A" />
                    <rect x="45" y="5" width="5" height="5" fill="#C084FC" />
                    <rect x="55" y="5" width="5" height="5" fill="#E84D8A" />
                    <rect x="35" y="15" width="5" height="5" fill="#C084FC" />
                    <rect x="45" y="15" width="5" height="5" fill="#E84D8A" />
                    <rect x="55" y="15" width="5" height="5" fill="#C084FC" />
                    <rect x="35" y="25" width="5" height="5" fill="#E84D8A" />
                    <rect x="45" y="25" width="5" height="5" fill="#C084FC" />
                    <rect x="5" y="35" width="5" height="5" fill="#E84D8A" />
                    <rect x="15" y="35" width="5" height="5" fill="#C084FC" />
                    <rect x="25" y="35" width="5" height="5" fill="#E84D8A" />
                    <rect x="35" y="35" width="5" height="5" fill="#C084FC" />
                    <rect x="45" y="35" width="5" height="5" fill="#E84D8A" />
                    <rect x="55" y="35" width="5" height="5" fill="#C084FC" />
                    <rect x="65" y="35" width="5" height="5" fill="#E84D8A" />
                    <rect x="75" y="35" width="5" height="5" fill="#C084FC" />
                    <rect x="85" y="35" width="5" height="5" fill="#E84D8A" />
                    <rect x="5" y="45" width="5" height="5" fill="#C084FC" />
                    <rect x="15" y="45" width="5" height="5" fill="#E84D8A" />
                    <rect x="35" y="45" width="5" height="5" fill="#E84D8A" />
                    <rect x="45" y="45" width="5" height="5" fill="#C084FC" />
                    <rect x="55" y="45" width="5" height="5" fill="#E84D8A" />
                    <rect x="75" y="45" width="5" height="5" fill="#E84D8A" />
                    <rect x="85" y="45" width="5" height="5" fill="#C084FC" />
                    <rect x="5" y="55" width="5" height="5" fill="#E84D8A" />
                    <rect x="25" y="55" width="5" height="5" fill="#C084FC" />
                    <rect x="35" y="55" width="5" height="5" fill="#C084FC" />
                    <rect x="45" y="55" width="5" height="5" fill="#E84D8A" />
                    <rect x="55" y="55" width="5" height="5" fill="#C084FC" />
                    <rect x="65" y="55" width="5" height="5" fill="#E84D8A" />
                    <rect x="75" y="55" width="5" height="5" fill="#C084FC" />
                    <rect x="85" y="55" width="5" height="5" fill="#E84D8A" />
                    <rect x="35" y="65" width="5" height="5" fill="#C084FC" />
                    <rect x="55" y="65" width="5" height="5" fill="#E84D8A" />
                    <rect x="65" y="65" width="5" height="5" fill="#C084FC" />
                    <rect x="75" y="70" width="5" height="5" fill="#E84D8A" />
                    <rect x="85" y="70" width="5" height="5" fill="#C084FC" />
                    <rect x="35" y="75" width="5" height="5" fill="#E84D8A" />
                    <rect x="45" y="75" width="5" height="5" fill="#C084FC" />
                    <rect x="55" y="75" width="5" height="5" fill="#E84D8A" />
                    <rect x="65" y="75" width="5" height="5" fill="#C084FC" />
                    <rect x="75" y="80" width="5" height="5" fill="#E84D8A" />
                    <rect x="85" y="80" width="5" height="5" fill="#C084FC" />
                    <rect x="35" y="85" width="5" height="5" fill="#C084FC" />
                    <rect x="45" y="85" width="5" height="5" fill="#E84D8A" />
                    <rect x="65" y="85" width="5" height="5" fill="#E84D8A" />
                    <rect x="75" y="90" width="5" height="5" fill="#C084FC" />
                    <rect x="85" y="90" width="5" height="5" fill="#E84D8A" />
                  </svg>
                </div>
                <p className="lb-qr-hint">Отсканируй, чтобы начать</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lb-actions">
          <button className="lb-btn lb-btn-primary" onClick={onPlayAgain}>
            Играть снова
          </button>
          <button className="lb-btn lb-btn-secondary" onClick={onNewPlayer}>
            Новый игрок
          </button>
        </div>
      </div>
    </div>
  );
};
