import { useEffect } from 'react';
import { ReducerType } from './types';
import { useStaticCallback } from './useStaticCallback';
import { useParentVessel } from './vessel';
import { complementActionName } from './utils';
import { useParentModel } from './model';

interface ReducerProps {
  model?: string;
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer: ReducerType<any, any>;
}

export const Reducer: React.FC<ReducerProps> = ({ model, action, reducer }) => {
  const parentModel = useParentModel();
  const vessel = useParentVessel();
  const staticReducer = useStaticCallback(reducer);

  const currentModel = model || parentModel;

  const fullActionName = complementActionName({
    action,
    model: currentModel,
    vessel: vessel.name,
  });
  useEffect((): (() => void) => {
    const reducerName = `${currentModel}:${fullActionName}`;
    vessel.setReducer(reducerName, staticReducer);

    return (): void => {
      vessel.setReducer(reducerName, undefined);
    };
  }, [fullActionName, staticReducer]);

  return null;
};
