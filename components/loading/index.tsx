import Lottie from "lottie-react";
import { DynamicLoader } from "./dynamic-loader";

export function GlobalLoading(props: LoaderProps) {
  return <DynamicLoader {...props} />;
}

export type LoaderProps = Omit<
  React.ComponentProps<typeof Lottie>,
  "animationData" | "loop"
>;
