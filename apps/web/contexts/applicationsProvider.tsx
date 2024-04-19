import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
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

export function ApplicationsProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: Application[];
}) {
  const [applications, setApplications] = useState<Application[]>(initialState);
  const [focusedApplication, setFocusedApplication] =
    useState<Application | null>(null);

  const values = useMemo(
    () => ({
      applications,
      focusedApplication,
      setApplications,
      setFocusedApplication,
    }),
    [applications, focusedApplication],
  );

  return (
    <ApplicationsContext.Provider value={values}>
      {children}
    </ApplicationsContext.Provider>
  );
}
