import { useEffect } from 'react';
import { ReducerType } from './types';
import { useStaticCallback } from './useStaticCallback';
import { useParentVessel } from './vessel';
import { complementActionName } from './utils';

interface ReducerProps {
  model: string;
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer: ReducerType<any, any>;
}

export const Reducer: React.FC<ReducerProps> = ({ model, action, reducer }) => {
  const vessel = useParentVessel();
  const staticReducer = useStaticCallback(reducer);

  const fullActionName = complementActionName({ action, model, vessel: vessel.name });
  useEffect((): (() => void) => {
    const reducerName = `${model}:${fullActionName}`;
    vessel.setReducer(reducerName, staticReducer);

    return (): void => {
      vessel.setReducer(reducerName, undefined);
    };
  }, [fullActionName, staticReducer]);

  return null;
};
