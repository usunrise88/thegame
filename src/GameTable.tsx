import React, { useState } from "react";
import { useGameResultContext } from "./GameResultContext";
import { TaskInfo } from "./TaskInfo";

export const GameTable: React.FC = () => {
  const { gameResult } = useGameResultContext();
  const [expandedCol, setExpandedCol] = useState<number | null>(null);

  const toggleCol = (colIndex: number) => {
    setExpandedCol(expandedCol === colIndex ? null : colIndex);
  };

  const getColColor = (index: number): string => {
    const colors = [
      '#6B2FA0', '#7C3AED', '#8B5CF6', '#9333EA',
      '#A855F7', '#C084FC', '#D946EF', '#E84D8A',
      '#EC4899', '#F472B6', '#7C3AED', '#22C55E'
    ];
    return colors[index] || '#6B2FA0';
  };

  return (
    <div className="game-board">
      <div className="board-scroll">
        <div className="board-columns">
          {gameResult.colNames.map((name, colIndex) => {
            const tasks = gameResult.cols[colIndex];
            const isExpanded = expandedCol === colIndex;
            const hasCards = tasks.length > 0;

            return (
              <div
                key={colIndex}
                className={`board-column ${isExpanded ? 'board-column-expanded' : ''} ${hasCards ? 'board-column-has-cards' : ''}`}
              >
                <div
                  className="board-column-header"
                  onClick={() => toggleCol(colIndex)}
                  style={{ borderTopColor: getColColor(colIndex) }}
                >
                  <span className="board-col-name">{name}</span>
                  <span className="board-col-count" style={{ background: getColColor(colIndex) }}>
                    {tasks.length}
                  </span>
                </div>
                <div className="board-column-cards">
                  {tasks.map((_task, index) => (
                    <TaskInfo key={`${colIndex}-${index}`} col={colIndex} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
