/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useReducer, useCallback, useContext, useMemo } from 'react';
import get from 'lodash.get';
import { ReducerType, Dispatch } from './types';
import { usePersistentMap } from './usePersistentMap';
import { VesselContextType, VesselProps, VesselContext } from './vesselContext';
import { complementActionName } from './utils';
import { useEventBus } from './eventBus';

const RE_REDUCER_KEY = /(.*):(.*)\/(.*)/;

function parseReducerKey(key: string): [string, string] {
  const match = key.match(RE_REDUCER_KEY);

  /**
   * There is only one way to put a reducer into reducer map
   * and reducer key is validated there
   * so typescript should just shut up here
   */
  // @ts-ignore
  return [match[1], `${match[2]}/${match[3]}`];
}

function useVessel(name: string): VesselContextType {
  const [getReducers, setReducer] = usePersistentMap<ReducerType<any, any>>();
  const eventBus = useEventBus();

  const reducer = useCallback<ReducerType<any, any>>((state, action): any => {
    const reducers = getReducers();

    const reducerKeys = Object.keys(reducers);
    const nextState = { ...state };
    let hasChanged = false;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < reducerKeys.length; i++) {
      // reducerKey is in the format hostModel:model/action
      const reducerKey = reducerKeys[i];
      const [model, reducerAction] = parseReducerKey(reducerKey);

      if (reducerAction === action.type) {
        const currentReducer = reducers[reducerKey];
        const nextStateForModel = currentReducer(nextState[model], action.payload);
        if (nextStateForModel !== nextState[model]) {
          hasChanged = true;
          nextState[model] = nextStateForModel;
        }
      }
    }

    return hasChanged ? nextState : state;
  }, []);

  const [state, originalDispatch] = useReducer<ReducerType<any, any>>(reducer, {});
  const dispatch = useCallback<Dispatch<any>>(
    (originalAction): void => {
      const actionType = complementActionName({ vessel: name, action: originalAction.type });
      const action = {
        type: actionType,
        payload: originalAction.payload,
      };

      originalDispatch(action);
      eventBus.emit(actionType, action);
    },
    [name, originalDispatch],
  );

  const vessel = useMemo((): VesselContextType => {
    return { name, state, dispatch, setReducer };
  }, [name, state, dispatch, setReducer]);

  return vessel;
}

export function useParentVessel(): VesselContextType {
  return useContext(VesselContext);
}

type StateSelector<T> = (state: any) => T;

export function useParentState<T>(selector: string | StateSelector<T>, defaultValue?: T): T {
  const vessel = useParentVessel();
  if (typeof selector === 'string') {
    return get(vessel.state, selector, defaultValue);
  }

  const value = selector(vessel.state);
  if (typeof defaultValue !== 'undefined' && typeof value === 'undefined') {
    return defaultValue;
  }

  return value;
}

export const Vessel: React.FC<VesselProps> = ({ name = 'default-vessel', children }) => {
  const vessel = useVessel(name);
  return <VesselContext.Provider value={vessel}>{children}</VesselContext.Provider>;
};
