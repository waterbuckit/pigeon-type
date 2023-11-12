import type { FC} from "react";
import { useCallback, useRef } from "react";
import shallow from "zustand/shallow";
import Caret from "./caret";
import { useGameState } from "./game-state";
import Word from "./word";

export const getLengthOfFirstRow = (): number => {
  const words = document.querySelector('.words') 

  if (!words) return 0;

  return Array.from(words.children).filter(
    (element) =>
      element.nodeName === "DIV" && (element as HTMLDivElement).offsetTop <= 0
  ).length;
}

export const isNextLastRow = (): boolean => {
  const activeWord = document.querySelector('.active-word') 

  if (!activeWord) return false;
  const nextSibling = activeWord.nextSibling 
  if(!nextSibling) return false

  return Math.floor((nextSibling as HTMLDivElement).offsetTop / 3 / 10) === 2;
}

const Words: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { words, activeWordIndex } = useGameState(
    ({ words, activeWordIndex }) => ({
      words,
      activeWordIndex,
    }),
    shallow
  );

  // trigger keyboard to open on mobile devices
  const openKeyboard = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
      console.log(document.activeElement)
    }
  }, [])

  return (
    <>
      <div
        onClick={openKeyboard}
        ref={ref}
        className="words relative flex max-h-[8.25rem] flex-wrap gap-[0.75rem] overflow-hidden font-mono text-2xl"
      >
        <Caret typingTestRef={ref} />
        {words.map((word, index) => (
          <Word
            active={index === activeWordIndex}
            index={index}
            key={index}
            originalWord={word}
          />
        ))}
      </div>
      <input
        onKeyDown={(e) =>
          document.dispatchEvent(new KeyboardEvent("keydown", { key: e.key }))
        }
        className="cursor-default opacity-0"
        type="text"
        ref={inputRef}
      />
    </>
  );
};

export default Words;
