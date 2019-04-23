import React, { useContext } from 'react';

const ModelContext = React.createContext<string>('');

export function useParentModel(): string {
  return useContext(ModelContext);
}

export const Model: React.FC<{ name: string }> = ({ name, children }) => {
  return <ModelContext.Provider value={name}>{children}</ModelContext.Provider>;
};
