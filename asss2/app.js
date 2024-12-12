const { createStore, applyMiddleware } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;
const { ChakraProvider, Box, Flex, Grid, Button, Text } = window["@chakra-ui/react"];
const React = window.React;
const ReactDOM = window.ReactDOM;
const logger = window.reduxLogger.createLogger();
const axios = window.axios;

// Initial State
const initialState = {
  coffeeData: [],
  sortOrder: 'asc',
};

// Action Types
const FETCH_COFFEE = 'FETCH_COFFEE';
const SET_SORT_ORDER = 'SET_SORT_ORDER';

// Reducer
function coffeeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COFFEE:
      return { ...state, coffeeData: action.payload };
    case SET_SORT_ORDER:
      return { ...state, sortOrder: action.payload };
    default:
      return state;
  }
}

// Action Creators
const fetchCoffee = (coffeeData) => ({ type: FETCH_COFFEE, payload: coffeeData });
const setSortOrder = (order) => ({ type: SET_SORT_ORDER, payload: order });

// Middleware and Store
const store = createStore(coffeeReducer, applyMiddleware(logger));

// Fetch Coffee Data
const fetchCoffeeData = async (dispatch, sortOrder) => {
  const response = await axios.get(
    `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-coffee?sort=${sortOrder}`
  );
  dispatch(fetchCoffee(response.data.data));
};

// Components
const Sidebar = () => {
  const dispatch = useDispatch();

  const handleSortChange = (order) => {
    dispatch(setSortOrder(order));
    fetchCoffeeData(dispatch, order);
  };

  return (
    <Box p="4" bg="gray.100" height="100vh" minWidth="200px">
      <Text fontSize="lg" mb="4">Sort By</Text>
      <Button
        colorScheme="blue"
        mb="2"
        onClick={() => handleSortChange('asc')}
      >
        Ascending
      </Button>
      <Button
        colorScheme="blue"
        onClick={() => handleSortChange('desc')}
      >
        Descending
      </Button>
    </Box>
  );
};

const CoffeeGrid = () => {
  const coffeeData = useSelector((state) => state.coffeeData);

  return (
    <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="6" p="4">
      {coffeeData.map((coffee) => (
        <Box
          key={coffee.id}
          p="4"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="sm"
        >
          <Text fontSize="lg" fontWeight="bold">{coffee.title}</Text>
          <Text>Price: ${coffee.price}</Text>
        </Box>
      ))}
    </Grid>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const sortOrder = useSelector((state) => state.sortOrder);

  React.useEffect(() => {
    fetchCoffeeData(dispatch, sortOrder);
  }, [dispatch, sortOrder]);

  return (
    <Flex>
      <Sidebar />
      <CoffeeGrid />
    </Flex>
  );
};

// Render Application
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>
);
