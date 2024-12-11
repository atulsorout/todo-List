const { ChakraProvider, Box, Button, Input, Select, Stack, Checkbox, Text, Flex, Heading } = window['@chakra-ui/react'];
const { createStore, combineReducers } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;

// Initial States
const initialBooksState = {
  books: [],
};

const initialFiltersState = {
  author: '',
  genre: '',
  isRead: null,
};

// Books Reducer
const booksReducer = (state = initialBooksState, action) => {
  switch (action.type) {
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'EDIT_BOOK':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id ? { ...book, ...action.payload.updatedBook } : book
        ),
      };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter((book) => book.id !== action.payload) };
    case 'TOGGLE_READ':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload ? { ...book, isRead: !book.isRead } : book
        ),
      };
    default:
      return state;
  }
};

// Filters Reducer
const filtersReducer = (state = initialFiltersState, action) => {
  switch (action.type) {
    case 'SET_AUTHOR_FILTER':
      return { ...state, author: action.payload };
    case 'SET_GENRE_FILTER':
      return { ...state, genre: action.payload };
    case 'SET_READ_FILTER':
      return { ...state, isRead: action.payload };
    default:
      return state;
  }
};

// Combine Reducers
const rootReducer = combineReducers({
  books: booksReducer,
  filters: filtersReducer,
});

// Create Store
const store = createStore(rootReducer);

// Components
const BookForm = () => {
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [genre, setGenre] = React.useState('');
  const dispatch = useDispatch();

  const handleAddBook = () => {
    const newBook = { id: Date.now(), title, author, genre, isRead: false };
    dispatch({ type: 'ADD_BOOK', payload: newBook });
    setTitle('');
    setAuthor('');
    setGenre('');
  };

  return (
    <Box mb={4}>
      <Stack spacing={3}>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <Select placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Biography">Biography</option>
        </Select>
        <Button colorScheme="teal" onClick={handleAddBook}>
          Add Book
        </Button>
      </Stack>
    </Box>
  );
};

const BookList = () => {
  const books = useSelector((state) => state.books.books);
  const dispatch = useDispatch();

  return (
    <Box>
      {books.map((book) => (
        <Flex key={book.id} justify="space-between" align="center" mb={2} p={2} border="1px solid lightgray" borderRadius="md">
          <Text>
            {book.title} by {book.author}
          </Text>
          <Flex>
            <Checkbox isChecked={book.isRead} onChange={() => dispatch({ type: 'TOGGLE_READ', payload: book.id })} mr={2}>
              Read
            </Checkbox>
            <Button colorScheme="red" size="sm" onClick={() => dispatch({ type: 'DELETE_BOOK', payload: book.id })}>
              Delete
            </Button>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
};

const Filters = () => {
  const dispatch = useDispatch();

  return (
    <Box mb={4}>
      <Input placeholder="Filter by Author" onChange={(e) => dispatch({ type: 'SET_AUTHOR_FILTER', payload: e.target.value })} mb={2} />
      <Select placeholder="Filter by Genre" onChange={(e) => dispatch({ type: 'SET_GENRE_FILTER', payload: e.target.value })} mb={2}>
        <option value="Fiction">Fiction</option>
        <option value="Non-Fiction">Non-Fiction</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Biography">Biography</option>
      </Select>
    </Box>
  );
};

const App = () => (
  <ChakraProvider>
    <Box maxW="container.md" p={4} mx="auto">
      <Heading mb={4}>Book Library</Heading>
      <Filters />
      <BookForm />
      <BookList />
    </Box>
  </ChakraProvider>
);

// Render Application
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
