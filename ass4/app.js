const { ChakraProvider, Box, Button, Input, Stack, Text, Flex, Spinner, Checkbox } = window["@chakra-ui/react"];
const { createStore, applyMiddleware } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;

// Action Types
const FETCH_START = "FETCH_START";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_ERROR = "FETCH_ERROR";
const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

// Initial State
const initialState = {
  isLoading: false,
  isError: false,
  footballMatches: [],
  favorites: [],
};

// Reducer
const footballReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, isLoading: true, isError: false };
    case FETCH_SUCCESS:
      return { ...state, isLoading: false, footballMatches: action.payload };
    case FETCH_ERROR:
      return { ...state, isLoading: false, isError: true };
    case TOGGLE_FAVORITE:
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    default:
      return state;
  }
};

// Middleware for Async Fetching
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Store
const store = createStore(footballReducer, applyMiddleware(thunkMiddleware));

// Async Action Creator to Fetch Matches
const fetchMatches = () => async (dispatch) => {
  dispatch({ type: FETCH_START });
  try {
    const response = await fetch("https://jsonmock.hackerrank.com/api/football_matches?page=2");
    const data = await response.json();
    dispatch({ type: FETCH_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR });
  }
};

// Components
const MatchList = () => {
  const { isLoading, isError, footballMatches, favorites } = useSelector((state) => state);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  if (isLoading) return <Spinner size="xl" color="teal.500" />;
  if (isError) return <Text color="red.500">Failed to load matches!</Text>;

  return (
    <Box>
      {footballMatches.map((match) => (
        <Flex
          key={match.fifa_id}
          p={4}
          mb={2}
          border="1px solid lightgray"
          borderRadius="md"
          justify="space-between"
          align="center"
        >
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {match.team1} vs {match.team2}
            </Text>
            <Text>Date: {match.date}</Text>
            <Text>Venue: {match.venue}</Text>
          </Box>
          <Checkbox
            isChecked={favorites.includes(match.fifa_id)}
            onChange={() => dispatch({ type: TOGGLE_FAVORITE, payload: match.fifa_id })}
          >
            Favorite
          </Checkbox>
        </Flex>
      ))}
    </Box>
  );
};

const App = () => (
  <ChakraProvider>
    <Box maxW="container.md" p={4} mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Football Match Tracker
      </Text>
      <MatchList />
    </Box>
  </ChakraProvider>
);

// Render Application
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
