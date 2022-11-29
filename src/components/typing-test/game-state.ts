import create from "zustand";
import words from "./words.json";
import Rand from "rand-seed";

export enum GameTime {
  THIRTY_SECONDS = 30,
  SIXTY_SECONDS = 60,
}

export type GameState = {
  paused: boolean;
  started: boolean;
  seed: string;
  randClient: Rand;
  timeLeft: number;
  gameTime: GameTime;
  activeWordIndex: number;
  activeWordLetterIndex: number;
  typedWords: string[];
  words: string[];
  hasFocus: boolean;
  start: () => void;
  setFocus: (value: boolean) => void;
  reset: () => void;
  pause: () => void;
  unpause: () => void;
  incrementActiveWord: () => void;
  enterKey: (key: string) => void;
  clearKey: () => void;
};

const getSeed = () => Date.now().toString();
const getRandClient = (seed: string) => new Rand(seed);
const getWords = (randClient: Rand): string[] =>
  Array.from(
    { length: 100 },
    () => words[Math.floor(randClient.next() * words.length)] ?? "unknown"
  );

const getTypedWords = (words: string[]) => words.map(() => "");

const initialSeed = getSeed();
const initialRandClient = getRandClient(initialSeed);
const initialWords = getWords(initialRandClient);
const initialTypedWords = getTypedWords(initialWords);

export const useGameState = create<GameState>()((set, get) => {
  let timer: NodeJS.Timer;

  const pauseTimer = () => {
    clearInterval(timer);
  };
  const startTimer = () => {
    timer = setInterval(
      () =>
        set((state) => {
          if (state.timeLeft === 0) {
            pauseTimer();
            return { ...state };
          }
          return { ...state, timeLeft: state.timeLeft - 1 };
        }),
      1000
    );
  };

  return {
    paused: false,
    started: false,
    hasFocus: true,
    seed: initialSeed,
    timeLeft: GameTime.THIRTY_SECONDS,
    gameTime: GameTime.THIRTY_SECONDS,
    words: initialWords,
    typedWords: initialTypedWords,
    randClient: initialRandClient,
    activeWordIndex: 0,
    activeWordLetterIndex: 0,
    enterKey: (key: string) => {
      const activeWordIndex = get().activeWordIndex;
      const newTypedWords = [...get().typedWords];
      newTypedWords[activeWordIndex] += key;

      set((state) => ({
        ...state,
        typedWords: newTypedWords,
        activeWordLetterIndex: state.activeWordLetterIndex + 1,
      }));
    },
    clearKey: () => {
      const activeWordIndex = get().activeWordIndex;
      const activeWordLetterIndex = get().activeWordLetterIndex;

      if (activeWordLetterIndex === 0) return;

      const newTypedWords = [...get().typedWords];
      newTypedWords[activeWordIndex] =
        newTypedWords[activeWordIndex]?.substring(
          0,
          (newTypedWords[activeWordIndex]?.length ?? 1) - 1
        ) ?? "";

      set((state) => ({
        ...state,
        typedWords: newTypedWords,
        activeWordLetterIndex: state.activeWordLetterIndex - 1,
      }));
    },
    start: () => {
      set({ started: true, paused: false });
      startTimer();
    },
    reset: () => {
      const seed = getSeed();
      const randClient = getRandClient(seed);
      const words = getWords(randClient);
      const typedWords = getTypedWords(words);

      pauseTimer();
      set((state) => ({
        started: false,
        paused: false,
        timeLeft: state.gameTime,
        activeWordIndex: 0,
        activeWordLetterIndex: 0,
        seed,
        words,
        typedWords,
        randClient,
      }));
    },
    setFocus: (hasFocus) => set((state) => ({ ...state, hasFocus })),
    pause: () => {
      pauseTimer();
      set((state) => ({
        ...state,
        paused: state.started ? true : state.paused,
      }));
    },
    unpause: () => {
      set((state) => ({ ...state, paused: false }));
      startTimer();
    },
    incrementActiveWord: () =>
      set((state) => ({
        ...state,
        activeWordLetterIndex:
          state.started && !state.paused ? 0 : state.activeWordLetterIndex,
        activeWordIndex:
          state.started && !state.paused
            ? state.activeWordIndex + 1
            : state.activeWordIndex,
      })),
  };
});
