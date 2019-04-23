/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Dispatch } from './types';
import { useParentState, useParentVessel } from './vessel';

interface WithVesselProps {
  select: string;
  default?: any;
  render: (selectedState: any, params: { state: any; dispatch: Dispatch<any> }) => JSX.Element;
}

export const WithVessel: React.FC<WithVesselProps> = ({
  select,
  default: defaultValue,
  render,
}) => {
  const { state, dispatch } = useParentVessel();
  const selectedState = useParentState(select, defaultValue);
  return render(selectedState, { state, dispatch });
};
