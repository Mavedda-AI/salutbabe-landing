import React from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  // A simple pass-through layout wrapper since the dashboard has its own layout now
  return <>{children}</>;
}
