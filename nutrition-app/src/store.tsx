import React, { useContext, createContext, FunctionComponent } from "react";
import { createAppState, AppState } from "./state";
import { useLocalStore } from "mobx-react-lite";

const storeContext = createContext<AppState | null>(null);

export const StoreProvider: FunctionComponent = ({ children }) => {
  const store = useLocalStore(createAppState);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(storeContext);
  if (!store) {
    throw new Error("Store context not initialized");
  }
  return store;
};
