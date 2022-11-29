import { PauseCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import Button from "../button";
import Modal from "../modal";
import { useGameState } from "./game-state";

const PauseModal = () => {
  const { paused, started, pause, unpause, setFocus, reset } = useGameState(
    ({ paused, started, pause, setFocus, unpause, reset }) => ({
      paused,
      pause,
      unpause,
      started,
      setFocus,
      reset,
    })
  );

  useEffect(() => {
    const handleFocus = () => {
      setFocus(true);
    };
    const handleBlur = () => {
      setFocus(false);
      started && pause();
    };

    addEventListener("blur", handleBlur);

    return () => {
      removeEventListener("focus", handleFocus);
      removeEventListener("blur", handleBlur);
    };
  }, [pause, setFocus, started, unpause]);

  return (
    <Modal
      Title={"Game paused"}
      Icon={<PauseCircleIcon className="h-6 w-6" aria-hidden="true" />}
      open={paused}
      Action={
        <>
          <Button onClick={unpause}>Continue</Button>
          <Button variant="secondary" onClick={reset}>
            Give up
          </Button>
        </>
      }
    />
  );
};

export default PauseModal;
