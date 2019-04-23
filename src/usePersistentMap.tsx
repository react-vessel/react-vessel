/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useRef, useCallback } from 'react';

export interface PersistentMap<T> {
  [name: string]: T;
}

type GetAll<T> = () => PersistentMap<T>;
export type SetItem<T> = (name: string, item: T | undefined) => void;

export function usePersistentMap<T>(): [GetAll<T>, SetItem<T>] {
  const ref = useRef<PersistentMap<T>>({});

  const getAll = useCallback<GetAll<T>>(() => ref.current, [ref]);
  const set = useCallback<SetItem<T>>(
    (name, item) => {
      if (typeof item === 'undefined') {
        delete ref.current[name];
      } else {
        ref.current[name] = item;
      }
    },
    [ref],
  );

  return [getAll, set];
}
