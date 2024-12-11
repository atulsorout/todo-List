// Redux Setup
const { createStore, applyMiddleware } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;
const { ChakraProvider, Box, Button, Input, Text, Spinner, Flex, Grid } = window["@chakra-ui/react"];
const axios = window.axios;

// Action Types
const FETCH_MOVIES = 'FETCH_MOVIES';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';

// Initial State
const initialState = {
  movies: [],
  watchlist: [],
  isAuthenticated: false,
  user: null,
  loading: false,
};

// Reducers
const moviesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MOVIES:
      return { ...state, movies: action.payload };
    case TOGGLE_FAVORITE:
      const isFavorite = state.watchlist.includes(action.payload);
      return {
        ...state,
        watchlist: isFavorite ? state.watchlist.filter((id) => id !== action.payload) : [...state.watchlist, action.payload]
      };
    case LOGIN_USER:
      return { ...state, isAuthenticated: true, user: action.payload };
    case LOGOUT_USER:
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

// Create Redux Store
const store = createStore(moviesReducer);

// Action Creators
const fetchMovies = (searchTerm) => async (dispatch) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_TMDB_API_KEY&query=${searchTerm}`);
    dispatch({ type: FETCH_MOVIES, payload: response.data.results });
  } catch (error) {
    console.error(error);
  }
};

const toggleFavorite = (movieId) => ({
  type: TOGGLE_FAVORITE,
  payload: movieId
});

const loginUser = (user) => ({
  type: LOGIN_USER,
  payload: user
});

const logoutUser = () => ({
  type: LOGOUT_USER,
});


// Movie Search Component
const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(fetchMovies(searchTerm));
    }
  };

  return (
    <Box mb={4}>
      <Input
        placeholder="Search for a movie"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={2}
      />
      <Button colorScheme="teal" onClick={handleSearch}>Search</Button>
    </Box>
  );
};

// Movie List Component
const MovieList = () => {
  const { movies, watchlist, loading } = useSelector((state) => state);
  const dispatch = useDispatch();

  if (loading) {
    return <Spinner size="lg" color="teal" />;
  }

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
      {movies.map((movie) => (
        <Box key={movie.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <Box p="6">
            <Text fontSize="xl" fontWeight="bold">{movie.title}</Text>
            <Button onClick={() => dispatch(toggleFavorite(movie.id))} mt={2}>
              {watchlist.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

// App Component
const App = () => (
  <ChakraProvider>
    <Box p={4}>
      <MovieSearch />
      <MovieList />
    </Box>
  </ChakraProvider>
);

// Render App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
