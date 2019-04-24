import React from 'react';
import { useParentState, useParentVessel, Reducer, Model } from 'react-vessel';

function Counter({ name }) {
  const { dispatch } = useParentVessel();
  const count = useParentState(name, 0);
  return (
    <div>
      <h1>{name}</h1>
      <p>{count}</p>
      <button type="button" onClick={() => dispatch({ type: `${name}/increment` })}>
        Increment
      </button>
      <button type="button" onClick={() => dispatch({ type: `${name}/decrement` })}>
        Decrement
      </button>

      <Model name={name}>
        <Reducer action="increment" reducer={(state = 0) => state + 1} />
        <Reducer action="decrement" reducer={(state = 0) => state - 1} />
      </Model>
    </div>
  );
}

function CounterShow({ name }) {
  const count = useParentState(name, 0);
  return (
    <div>
      <p>
        Value of {name}: {count}
      </p>
    </div>
  );
}

export default function App() {
  const count = useParentState('counter1', 0);

  return (
    <div>
      <Counter name="counter1" />
      <Counter name="counter2" />

      <CounterShow name="counter1" />
      <CounterShow name="counter2" />

      <p>I am right inside App and counter1 value is: {count}</p>
    </div>
  );
}
