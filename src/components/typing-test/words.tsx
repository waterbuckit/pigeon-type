import type { FC } from "react";
import shallow from "zustand/shallow";
import { useGameState } from "./game-state";
import Word from "./word";

const Words: FC = () => {
  const { words, activeWord } = useGameState(
    ({ words, activeWordIndex: activeWord }) => ({
      words,
      activeWord,
    }),
    shallow
  );

  return (
    <>
      {words.map((word, index) => (
        <Word
          active={index === activeWord}
          index={index}
          key={index}
          originalWord={word}
        />
      ))}{" "}
    </>
  );
};

export default Words;
