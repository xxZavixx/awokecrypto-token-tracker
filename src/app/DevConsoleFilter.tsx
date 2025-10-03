"use client";

import { useEffect } from "react";

export default function DevConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const orig = console.error;
    console.error = (...args: any[]) => {
      const first = args[0];
      // Silence the React 19 dev warning from third-party libs
      if (
        typeof first === "string" &&
        first.includes("useInsertionEffect must not schedule updates")
      ) {
        return;
      }
      orig(...args);
    };

    return () => {
      console.error = orig;
    };
  }, []);

  return null;
}
