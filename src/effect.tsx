import React, { useEffect } from 'react';
import { useStaticCallback } from './useStaticCallback';
import { useEventBus } from './eventBus';
import { Action } from './types';
import { complementActionType } from './utils';
import { useParentVessel } from './vessel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EffectHandler = (action: Action<any>) => void;

export interface EffectProps {
  on: string;
  run: EffectHandler;
}

export const Effect: React.FC<EffectProps> = ({ on, run }) => {
  const vessel = useParentVessel();
  const eventBus = useEventBus();
  const staticCallback = useStaticCallback(run);
  const action = complementActionType({ action: on, vessel: vessel.name });

  useEffect((): (() => void) => {
    eventBus.on(action, staticCallback);

    return (): void => {
      eventBus.off(action, staticCallback);
    };
  }, [action, run]);

  return null;
};
