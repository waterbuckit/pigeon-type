import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import Button from "../button";
import type { CompletedWord } from "./game-state";
import { useGameState } from "./game-state";
import type { FC } from "react";
import { useMemo } from "react";
import clsx from "clsx";

type Stat = {
  name: string;
  value: string | number;
  unit?: string;
};

const calculateWPM = (
  completedWords: CompletedWord[],
  gameTime = 30
): number => {
  const totalWords = completedWords.length;
  const totalCharacters = completedWords.reduce(
    (total, { word }) => total + word.length,
    0
  );

  return Math.round(totalCharacters / 5 / (totalWords / 60)) * (60 / gameTime);
};

const getTimeDifferenceInSeconds = (
  startedAt: Date,
  wordCompletedAt: Date
): number => {
  const difference = wordCompletedAt.getTime() - startedAt.getTime();

  return difference / 1000;
};

const CustomisedDot: FC<{
  payload: { successfullyTyped: boolean };
  cx: number;
  cy: number;
}> = ({ payload: { successfullyTyped }, cx, cy }) => {
  return (
    <path
      fill="currentColor"
      width="NaN"
      height="NaN"
      cx={cx}
      cy={cy}
      x="NaN"
      y="NaN"
      transform={`translate(${cx}, ${cy})`}
      className={clsx({
        "text-green-400": successfullyTyped,
        "text-red-500": !successfullyTyped,
      })}
      d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
    ></path>
  );
};

const GameOver = () => {
  const { reset, completedWords, startedAt } = useGameState(
    ({ reset, completedWords, startedAt }) => ({
      reset,
      completedWords,
      startedAt,
    })
  );

  const data = useMemo(
    () =>
      completedWords.map((word, index, array) => ({
        ...word,
        completedAt: `${getTimeDifferenceInSeconds(
          startedAt,
          word.completedAt
        )}s`,
        wpm: calculateWPM(array.slice(0, index + 1)),
      })),
    [completedWords, startedAt]
  );

  const stats = useMemo(
    (): Stat[] => [
      {
        name: "WPM",
        value: calculateWPM(completedWords),
      },
      { name: "Total words", value: completedWords.length },
      {
        name: "Success Rate",
        value: `${Math.round(
          (completedWords.filter(({ successfullyTyped }) => successfullyTyped)
            .length /
            completedWords.length) *
            100
        )}`,
        unit: "%",
      },
    ],
    [completedWords]
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-2xl font-thin uppercase tracking-widest">STATS</h1>
      <div className="grid grid-cols-1 gap-px self-center rounded-lg bg-white/5 bg-gray-900 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">
              {stat.name}
            </p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="text-4xl font-semibold tracking-tight text-white">
                {stat.value}
              </span>
              {stat.unit ? (
                <span className="text-sm text-gray-400">{stat.unit}</span>
              ) : null}
            </p>
          </div>
        ))}
      </div>
      <div className="h-96 self-stretch py-5">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis name="Completed at" dataKey="completedAt" />
            <YAxis name="WPM" dataKey="wpm" />
            <ZAxis name="Word" dataKey="word" />
            <Tooltip />
            <Scatter
              line
              fill="#3b82f6"
              lineJointType="natural"
              data={data}
              name="WPM"
              shape={
                <CustomisedDot
                  payload={{
                    successfullyTyped: false,
                  }}
                  cx={0}
                  cy={0}
                />
              }
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <Button onClick={reset}>Restart</Button>
    </div>
  );
};

export default GameOver;
