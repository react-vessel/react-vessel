# React Vessel

A vessel for your state

This library will allow you to do something like following:

```jsx
function FormInput({ name, render }) {
  const value = useVesselState(`${name}.value`);
  const { dispatch } = useVesselDispatch();

  function onChange(payload) {
    dispatch({ type: `${name}/change`, payload });
  }

  return (
    <>
      <Model name={name}>
        <Reducer
          action="change"
          reducer={(state, payload) => ({ ...state, value: payload })}
        />
      </Model>
      {render({ onChange, value })}
    </>
  );
}

function SmartInput({ name }) {
  return (
    <FormInput
      name={name}
      render={({ onChange, value }) => (
        <input value={value} onChange={e => onChange(e.target.value)} />
      )}
    />
  );
}

function Dashboard() {
  return (
    <>
      <Vessel>
        <SmartInput name="smart-input" />

        <Model name="count">
          <Reducer action="increment" reducer={state => state + 1} />
          <Reducer action="decrement" reducer={state => state - 1} />
        </Model>

        <WithVessel select="input.value" render={(value, { state, dispatch }) => {
          return <p>{value}</p>
        }} />

        <Model name="doubleCount">
          <Reducer action="count/increment" reducer={state => state + 2} />
          <Reducer action="count/decrement" reducer={state => state - 2} />
        </Model>

        <button onClick={() => dispatch({ type: 'count/increment' })}>
          increment
        </button>
        <button onClick={() => dispatch({ type: 'count/decrement' })}>
          decrement
        </button>
      </Vessel>
    </>
  );
}
```