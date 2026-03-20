import React from "react";
import { useGameSettingsContext } from "./GameSettingsContext";
import { GameResult, Task, useGameResultContext } from "./GameResultContext";
import TaskGenerator from "./TaskGenerator";

interface Props {
  onGameEnd: (coins: number) => void;
}

export const GameRunner: React.FC<Props> = ({ onGameEnd }) => {
  const { initParams } = useGameSettingsContext();
  const { gameResult, setGameResult } = useGameResultContext();

  const moveEmptyTesting = (r: GameResult) => {
    const process = (col: Task[]) => {
      for (let i = 0; i < col.length;) {
        if (col[i].developer + col[i].tester === 0) {
          const task = col.splice(i, 1)[0];
          task.endWeek = r.week;
          r.cols[r.testerColIndex + 1].push(task);
        } else { i++; }
      }
    };
    process(r.cols[r.testerColIndex - 1]);
    process(r.cols[r.testerColIndex]);
  };

  const moveEmptyDev = (r: GameResult) => {
    const process = (col: Task[]) => {
      for (let i = 0; i < col.length;) {
        if (col[i].developer + col[i].editor === 0) {
          r.cols[r.developerColIndex + 1].push(...col.splice(i, 1));
        } else { i++; }
      }
    };
    process(r.cols[r.developerColIndex - 1]);
    process(r.cols[r.developerColIndex]);
    moveEmptyTesting(r);
  };

  const moveEmptyEditing = (r: GameResult) => {
    const process = (col: Task[]) => {
      for (let i = 0; i < col.length;) {
        if (col[i].designer + col[i].editor === 0) {
          r.cols[r.editorColIndex + 1].push(...col.splice(i, 1));
        } else { i++; }
      }
    };
    process(r.cols[r.editorColIndex - 1]);
    process(r.cols[r.editorColIndex]);
    moveEmptyDev(r);
  };

  const moveEmptyDesign = (r: GameResult) => {
    const process = (col: Task[]) => {
      for (let i = 0; i < col.length;) {
        if (col[i].designer + col[i].product === 0) {
          r.cols[r.designerColIndex + 1].push(...col.splice(i, 1));
        } else { i++; }
      }
    };
    process(r.cols[r.designerColIndex - 1]);
    process(r.cols[r.designerColIndex]);
    moveEmptyEditing(r);
  };

  const moveEmptyAnalyze = (r: GameResult) => {
    const process = (col: Task[]) => {
      for (let i = 0; i < col.length;) {
        if (col[i].product === 0) {
          const task = col.splice(i, 1)[0];
          task.startWeek = r.week;
          task.notStarted = false;
          r.cols[r.productColIndex + 1].push(task);
        } else { i++; }
      }
    };
    process(r.cols[r.productColIndex - 1]);
    process(r.cols[r.productColIndex]);
    moveEmptyDesign(r);
  };

  function processDay(
    r: GameResult, wPoints: number, twoHourPower: number,
    taskStep: string, colIndex: number, isTesting: boolean, isAnalyze: boolean
  ) {
    let weekPoints = wPoints;
    let dayPoints = Math.min(weekPoints, twoHourPower);

    while (dayPoints > 0) {
      let tasks = r.cols[colIndex].slice(0);
      if (tasks !== undefined && tasks.length > 0) {
        let task = tasks[0];
        const currDo: number = Math.min(dayPoints, (task as any)[taskStep]);
        if (currDo > 0) {
          (task as any)[taskStep] -= currDo;
          dayPoints -= currDo;
          weekPoints -= currDo;
        }
        if ((task as any)[taskStep] === 0) {
          if (isTesting) {
            moveEmptyTesting(r);
          } else {
            const newTask = r.cols[colIndex].splice(0, 1)[0];
            if (newTask !== undefined) {
              if (isAnalyze) {
                newTask.startWeek = r.week;
                newTask.notStarted = false;
              }
              r.cols[colIndex + 1].push(newTask);
            }
          }
        }
      } else {
        let pulled = r.cols[colIndex - 1].splice(0, 1);
        if (pulled !== undefined && pulled.length > 0) {
          r.cols[colIndex].push(...pulled);
        } else { break; }
      }
    }
    return weekPoints;
  }

  const calcWeek = () => {
    const r = gameResult.clone();

    if (r.week >= 0) {
      r.cols.slice(-1)[0].forEach(task => r.income += task.money);
      r.consumption += initParams.products.weekMoney;
      r.consumption += initParams.designers.weekMoney;
      r.consumption += initParams.editors.weekMoney;
      r.consumption += initParams.developers.weekMoney;
      r.consumption += initParams.testers.weekMoney;

      let pp = initParams.products.weekPower;
      let dp = initParams.designers.weekPower;
      let ep = initParams.editors.weekPower;
      let devP = initParams.developers.weekPower;
      let tp = initParams.testers.weekPower;

      for (let slot = 0; slot < 20; slot++) {
        tp = processDay(r, tp, initParams.testers.twoHourPower, "tester", r.testerColIndex, true, false);
        devP = processDay(r, devP, initParams.developers.twoHourPower, "developer", r.developerColIndex, false, false);
        ep = processDay(r, ep, initParams.editors.twoHourPower, "editor", r.editorColIndex, false, false);
        dp = processDay(r, dp, initParams.designers.twoHourPower, "designer", r.designerColIndex, false, false);
        pp = processDay(r, pp, initParams.products.twoHourPower, "product", r.productColIndex, false, true);
        moveEmptyAnalyze(r);
      }

      r.effProduct.mayWork += initParams.products.weekPower;
      r.effDesigner.mayWork += initParams.designers.weekPower;
      r.effEditor.mayWork += initParams.editors.weekPower;
      r.effDeveloper.mayWork += initParams.developers.weekPower;
      r.effTester.mayWork += initParams.testers.weekPower;
      r.effProduct.work += initParams.products.weekPower - pp;
      r.effDesigner.work += initParams.designers.weekPower - dp;
      r.effEditor.work += initParams.editors.weekPower - ep;
      r.effDeveloper.work += initParams.developers.weekPower - devP;
      r.effTester.work += initParams.testers.weekPower - tp;
    }

    r.week++;
    r.weekIncome = 0;
    r.cols.slice(-1)[0].forEach(task => r.weekIncome += task.money);

    if (r.week % 2 === 0) {
      const items = TaskGenerator(r.week / 2, r.taskIndex);
      r.taskIndex += items.length;
      r.cols[0].unshift(...items);
    }

    setGameResult(r);

    if (r.week > 25) {
      const finalCoins = r.income - r.consumption;
      onGameEnd(finalCoins);
    }
  };

  const isGameOver = gameResult.week > 25;
  const notStarted = gameResult.week < 0;

  const fmt = (x: number) => x.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <div className="game-runner">
      {notStarted && (
        <div className="game-description">
          <h2>Как играть</h2>
          <div className="game-desc-grid">
            <div className="game-desc-card">
              <div className="game-desc-icon">👥</div>
              <h3>Команда</h3>
              <p>Продакт, дизайнер и редактор (по 0.5 ставки), 10 разработчиков и 2 тестировщика</p>
            </div>
            <div className="game-desc-card">
              <div className="game-desc-icon">📋</div>
              <h3>Задачи</h3>
              <p>Каждые 2 недели появляются 4 новые задачи. Приоритезируй и бери в работу</p>
            </div>
            <div className="game-desc-card">
              <div className="game-desc-icon">💰</div>
              <h3>Цель</h3>
              <p>Заработай максимум за 26 недель. Аренда — 70 000 coin. Выйди в плюс!</p>
            </div>
            <div className="game-desc-card">
              <div className="game-desc-icon">⚡</div>
              <h3>Механика</h3>
              <p>Управляй приоритетами до начала работы. Тестировщики — узкое место!</p>
            </div>
          </div>
        </div>
      )}

      <div className="game-controls">
        {!isGameOver && (
          <button className="game-run-button" onClick={calcWeek}>
            {notStarted ? "Начать!" : `Неделя ${gameResult.week + 1} →`}
          </button>
        )}

        {!notStarted && (
          <div className="game-stats-bar">
            <div className="game-stat">
              <span className="game-stat-label">Неделя</span>
              <span className="game-stat-value">{gameResult.week}/26</span>
            </div>
            <div className="game-stat">
              <span className="game-stat-label">Доход</span>
              <span className="game-stat-value game-stat-green">{fmt(gameResult.income)}</span>
            </div>
            <div className="game-stat">
              <span className="game-stat-label">Расходы</span>
              <span className="game-stat-value game-stat-red">{fmt(gameResult.consumption)}</span>
            </div>
            <div className="game-stat">
              <span className="game-stat-label">Результат</span>
              <span className={`game-stat-value ${gameResult.income - gameResult.consumption >= 0 ? 'game-stat-green' : 'game-stat-red'}`}>
                {fmt(gameResult.income - gameResult.consumption)}
              </span>
            </div>
            <div className="game-stat">
              <span className="game-stat-label">В неделю</span>
              <span className="game-stat-value">{fmt(gameResult.weekIncome)}</span>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="game-over-banner">
            <h2>Игра окончена!</h2>
            <p className="game-over-result">
              Результат: <strong>{fmt(gameResult.income - gameResult.consumption)} coin</strong>
            </p>
            <p className="game-over-sub">
              {gameResult.income - gameResult.consumption >= 70000
                ? "Отлично! Аренда оплачена, ты в плюсе!"
                : gameResult.income - gameResult.consumption >= 0
                  ? "Неплохо, но аренда (70 000) может быть проблемой..."
                  : "Стартап пока в минусе. Попробуй ещё раз!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
