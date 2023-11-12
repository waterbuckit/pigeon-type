import clsx from "clsx";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
import Button from "../button";
import { useGameState } from "./game-state";
import PauseModal from "./pause-modal";
import TimeLeft from "./time-left";
import Words from "./words";
import shallow from "zustand/shallow";
import GameOver from "./game-over";

const TypingTest: FC = () => {
  const {
    started,
    paused,
    finished,
    skipGame,
    start,
    pause,
    reset,
    incrementActiveWord,
    enterKey,
    clearKey,
  } = useGameState(
    ({
      started,
      paused,
      finished,
      skipGame,
      start,
      pause,
      unpause,
      reset,
      incrementActiveWord,
      enterKey,
      clearKey,
    }) => ({
      started,
      finished,
      paused,
      skipGame,
      start,
      pause,
      unpause,
      reset,
      incrementActiveWord,
      enterKey,
      clearKey,
    }),
    shallow
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Esc":
        case "Escape":
          pause();
          return;
        case " ":
          incrementActiveWord();
          return;
        case "Backspace":
          clearKey();
          return;
      }

      if (event.key.match(/^[a-z]$/i)) {
        if (!started) {
          start();
        }
        enterKey(event.key);
      }
    },
    [clearKey, enterKey, incrementActiveWord, pause, start, started]
  );

  useEffect(() => {
    addEventListener("keydown", handleKeyPress);

    return () => removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <>
      <div
        className={clsx(
          { block: started && !paused, hidden: !started || paused },
          "fixed inset-0 brightness-50 backdrop-blur-sm transition ease-in-out"
        )}
      />
      <div
        className={clsx(
          { "text-slate-300": started && !paused },
          "z-10 flex flex-col gap-10"
        )}
      >
        {!finished && (
          <>
            <TimeLeft playing={started && !paused} />
            <Words />
            <div className="flex justify-center gap-2">
              <Button
                variant={
                  started && !paused ? "secondary-borderless" : "primary"
                }
                onClick={reset}
              >
                {!started && "Refresh"}
                {started && "Restart"}
              </Button>
              {started && (
                <Button
                  variant={
                    started && !paused ? "secondary-borderless" : "primary"
                  }
                  onClick={skipGame}
                >
                  Skip
                </Button>
              )}
            </div>
            <PauseModal />
          </>
        )}
        {finished && <GameOver />}
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(TypingTest), { ssr: false });
