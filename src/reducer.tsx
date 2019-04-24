import { useEffect } from 'react';
import { ReducerType } from './types';
import { useStaticCallback } from './useStaticCallback';
import { useParentVessel } from './vessel';
import { complementActionType } from './utils';
import { useParentModel } from './model';

interface ReducerProps {
  model?: string;
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer: ReducerType<any, any>;
}

export const Reducer: React.FC<ReducerProps> = ({ model, action, reducer }) => {
  const parentModel = useParentModel();
  const { name: vesselName, setReducer } = useParentVessel();
  const staticReducer = useStaticCallback(reducer);

  const currentModel = model || parentModel;

  const fullActionName = complementActionType({
    action,
    model: currentModel,
    vessel: vesselName,
  });

  useEffect((): (() => void) => {
    const reducerName = `${currentModel}:${fullActionName}`;
    setReducer(reducerName, staticReducer);

    return (): void => {
      setReducer(reducerName, undefined);
    };
  }, [currentModel, fullActionName, staticReducer, setReducer]);

  return null;
};
