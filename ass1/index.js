// Redux Setup
const { createStore } = Redux;

// Initial State
const initialState = {
  counter: 0,
};

// Reducer
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

// Create Store
const store = createStore(counterReducer);

// React and Redux Integration
const { Provider, useDispatch, useSelector } = ReactRedux;

const App = () => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter Application</h1>
      <p>Counter Value: {counter}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
      <h3>State (Stringified):</h3>
      <p>{JSON.stringify({ counter })}</p>
    </div>
  );
};

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
