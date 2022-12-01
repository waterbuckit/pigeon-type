import clsx from "clsx";
import type { FC, HTMLProps } from "react";

type ButtonProps = HTMLProps<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "secondary-borderless";
};

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  ...other
}) => (
  <button
    {...other}
    type="button"
    className={clsx(
      {
        "bg-blue-600 text-white hover:bg-blue-700 border border-transparent": variant === "primary",
        "bg-white text-black hover:bg-slate-300 border-black border": variant === "secondary",
        "bg-white text-black hover:bg-slate-300 border border-transparent":
          variant === "secondary-borderless",
      },
      "inline-flex items-center rounded-full  px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    )}
  >
    {children}
  </button>
);

export default Button;
