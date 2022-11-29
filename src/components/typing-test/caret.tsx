import type { FC } from "react";
import { useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import { useGameState } from "./game-state";

const Caret: FC = () => {
  const { activeWordIndex, activeWordLetterIndex } = useGameState(
    ({ activeWordIndex, activeWordLetterIndex }) => ({
      activeWordIndex,
      activeWordLetterIndex,
    }),
    shallow
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const activeLetterElement =
      document.querySelector<HTMLSpanElement>(".active-letter");

    // Last letter of word
    if (!activeLetterElement) {
      const activeWordElement =
        document.querySelector<HTMLDivElement>(".active-word");

      if (!activeWordElement) return;

      ref.current.style.left = `${
        activeWordElement.offsetLeft - 1 + activeWordElement.offsetWidth
      }px`;
      ref.current.style.top = `${activeWordElement.offsetTop - 2}px`;
    } else {
      ref.current.style.left = `${activeLetterElement.offsetLeft - 1}px`;
      ref.current.style.top = `${activeLetterElement.offsetTop - 2}px`;
    }
  }, [activeWordIndex, activeWordLetterIndex]);

  return (
    <div
      ref={ref}
      className="absolute h-[2rem] w-1 animate-pulse rounded-md bg-yellow-500 transition-all"
    />
  );
};

export default Caret;
