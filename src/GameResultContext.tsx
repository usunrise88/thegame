import React, { PropsWithChildren, useContext, useState } from "react";

export class Task {
  name: string;
  product: number;
  designer: number;
  editor: number;
  developer: number;
  tester: number;
  money: number;
  notStarted: boolean = true;
  startWeek: number = -1;
  endWeek: number = -1;

  constructor(
    name: string, product: number, designer: number,
    editor: number, developer: number, tester: number, money: number
  ) {
    this.name = name;
    this.product = product;
    this.designer = designer;
    this.editor = editor;
    this.developer = developer;
    this.tester = tester;
    this.money = money;
  }

  clone(): Task {
    const c = new Task(this.name, this.product, this.designer, this.editor, this.developer, this.tester, this.money);
    c.notStarted = this.notStarted;
    c.startWeek = this.startWeek;
    c.endWeek = this.endWeek;
    return c;
  }
}

export class Effectiveness {
  mayWork: number = 0;
  work: number = 0;

  clone(): Effectiveness {
    const c = new Effectiveness();
    c.mayWork = this.mayWork;
    c.work = this.work;
    return c;
  }

  toString(): string {
    if (this.mayWork === 0) return "0%";
    return (100 * this.work / this.mayWork).toFixed() + "%";
  }
}

export class GameResult {
  week: number = -1;
  taskIndex: number = 1;
  income: number = 0;
  weekIncome: number = 0;
  consumption: number = 0;
  cols: Task[][] = [];
  effProduct: Effectiveness = new Effectiveness();
  effDesigner: Effectiveness = new Effectiveness();
  effEditor: Effectiveness = new Effectiveness();
  effDeveloper: Effectiveness = new Effectiveness();
  effTester: Effectiveness = new Effectiveness();
  readonly colNames: string[];
  readonly productColIndex: number = 2;
  readonly designerColIndex: number = 4;
  readonly editorColIndex: number = 6;
  readonly developerColIndex: number = 8;
  readonly testerColIndex: number = 10;

  constructor() {
    this.colNames = [
      "Backlog", "К работе", "Анализ", "Анализ ✓",
      "Дизайн", "Дизайн ✓", "Редактура", "К разработке",
      "Разработка", "К тестированию", "Тестирование", "Готово"
    ];
    for (let i = 0; i < this.colNames.length; i++) {
      this.cols.push([]);
    }
  }

  clone(): GameResult {
    const c = new GameResult();
    c.week = this.week;
    c.taskIndex = this.taskIndex;
    c.income = this.income;
    c.weekIncome = this.weekIncome;
    c.consumption = this.consumption;
    c.effProduct = this.effProduct.clone();
    c.effDesigner = this.effDesigner.clone();
    c.effEditor = this.effEditor.clone();
    c.effDeveloper = this.effDeveloper.clone();
    c.effTester = this.effTester.clone();
    for (let i = 0; i < c.cols.length; i++) {
      c.cols[i].push(...this.cols[i].map(v => v.clone()));
    }
    return c;
  }
}

export type SetGameResult = (gameResult: GameResult) => void;

export type GameResultContextType = {
  gameResult: GameResult;
  setGameResult: SetGameResult;
};

export const GameResultContext = React.createContext<GameResultContextType | undefined>(undefined);

export const GameResultContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [gameResult, setGameResult] = useState<GameResult>(new GameResult());
  return (
    <GameResultContext.Provider value={{ gameResult, setGameResult }}>
      {children}
    </GameResultContext.Provider>
  );
};

export const useGameResultContext = () => {
  const context = useContext(GameResultContext);
  if (!context) {
    throw new Error('useGameResultContext must be used inside the GameResultContextProvider');
  }
  return context;
};
