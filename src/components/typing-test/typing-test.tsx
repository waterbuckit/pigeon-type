import clsx from "clsx";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useEffect } from "react";
import Button from "../button";
import { useGameState } from "./game-state";
import PauseModal from "./pause-modal";
import TimeLeft from "./time-left";
import Words from "./words";
import shallow from "zustand/shallow";

const TypingTest: FC = () => {
  const {
    started,
    paused,
    start,
    pause,
    unpause,
    reset,
    incrementActiveWord,
    enterKey,
    clearKey,
  } = useGameState(
    ({
      started,
      paused,
      start,
      pause,
      unpause,
      reset,
      incrementActiveWord,
      enterKey,
      clearKey,
    }) => ({
      started,
      paused,
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
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
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
    };

    addEventListener("keydown", handleKeyPress);

    return () => removeEventListener("keydown", handleKeyPress);
  }, [
    clearKey,
    enterKey,
    incrementActiveWord,
    pause,
    paused,
    start,
    started,
    unpause,
  ]);

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
        <TimeLeft playing={started && !paused} />
        <Words />
        <div className="flex justify-center">
          <Button
            variant={started && !paused ? "secondary-borderless" : "primary"}
            onClick={reset}
          >
            Restart
          </Button>
        </div>
        <PauseModal />
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(TypingTest), { ssr: false });
