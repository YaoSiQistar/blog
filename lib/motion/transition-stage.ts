"use client";

import * as React from "react";

export type TransitionStage = "idle" | "exit" | "interlude" | "enter";

export const TransitionStageContext = React.createContext<TransitionStage>("idle");

export function useTransitionStage() {
  return React.useContext(TransitionStageContext);
}
