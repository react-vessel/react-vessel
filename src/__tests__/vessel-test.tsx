import React, { useState } from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import { Reducer } from '../reducer';

import { Vessel, useParentState, useParentVessel } from '../vessel';
import { Model } from '../model';
import { complementActionName } from '../utils';
import { WithVessel } from '../withVessel';

const CounterWithModel: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <Model name={name}>
        <Reducer action="increment" reducer={(state = 0) => state + 1} />
        <Reducer action="decrement" reducer={(state = 0) => state - 1} />
      </Model>
    </>
  );
};

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

afterEach(cleanup);

describe('Vessel', () => {
  it('renders without a name', () => {
    const { asFragment } = render(<Vessel />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with a name', () => {
    const { asFragment } = render(<Vessel name="test" />);

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Reducer', () => {
  it('works without a model', () => {
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

  it('works with a model', () => {
    const { container, getByText } = render(
      <Vessel name="test">
        <CounterWithModel name="count" />
        <CounterShow name="count" />
        <CounterButtons name="count" />
      </Vessel>,
    );

    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('0');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('1');
  });

  it('works with a selector method', () => {
    const CounterShowWithSelector: React.FC<{ name: string }> = ({ name }) => {
      const count = useParentState(state => state[name], 0);
      return <div className={`counterShow-${name}`}>{count}</div>;
    };

    const { container, getByText } = render(
      <Vessel name="test">
        <CounterShowWithSelector name="count" />
        <CounterWithModel name="count" />
        <CounterButtons name="count" />
      </Vessel>,
    );

    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('0');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('1');
  });

  it('unmounts cleanly', () => {
    function CounterWithToggle() {
      const [rendered, setRendered] = useState(true);

      return (
        <>
          {rendered && <Counter name="count" />}

          <button type="button" onClick={() => setRendered(!rendered)}>
            Toggle Counter
          </button>
        </>
      );
    }

    const { container, getByText } = render(
      <Vessel name="test">
        <CounterWithToggle />
        <CounterShow name="count" />
        <CounterButtons name="count" />
      </Vessel>,
    );

    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('0');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('1');

    // unmount the counter
    fireEvent.click(getByText('Toggle Counter'));

    // count should still be '1' because we unmounted the counter
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.counterShow-count`)!.textContent).toEqual('1');
  });

  describe('', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error');
      // @ts-ignore
      console.error.mockImplementation(() => {});
    });

    afterEach(() => {
      // @ts-ignore
      console.error.mockRestore();
    });

    it('throws with wrong action types', () => {
      function IncorrectCounter() {
        return (
          <>
            <Reducer model="count" action="a/b/c/d" reducer={state => state} />
          </>
        );
      }

      expect(() => {
        render(
          <Vessel name="test">
            <IncorrectCounter />
          </Vessel>,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('throws if cannot resolve a model', () => {
      function IncorrectCounter() {
        return (
          <>
            <Reducer action="increment" reducer={state => state} />
          </>
        );
      }

      expect(() => {
        render(
          <Vessel name="test">
            <IncorrectCounter />
          </Vessel>,
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });
});

test('complementActionName works with different levels', () => {
  expect(complementActionName({ action: 'increment', model: 'count', vessel: 'vessel' })).toEqual(
    'vessel/count/increment',
  );

  expect(
    complementActionName({ action: 'increment', model: 'count', vessel: 'vessel', level: 2 }),
  ).toEqual('count/increment');

  expect(
    complementActionName({ action: 'increment', model: 'count', vessel: 'vessel', level: 1 }),
  ).toEqual('increment');
});

describe('WithVessel', () => {
  it('works without default value', () => {
    const { container, getByText } = render(
      <Vessel name="test">
        <CounterWithModel name="count" />
        <WithVessel
          select="count"
          render={count => {
            return <div className="count-element">{count}</div>;
          }}
        />
        <CounterButtons name="count" />
      </Vessel>,
    );

    expect(container.querySelector(`.count-element`)!.textContent).toEqual('');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.count-element`)!.textContent).toEqual('1');
  });

  it('works with default value', () => {
    const { container, getByText } = render(
      <Vessel name="test">
        <CounterWithModel name="count" />
        <WithVessel
          select="count"
          default={0}
          render={count => {
            return <div className="count-element">{count}</div>;
          }}
        />
        <CounterButtons name="count" />
      </Vessel>,
    );

    expect(container.querySelector(`.count-element`)!.textContent).toEqual('0');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.count-element`)!.textContent).toEqual('1');
  });

  it('brings dispatch', () => {
    const { container, getByText } = render(
      <Vessel name="test">
        <CounterWithModel name="count" />
        <WithVessel
          select="count"
          default={0}
          render={(count, { dispatch }) => {
            return (
              <>
                <div className="count-element">{count}</div>
                <button type="button" onClick={() => dispatch({ type: 'count/increment' })}>
                  Increment count
                </button>
                <button type="button" onClick={() => dispatch({ type: 'count/decrement' })}>
                  Decrement count
                </button>
              </>
            );
          }}
        />
      </Vessel>,
    );

    expect(container.querySelector(`.count-element`)!.textContent).toEqual('0');
    fireEvent.click(getByText('Increment count'));
    expect(container.querySelector(`.count-element`)!.textContent).toEqual('1');
  });
});
