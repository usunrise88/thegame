import React from "react";
import { Task, useGameResultContext } from "./GameResultContext";
import { useGameSettingsContext } from "./GameSettingsContext";

interface Props {
  col: number;
  index: number;
}

export const TaskInfo: React.FC<Props> = ({ col, index }) => {
  const { gameResult, setGameResult } = useGameResultContext();
  const { initParams } = useGameSettingsContext();

  const task = gameResult.cols[col][index];

  const calcPrimeCost = (t: Task) =>
    t.product * initParams.products.weekMoney / initParams.products.weekPower +
    t.designer * initParams.designers.weekMoney / initParams.designers.weekPower +
    t.editor * initParams.editors.weekMoney / initParams.editors.weekPower +
    t.developer * initParams.developers.weekMoney / initParams.developers.weekPower +
    t.tester * initParams.testers.weekMoney / initParams.testers.weekPower;

  const takeToDo = () => {
    const r = gameResult.clone();
    r.cols[1].push(...r.cols[0].splice(index, 1));
    setGameResult(r);
  };

  const toBacklog = () => {
    const r = gameResult.clone();
    r.cols[0].unshift(...r.cols[1].splice(index, 1));
    setGameResult(r);
  };

  const moveToTop = () => {
    if (index === 0) return;
    const r = gameResult.clone();
    r.cols[col].splice(0, 0, ...r.cols[col].splice(index, 1));
    setGameResult(r);
  };

  const moveUp = () => {
    if (index === 0) return;
    const r = gameResult.clone();
    r.cols[col].splice(index - 1, 0, ...r.cols[col].splice(index, 1));
    setGameResult(r);
  };

  const moveDown = () => {
    if (index >= gameResult.cols[col].length - 1) return;
    const r = gameResult.clone();
    r.cols[col].splice(index + 1, 0, ...r.cols[col].splice(index, 1));
    setGameResult(r);
  };

  const moveToBottom = () => {
    const length = gameResult.cols[col].length;
    if (index >= length - 1) return;
    const r = gameResult.clone();
    r.cols[col].splice(length - 1, 0, ...r.cols[col].splice(index, 1));
    setGameResult(r);
  };

  const isDone = task.endWeek >= 0;

  return (
    <div className={`task-card ${isDone ? 'task-done' : ''} ${task.notStarted ? '' : 'task-in-progress'}`}>
      <div className="task-header">
        <span className="task-name">{task.name}</span>
        <span className="task-money">💰 {task.money}</span>
      </div>

      {!isDone && (
        <div className="task-hours">
          {task.product > 0 && <span className="task-hour-item" title="Анализ">📊 {task.product}</span>}
          {task.designer > 0 && <span className="task-hour-item" title="Дизайн">🎨 {task.designer}</span>}
          {task.editor > 0 && <span className="task-hour-item" title="Редактура">✍️ {task.editor}</span>}
          {task.developer > 0 && <span className="task-hour-item" title="Разработка">💻 {task.developer}</span>}
          {task.tester > 0 && <span className="task-hour-item" title="Тестирование">🧪 {task.tester}</span>}
        </div>
      )}

      {task.notStarted && (
        <div className="task-cost">
          Себест.: {calcPrimeCost(task).toFixed(0)}
        </div>
      )}

      {task.notStarted && (
        <div className="task-actions">
          {col === 0 && (
            <button className="task-btn task-btn-take" onClick={takeToDo} title="Взять в работу">→</button>
          )}
          {col === 1 && (
            <button className="task-btn task-btn-return" onClick={toBacklog} title="Вернуть">←</button>
          )}
          <button className="task-btn" onClick={moveToTop} title="В начало">⇈</button>
          <button className="task-btn" onClick={moveUp} title="Выше">↑</button>
          <button className="task-btn" onClick={moveDown} title="Ниже">↓</button>
          <button className="task-btn" onClick={moveToBottom} title="В конец">⇊</button>
        </div>
      )}
    </div>
  );
};
