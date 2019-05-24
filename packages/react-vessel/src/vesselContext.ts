/* eslint-disable 
  @typescript-eslint/explicit-function-return-type,
  @typescript-eslint/no-explicit-any 
*/
import React from 'react';
import { Dispatch, ReducerType } from './types';
import { SetItem } from './usePersistentMap';

export interface VesselProps {
  name?: string;
}

export interface VesselContextType {
  name: string;
  state: any;
  dispatch: Dispatch<any>;
  setReducer: SetItem<ReducerType<any, any>>;
}

export const VesselContext = React.createContext<VesselContextType>({
  name: '',
  state: {},
  dispatch: /* istanbul ignore next */ () => {},
  setReducer: /* istanbul ignore next */ () => {},
});
