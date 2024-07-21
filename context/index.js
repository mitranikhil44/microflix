"use client"

import LoadingSpinner from "@/components/Loading";
import { createContext, useState, useContext } from "react";
import LoadingBar from "react-top-loading-bar";

export const WebStoreContext = createContext();

export const useWebStore = () => {
  return useContext(WebStoreContext);
};

export function WebStoreProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <WebStoreContext.Provider value={{ setProgress, setIsLoading }}>
      {isLoading && <LoadingSpinner/>}
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {children}
    </WebStoreContext.Provider>
  );
}
