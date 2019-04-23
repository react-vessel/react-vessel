export interface Action<P> {
  type: string;
  payload?: P;
}

export type Dispatch<P> = (action: Action<P>) => void;

export type ReducerType<S, P> = (state: S, payload: P) => S;
