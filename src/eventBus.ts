import React, { useContext } from 'react';
import mitt from 'mitt';

class EventBus extends mitt {}

const eventBus = new EventBus();

export const EventBusContext = React.createContext<EventBus>(eventBus);

export function useEventBus(): EventBus {
  return useContext(EventBusContext);
}
