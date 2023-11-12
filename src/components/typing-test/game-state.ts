import create from "zustand";
import words from "./words.json";
import Rand from "rand-seed";
import { getLengthOfFirstRow, isNextLastRow } from "./words";

export enum GameTime {
  THIRTY_SECONDS = 30,
  SIXTY_SECONDS = 60,
}

export type CompletedWord = {
  completedAt: Date;
  word: string;
  successfullyTyped: boolean;
}

export type GameState = {
  paused: boolean;
  started: boolean;
  startedAt: Date;
  seed: string;
  randClient: Rand;
  timeLeft: number;
  gameTime: GameTime;
  activeWordIndex: number;
  activeWordLetterIndex: number;
  typedWords: string[];
  completedWords: CompletedWord[];
  words: string[];
  finished: boolean;
  hasFocus: boolean;
  start: () => void;
  setFocus: (value: boolean) => void;
  reset: () => void;
  skipGame: () => void;
  pause: () => void;
  unpause: () => void;
  incrementActiveWord: () => void;
  enterKey: (key: string) => void;
  clearKey: () => void;
};

const getSeed = () => Date.now().toString();
const getRandClient = (seed: string) => new Rand(seed);
const getWords = (randClient: Rand, count: number): string[] =>
  Array.from(
    { length: count },
    () => words[Math.floor(randClient.next() * words.length)] ?? "unknown"
  );

const getTypedWords = (words: string[]) => words.map(() => "");

const sliceNWords = (get: () => GameState, numberOfWords: number) => {
  const fillerWords = getWords(get().randClient, numberOfWords);
  const newWords = [...get().words.slice(numberOfWords), ...fillerWords];
  const newTypedWords = [
    ...get().typedWords.slice(numberOfWords),
    ...getTypedWords(fillerWords),
  ];

  return {
    words: newWords,
    activeWordIndex: get().activeWordIndex - numberOfWords + 1,
    activeWordLetterIndex: 0,
    typedWords: newTypedWords,
  };
};

const initialSeed = getSeed();
const initialRandClient = getRandClient(initialSeed);
const initialWords = getWords(initialRandClient, 100);
const initialTypedWords = getTypedWords(initialWords);

/**
 * Represents the game state of the typing test.
 */
export const useGameState = create<GameState>()((set, get) => {
  let timer: NodeJS.Timer;

  /**
   * Pauses the timer.
   */
  const pauseTimer = () => {
    clearInterval(timer);
  };

  /**
   * Starts the timer.
   */
  const startTimer = () => {
    timer = setInterval(
      () =>
        set((state) => {
          if (state.timeLeft === 0) {
            pauseTimer();
            return { finished: true, started: false, paused: false };
          }
          return { timeLeft: state.timeLeft - 1 };
        }),
      1000
    );
  };

  return {
    paused: false,
    started: false,
    startedAt: new Date(),
    finished: false,
    hasFocus: true,
    seed: initialSeed,
    timeLeft: GameTime.THIRTY_SECONDS,
    gameTime: GameTime.THIRTY_SECONDS,
    words: initialWords,
    typedWords: initialTypedWords,
    randClient: initialRandClient,
    activeWordIndex: 0,
    activeWordLetterIndex: 0,
    completedWords: [],

    /**
     * Handles a key press.
     * @param key - The key that was pressed.
     */
    enterKey: (key: string) => {
      const activeWordIndex = get().activeWordIndex;
      const newTypedWords = [...get().typedWords];
      newTypedWords[activeWordIndex] += key;

      set((state) => ({
        typedWords: newTypedWords,
        activeWordLetterIndex: state.activeWordLetterIndex + 1,
      }));
    },

    /**
     * Handles the backspace key press.
     */
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
        typedWords: newTypedWords,
        activeWordLetterIndex: state.activeWordLetterIndex - 1,
      }));
    },

    /**
     * Starts the game.
     */
    start: () => {
      set({ started: true, paused: false, startedAt: new Date() });
      startTimer();
    },

    /**
     * Resets the game.
     */
    reset: () => {
      const seed = getSeed();
      const randClient = getRandClient(seed);
      const words = getWords(randClient, 100);
      const typedWords = getTypedWords(words);

      pauseTimer();
      set((state) => ({
        started: false,
        paused: false,
        finished: false,
        timeLeft: state.gameTime,
        activeWordIndex: 0,
        activeWordLetterIndex: 0,
        completedWords: [],
        seed,
        words,
        typedWords,
        randClient,
      }));
    },

    /**
     * Sets the focus of the game.
     * @param hasFocus - Whether the game has focus.
     */
    setFocus: (hasFocus) => set(() => ({ hasFocus })),

    /**
     * Pauses the game.
     */
    pause: () => {
      pauseTimer();
      set((state) => ({
        paused: state.started ? true : state.paused,
      }));
    },

    /**
     * Unpauses the game.
     */
    unpause: () => {
      set(() => ({ paused: false }));
      startTimer();
    },

    /**
     * Increments the active word.
     */
    incrementActiveWord: () =>
      set((state) => {
        if (
          (!state.started && state.paused) ||
          state.activeWordLetterIndex === 0
        )
          return state;

        if (isNextLastRow()) {
          return sliceNWords(get, getLengthOfFirstRow());
        }

        // determine whether the word was typed correctly and add it to the completed words
        const activeWord = state.words[state.activeWordIndex];

        if(!activeWord) return state;

        const completedWord: CompletedWord = {
          completedAt: new Date(),
          successfullyTyped: activeWord === state.typedWords[state.activeWordIndex],
          word: activeWord,
        }

        return {
          completedWords: [...state.completedWords, completedWord],
          activeWordLetterIndex: 0,
          activeWordIndex: state.activeWordIndex + 1,
        };
      }),
    /**
     * Skips the game and marks it as finished
     */
    skipGame: () => {
      set(() => ({ finished: true, started: false, paused: false }));
      pauseTimer();
    } 
  };
});
