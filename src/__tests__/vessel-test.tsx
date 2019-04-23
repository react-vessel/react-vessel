import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { Reducer } from '../reducer';

import { Vessel, useParentState, useParentVessel } from '../vessel';

const Counter: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <Reducer model={name} action="increment" reducer={(state = 0) => state + 1} />
      <Reducer model={name} action="decrement" reducer={(state = 0) => state - 1} />
    </>
  );
};

const CounterShow: React.FC<{ name: string }> = ({ name }) => {
  const count = useParentState('count', 0);
  return <div className={`counterShow-${name}`}>{count}</div>;
};

const CounterButtons: React.FC<{ name: string }> = ({ name }) => {
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

describe('Vessel', () => {
  it('renders without a name', () => {
    const { asFragment } = render(<Vessel />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with a name', () => {
    const { asFragment } = render(<Vessel name="test" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('works with a counter reducer', () => {
    const { container, getByText } = render(
      <Vessel name="test">
        <Counter name="count" />
        <CounterShow name="count" />
        <CounterButtons name="count" />
      </Vessel>,
    );

    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('0');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('1');
  });
});
