const { createStore, combineReducers, applyMiddleware } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;
const { ChakraProvider, Box, Button, Flex, Text, Input, Grid } = window["@chakra-ui/react"];
const { BrowserRouter, Routes, Route, Navigate, useNavigate } = ReactRouterDOM;
const logger = window.reduxLogger.createLogger();
const axios = window.axios;

// Redux Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const FETCH_QUIZ_SUCCESS = 'FETCH_QUIZ_SUCCESS';
const UPDATE_SCORE = 'UPDATE_SCORE';

// Redux Reducers
const initialAuthState = { isAuthenticated: false };
const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true };
    default:
      return state;
  }
};

const initialQuizState = { quizData: [], currentQuestionIndex: 0, score: 0 };
const quizReducer = (state = initialQuizState, action) => {
  switch (action.type) {
    case FETCH_QUIZ_SUCCESS:
      return { ...state, quizData: action.payload };
    case UPDATE_SCORE:
      return { ...state, score: state.score + action.payload };
    default:
      return state;
  }
};

// Redux Store
const rootReducer = combineReducers({
  auth: authReducer,
  quiz: quizReducer,
});
const store = createStore(rootReducer, applyMiddleware(logger));

// Helper Functions
const loginUser = async (email, password, navigate) => {
  try {
    const response = await axios.post('https://reqres.in/api/login', { email, password });
    if (response.status === 200) {
      store.dispatch({ type: LOGIN_SUCCESS });
      navigate('/quiz');
    }
  } catch (error) {
    console.error('Login failed', error);
  }
};

const fetchQuizData = async () => {
  const response = await axios.get('https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-quiz');
  store.dispatch({ type: FETCH_QUIZ_SUCCESS, payload: response.data.data });
};

// Components
const Navbar = () => (
  <Flex p="4" bg="blue.500" color="white" justify="center">
    <Text fontSize="xl">Quiz App</Text>
  </Flex>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => loginUser(email, password, navigate);

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box p="4" borderWidth="1px" borderRadius="md" boxShadow="lg">
        <Text mb="4" fontSize="lg" fontWeight="bold">Login</Text>
        <Input mb="2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input mb="2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
      </Box>
    </Flex>
  );
};

const QuizPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizData, currentQuestionIndex, score } = useSelector((state) => state.quiz);

  React.useEffect(() => {
    if (quizData.length === 0) fetchQuizData();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) dispatch({ type: UPDATE_SCORE, payload: 1 });
    if (currentQuestionIndex + 1 < quizData.length) {
      store.dispatch({ type: FETCH_QUIZ_SUCCESS, payload: quizData.slice(currentQuestionIndex + 1) });
    } else {
      navigate('/result');
    }
  };

  if (quizData.length === 0) return <Text>Loading...</Text>;

  return (
    <Flex direction="column" align="center" mt="8">
      <Text fontSize="xl" mb="4">{quizData[currentQuestionIndex].question}</Text>
      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        {quizData[currentQuestionIndex].options.map((option, index) => (
          <Button key={index} onClick={() => handleAnswer(option.isCorrect)}>{option.text}</Button>
        ))}
      </Grid>
    </Flex>
  );
};

const ResultPage = () => {
  const { score } = useSelector((state) => state.quiz);

  return (
    <Flex direction="column" align="center" mt="8">
      <Text fontSize="2xl">Quiz Completed!</Text>
      <Text fontSize="xl" mt="4">Your Score: {score}</Text>
    </Flex>
  );
};

// Routes
const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/quiz"
          element={isAuthenticated ? <QuizPage /> : <Navigate to="/" />}
        />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
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
