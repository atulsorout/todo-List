const { createStore, applyMiddleware } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;
const { ChakraProvider, Box, Button, Text, VStack } = window["@chakra-ui/react"];

// Action Types
const ACTION_SUCCESS = "ACTION_SUCCESS";
const ACTION_FAILURE = "ACTION_FAILURE";

// Reducer
const initialState = {
  message: "",
  error: null,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SUCCESS:
      return { ...state, message: action.payload, error: null };
    case ACTION_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Middleware for Error Handling
const errorHandlingMiddleware = (store) => (next) => (action) => {
  if (action.error) {
    console.error("Error detected:", action.error);
  }
  return next(action);
};

// Redux Store
const store = createStore(reducer, applyMiddleware(errorHandlingMiddleware));

// Action Creators
const actionSuccess = (message) => ({
  type: ACTION_SUCCESS,
  payload: message,
});
const actionFailure = (error) => ({
  type: ACTION_FAILURE,
  error,
});

// React Components
const App = () => {
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state);

  const handleSuccess = () => {
    dispatch(actionSuccess("Action completed successfully!"));
  };

  const handleFailure = () => {
    dispatch(actionFailure("Something went wrong."));
  };

  return (
    <VStack spacing={4} p={8}>
      <Box>
        <Text fontSize="xl" mb={4}>Redux Error Handling Middleware</Text>
        {message && <Text color="green.500">{message}</Text>}
        {error && <Text color="red.500">{error}</Text>}
      </Box>
      <Button colorScheme="green" onClick={handleSuccess}>
        Dispatch Success Action
      </Button>
      <Button colorScheme="red" onClick={handleFailure}>
        Dispatch Failure Action
      </Button>
    </VStack>
  );
};

// Render Application
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>
);
