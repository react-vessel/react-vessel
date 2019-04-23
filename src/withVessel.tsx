/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useParentState, useParentVessel } from './vessel';
import { VesselContextType } from './vesselContext';

interface WithVesselProps {
  select: string;
  default?: any;
  render: (selectedState: any, vessel: VesselContextType) => JSX.Element;
}

export const WithVessel: React.FC<WithVesselProps> = ({
  select,
  default: defaultValue,
  render,
}) => {
  const vessel = useParentVessel();
  const selectedState = useParentState(select, defaultValue);
  return render(selectedState, vessel);
};
