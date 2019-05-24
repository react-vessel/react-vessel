import React from 'react';
import { Model } from '../../src/model';
import { Reducer } from '../../src/reducer';
import { useParentState, useParentVessel } from '../../src/vessel';

export const Counter: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <Reducer model={name} action="increment" reducer={(state = 0) => state + 1} />
      <Reducer model={name} action="decrement" reducer={(state = 0) => state - 1} />
    </>
  );
};

export const CounterWithModel: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <Model name={name}>
        <Reducer action="increment" reducer={(state = 0) => state + 1} />
        <Reducer action="decrement" reducer={(state = 0) => state - 1} />
      </Model>
    </>
  );
};

export const CounterShow: React.FC<{ name: string }> = ({ name }) => {
  const count = useParentState('count', 0);
  return <div className={`counterShow-${name}`}>{count}</div>;
};

export const CounterButtons: React.FC<{ name: string }> = ({ name }) => {
  const vessel = useParentVessel();
  return (
    <div className={`counterButtons-${name}`}>
      <button
        type="button"
        className="increment"
        onClick={() => vessel.dispatch({ type: `${name}/increment` })}
      >
        {`Increment ${name}`}
      </button>
      <button
        type="button"
        className="decrement"
        onClick={() => vessel.dispatch({ type: `${name}/decrement` })}
      >
        {`Decrement ${name}`}
      </button>
    </div>
  );
};
