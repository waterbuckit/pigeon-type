import clsx from "clsx";
import type { FC } from "react";
import { useGameState } from "./game-state";

type TimeLeftProps = {
  playing: boolean;
};

const TimeLeft: FC<TimeLeftProps> = ({ playing }) => {
  const timeLeft = useGameState(({ timeLeft }) => timeLeft);
  return (
    <div
      className={clsx(
        { "text-blue-500": !playing, "text-blue-200": playing },
        "text-6xl"
      )}
    >
      {timeLeft}
    </div>
  );
};

export default TimeLeft;
