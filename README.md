# React Vessel

# Discontinued

[![npm](https://img.shields.io/npm/v/react-vessel.svg)](http://npmjs.com/react-vessel) [![Codecov](https://img.shields.io/codecov/c/github/react-vessel/react-vessel/master.svg)](https://codecov.io/gh/react-vessel/react-vessel) [![CircleCI](https://img.shields.io/circleci/project/github/react-vessel/react-vessel/master.svg)](https://circleci.com/gh/react-vessel/react-vessel)

A different approach for managing your state in react. Build your applications with composing dynamic reducers through JSX api.

| 🕹 CodeSandbox demos 🕹                                                                                            |
| ---------------------------------------------------------------------------------------------------------------- |
| [Counter](https://codesandbox.io/s/github/react-vessel/react-vessel/tree/master/examples/counter?module=/App.js) |

- [React Vessel](#react-vessel)
  - [Installation](#installation)
  - [What you can do with it](#what-you-can-do-with-it)
    - [You can write a simple counter like this](#you-can-write-a-simple-counter-like-this)
    - [You can access this state anywhere in your application](#you-can-access-this-state-anywhere-in-your-application)
    - [You can add/remove reducers dynamically](#you-can-addremove-reducers-dynamically)
    - [You can combine multiple reducers inside a Model](#you-can-combine-multiple-reducers-inside-a-model)
    - [You can build a simple FormInput](#you-can-build-a-simple-forminput)
    - [You can write effects that runs after an action](#you-can-write-effects-that-runs-after-an-action)

## Installation

Install react-vessel:

```sh
npm install react-vessel
```

or with yarn:

```sh
yarn add react-vessel
```

## What you can do with it

### You can write a simple counter like this

Here is the simplest thing you can do with a vessel.

```jsx
import React from 'react';
import { Vessel, Reducer } from 'react-vessel';

function Counter({ name }) {
  const { dispatch } = useParentVessel();
  const count = useParentState(name, 0);

  return (
    <div>
      <Reducer model={name} action="increment" reducer={(state = 0) => state + 1} />
      <Reducer model={name} action="decrement" reducer={(state = 0) => state - 1} />
      <div>{count}</div>
      <button type="button" onClick={() => dispatch({ type: 'count/increment' })}>
        Increment
      </button>
      <button type="button" onClick={() => dispatch({ type: 'count/decrement' })}>
        Decrement
      </button>
    </div>
  );
}

function App() {
  return (
    <Vessel>
      <Counter name="counter1" />
      <Counter name="counter2" />
    </Vessel>
  );
}
```

Notice how you could easily reuse the component.

Above code will produce following state in your vessel:

```json
{
  "counter1": 0,
  "counter2": 0
}
```

### You can access this state anywhere in your application

```jsx
function MyComponent() {
  const count = useParentState('counter1', 0);
  return <div>{count}</div>;
}
```

Or you can use a component with render props if you prefer that:

```jsx
function MyComponent() {
  return <WithVessel select="counter1" render={(count, { state, dispatch }) => {
    return <div>{count}</div>
  }}>
}
```

### You can add/remove reducers dynamically

```jsx
function MyComponent() {
  const [incrementEnabled, setIncrementEnabled] = useState();

  return (
    <React.Fragment>
      {incrementEnabled && (
        <Reducer model="my-counter" action="increment" reducer={(state = 0) => state + 1} />
      )}
      <Reducer model="my-counter" action="decrement" reducer={(state = 0) => state - 1} />
      <button type="button" onClick={() => setIncrementEnabled(!incrementEnabled)}>
        Enable/Disable Increment
      </button>
    </React.Fragment>
  );
}
```

### You can combine multiple reducers inside a Model

```jsx
<Model name="my-counter">
  <Reducer action="increment" reducer={(state = 0) => state + 1} />
  <Reducer action="decrement" reducer={(state = 0) => state - 1} />
</Model>
```

### You can build a simple FormInput

```jsx
function FormInput({ name, render }) {
  const value = useVesselState(`${name}.value`);
  const { dispatch } = useVesselDispatch();

  function onChange(payload) {
    dispatch({ type: `${name}/change`, payload });
  }

  return (
    <React.Fragment>
      <Reducer
        model={name}
        action="change"
        reducer={(state, payload) => ({ ...state, value: payload })}
      />
      {render({ onChange, value })}
    </React.Fragment>
  );
}

function TextInput({ name }) {
  return (
    <FormInput
      name={name}
      render={({ onChange, value }) => (
        <input value={value} onChange={e => onChange(e.target.value)} />
      )}
    />
  );
}

function App() {
  return (
    <Vessel>
      <TextInput name="smart-input" />

      <WithVessel
        select="input.value"
        render={(value, { state, dispatch }) => {
          return <p>{value}</p>;
        }}
      />
    </Vessel>
  );
}
```

### You can write effects that runs after an action

```jsx
function ValidateUsername() {
  const { dispatch } = useParentVessel();
  return (
    <Reducer model="username" action="validate-suc" reducer={(state) => ({ ...state, error: null })} />
    <Reducer model="username" action="validate-err" reducer={(state, payload) => ({ ...state, error: payload })} />
    <Effect
      on="username/changed"
      run={async action => {
        try {
          await api.validateUsername(action.payload);
          dispatch({ type: 'username/validate-suc' });
        } catch (err) {
          dispatch({ type: 'username/validate-err', payload: err.message });
        }
      }}
    />
  );
}

function App() {
  return (
    <Vessel>
      <TextInput name="username" />

      <ValidateUsername />
    </Vessel>
  );
}
```
