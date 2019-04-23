import React, { useState } from 'react';
import { fireEvent, render, cleanup } from 'react-testing-library';
import { Reducer } from '../src/reducer';
import { useParentState, Vessel } from '../src/vessel';
import { Counter, CounterButtons, CounterShow, CounterWithModel } from './utils/counter';

afterEach(cleanup);

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
