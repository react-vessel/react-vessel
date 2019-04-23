import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { complementActionName } from '../src/utils';
import { Vessel } from '../src/vessel';
import { WithVessel } from '../src/withVessel';
import { CounterButtons, CounterWithModel } from './utils/counter';

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
