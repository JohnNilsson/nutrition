import { createContext, useContext } from "react";
import { AppState } from "../../state/AppState";

export { AppState } from "../../state/AppState";

export const AppStateContext = createContext<AppState>(new AppState());

export function useAppState(): AppState {
  return useContext(AppStateContext);
}
