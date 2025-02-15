import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import { AuthProvider } from './context/AuthContext';
import HomePage from "./pages/HomePage";
import LoginForm from "./pages/auth/LoginForm";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" component={HomePage} /> 
              <Route exact path="/dashboard" component={DashboardPage} />
              <Route exact path="/recipes" component={() => <h1>Recipes</h1>} />
              <Route exact path="/categories" component={() => <h1>Categories</h1>} />
              <Route exact path="/signin" component={LoginForm} />
              <Route exact path="/signup" component={SignUpForm} />
              <Route component={() => <p>Page not found!</p>} />
            </Switch>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

