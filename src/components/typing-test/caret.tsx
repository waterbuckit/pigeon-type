import type { FC, RefObject } from "react";
import { useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import { useGameState } from "./game-state";
import useResizeObserver from "use-resize-observer";

type CaretOffset = {
  top: string;
  left: string;
};

const getCaretOffset = (): CaretOffset | null => {
  const activeLetterElement =
    document.querySelector<HTMLSpanElement>(".active-letter");

  if (!activeLetterElement) {
    const activeWordElement =
      document.querySelector<HTMLDivElement>(".active-word");

    if (!activeWordElement) return null;
    return {
      left: `${
        activeWordElement.offsetLeft - 1 + activeWordElement.offsetWidth
      }px`,
      top: `${activeWordElement.offsetTop - 2}px`,
    };
  } else {
    return {
      left: `${activeLetterElement.offsetLeft - 1}px`,
      top: `${activeLetterElement.offsetTop - 2}px`,
    };
  }
};

const positionCaret = (
  ref: RefObject<HTMLDivElement>,
  caretOffset: CaretOffset | null
) => {
  if (!ref.current) return;
  if (!caretOffset) return;
  
  ref.current.style.top = caretOffset.top
  ref.current.style.left = caretOffset.left
};

type CaretProps = {
  typingTestRef: RefObject<HTMLDivElement>;
};

const Caret: FC<CaretProps> = ({ typingTestRef }) => {
  const { activeWordIndex, activeWordLetterIndex } = useGameState(
    ({ activeWordIndex, activeWordLetterIndex }) => ({
      activeWordIndex,
      activeWordLetterIndex,
    }),
    shallow
  );
  
  const ref = useRef<HTMLDivElement>(null);

  useResizeObserver({
    ref: typingTestRef,
    onResize: () => {
      positionCaret(ref, getCaretOffset());
    },
  });
  useEffect(() => {
    positionCaret(ref, getCaretOffset());
  }, [activeWordIndex, activeWordLetterIndex, typingTestRef]);

  return (
    <div
      ref={ref}
      className="absolute h-[2rem] w-1 animate-pulse rounded-md bg-yellow-500 transition-all"
    />
  );
};

export default Caret;
