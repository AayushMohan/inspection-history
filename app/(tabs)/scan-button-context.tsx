import React, { createContext, useContext, useMemo, useState } from "react";

type ScanButtonContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const ScanButtonContext = createContext<ScanButtonContextValue | null>(null);

export function ScanButtonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const value = useMemo(() => ({ collapsed, setCollapsed }), [collapsed]);

  return (
    <ScanButtonContext.Provider value={value}>
      {children}
    </ScanButtonContext.Provider>
  );
}

export function useScanButton() {
  const ctx = useContext(ScanButtonContext);
  if (!ctx) {
    throw new Error("useScanButton must be used within ScanButtonProvider");
  }
  return ctx;
}
