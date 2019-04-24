import React, { useState } from 'react';
import { fireEvent, render } from 'react-testing-library';
import { Vessel, Effect } from '../src';
import { Counter, CounterButtons, CounterShow } from './utils/counter';

describe('Effect', () => {
  it('calls callback', () => {
    const callback = jest.fn();

    const { getByText } = render(
      <Vessel name="test">
        <Counter name="count" />
        <CounterShow name="count" />
        <CounterButtons name="count" />
        <Effect on="count/increment" run={callback} />
      </Vessel>,
    );

    fireEvent.click(getByText('Increment count'));
    expect(callback).toHaveBeenCalledWith({ type: 'test/count/increment' });
  });

  it('unmounts cleanly', () => {
    const callback = jest.fn();

    function EffectWithToggle(): JSX.Element {
      const [visible, setVisible] = useState(true);
      return (
        <div>
          {visible && <Effect on="count/increment" run={callback} />}
          <button type="button" onClick={() => setVisible(!visible)}>
            Toggle Effect
          </button>
        </div>
      );
    }

    const { getByText } = render(
      <Vessel name="test">
        <Counter name="count" />
        <CounterShow name="count" />
        <CounterButtons name="count" />
        <EffectWithToggle />
      </Vessel>,
    );

    fireEvent.click(getByText('Increment count'));
    expect(callback).toHaveBeenCalledWith({ type: 'test/count/increment' });

    fireEvent.click(getByText('Toggle Effect'));
    fireEvent.click(getByText('Increment count'));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
