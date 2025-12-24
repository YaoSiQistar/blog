"use client";

import * as React from "react";

interface TransitionProviderProps {
  children: React.ReactNode;
}

export default function TransitionProvider({ children }: TransitionProviderProps) {
  return <>{children}</>;
}
