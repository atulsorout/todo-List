const { createStore, applyMiddleware } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;
const React = window.React;
const ReactDOM = window.ReactDOM;

// Custom Middleware for Logging Action Types
const actionTypeLogger = (store) => (next) => (action) => {
  console.log('Action Type:', action.type);
  return next(action);
};

// Custom Middleware for Logging Payloads
const payloadLogger = (store) => (next) => (action) => {
  console.log('Payload:', action.payload);
  return next(action);
};

// Reducer Function
const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
}

// Create Redux Store with Middleware
const store = createStore(
  counterReducer,
  applyMiddleware(actionTypeLogger, payloadLogger)
);

// React Components
const Counter = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.count);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 'Add 1' })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT', payload: 'Subtract 1' })}>
        Decrement
      </button>
      <button onClick={() => dispatch({ type: 'RESET', payload: 'Reset Count' })}>
        Reset
      </button>
    </div>
  );
};

// Render React Application
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Counter />
  </Provider>
);
