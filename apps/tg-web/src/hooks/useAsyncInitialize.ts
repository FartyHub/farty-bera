/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: any[] = [],
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
