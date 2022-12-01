import clsx from "clsx";
import type { FC } from "react";
import { useMemo } from "react";
import shallow from "zustand/shallow";
import { useGameState } from "./game-state";
import Letter from "./letter";

type WordProps = {
  originalWord: string;
  active: boolean;
  index: number;
};

const Word: FC<WordProps> = ({ originalWord, active, index }) => {
  const originalLetters = useMemo(() => originalWord.split(""), [originalWord]);
  const activeWordLetterIndex = useGameState(
    (state) => state.activeWordLetterIndex
  );
  const typedWord = useGameState((state) => state.typedWords[index]);
  const { started, paused } = useGameState(
    ({ started, paused }) => ({
      started,
      paused,
    }),
    shallow
  );

  const typedLetters = useMemo(() => typedWord?.split("") ?? [], [typedWord]);
  const extraneouslyTypedLetters = useMemo(() => {
    if (typedLetters.length < originalWord.length) return [];

    return typedLetters.slice(originalLetters.length);
  }, [originalLetters.length, originalWord.length, typedLetters]);

  return (
    <div className={clsx({ "active-word": active })}>
      {originalLetters.map((letter, index) => (
        <Letter
          playing={started && !paused}
          correct={
            typedLetters[index] !== undefined &&
            typedLetters[index] === originalWord[index]
          }
          incorrect={
            typedLetters[index] !== undefined &&
            typedLetters[index] !== originalWord[index]
          }
          active={active && index === activeWordLetterIndex}
          key={index}
          originalLetter={letter}
        />
      ))}
      {extraneouslyTypedLetters.map((letter, index) => (
        <Letter
          playing={started && !paused}
          incorrect
          correct={false}
          active={
            active && index + originalLetters.length === activeWordLetterIndex
          }
          key={index + originalLetters.length + 1}
          originalLetter={letter}
        />
      ))}
    </div>
  );
};

export default Word;
