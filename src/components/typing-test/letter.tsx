import clsx from "clsx";
import type { FC } from "react";

type LetterProps = {
  originalLetter: string;
  active: boolean;
  incorrect: boolean;
  correct: boolean;
  playing: boolean;
};

const Letter: FC<LetterProps> = ({ originalLetter, active, incorrect, correct, playing }) => (
  <span
    className={clsx({ "active-letter": active, "text-red-400": incorrect, "text-white": correct && playing, "text-black": correct && !playing })}
  >
    {originalLetter}
  </span>
);

export default Letter;
