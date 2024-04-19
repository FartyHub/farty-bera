import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { Application } from '../types';

const ApplicationsContext = createContext<{
  applications: Application[];
  focusedApplication: Application | null;
  setApplications: Dispatch<SetStateAction<Application[]>>;
  setFocusedApplication: Dispatch<SetStateAction<Application | null>>;
}>({
  applications: [],
  focusedApplication: null,
  setApplications: () => {},
  setFocusedApplication: () => {},
});

export function useApplications() {
  return useContext(ApplicationsContext);
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [focusedApplication, setFocusedApplication] =
    useState<Application | null>(null);

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        focusedApplication,
        setApplications,
        setFocusedApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}
