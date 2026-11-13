// engine.js(브라우저·Node 공용)의 타입 선언. app/ 의 퀴즈 화면이 가져다 쓴다.
export type Question = {id: number; prompt: string; choices: {id: string; text: string}[]; answers: string[]; explanation?: string};
export type QuizRecord = {correct: boolean; selected: string[]; attempts: number; due: number; markedWrong?: true};
export type Daily = {goal: number | null; day: string; ids: number[]; celebrated: boolean};
export type QuizState = {
  version: string;
  count: number;
  current: number;
  records: Record<string, QuizRecord>;
  autoReview?: number | null;
  complete?: boolean;
  review?: {queue: number[]; back: {current: number; autoReview: number | null; complete: boolean}};
  daily?: Daily;
};
declare const engine: {
  fresh(): QuizState;
  valid(state: unknown, questions: Question[]): boolean;
  answer(state: QuizState, question: Question, selected: string[], now?: number): boolean;
  markWrong(state: QuizState, question: Question): boolean;
  next(state: QuizState, questions: Question[]): Question | null;
  dayKey(now?: number): string;
  daily(state: QuizState, now?: number): Daily;
  setGoal(state: QuizState, goal: number, limit: number, now?: number): void;
  claimGoal(state: QuizState, now?: number): boolean;
  recoverNavigation<T>(state: T, questions: Question[]): T;
};
export default engine;
