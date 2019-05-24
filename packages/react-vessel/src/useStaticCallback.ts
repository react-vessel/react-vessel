/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useCallback } from 'react';

type CallbackType = (...args: any[]) => any;

export function useStaticCallback(callback: CallbackType): CallbackType {
  const ref = useRef(callback);

  useEffect((): void => {
    ref.current = callback;
  }, [callback]);

  const staticCallback = useCallback<CallbackType>((...args): any => ref.current(...args), [ref]);

  return staticCallback;
}
