import { useRouter } from "next/router";
import { useMemo } from "react";

type NavigationOption = {
  name: string;
  href: string;
  current: boolean;
};

const baseNavigationOptions: NavigationOption[] = [
  {
    name: "Type",
    href: "/",
    current: false,
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    current: false
  }
];

const useNavigation = (): NavigationOption[] => {
  const router = useRouter();

  return useMemo(
    () =>
      baseNavigationOptions.map((x) => ({
        ...x,
        current: x.href === router.pathname,
      })),
    [router.pathname]
  );
};

export default useNavigation;
