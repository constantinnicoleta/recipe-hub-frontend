import { useEffect} from "react";
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider, useSetAuth } from './context/AuthContext';
import HomePage from "./pages/HomePage";
import LoginForm from "./pages/auth/LoginForm";
import SignUpForm from "./pages/auth/SignUpForm";
import DashboardPage from "./pages/DashboardPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import EditRecipePage from "./pages/EditRecipePage";
import { axiosRes } from "./api/axiosDefaults";

function App() {
  const setCurrentUser = useSetAuth();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axiosRes.get("/auth/user/");
        setCurrentUser(data);
      } catch (error) {
        console.error("Error checking user status:", error);
        setCurrentUser(null);
      }
    };

    verifyUser();
  }, [setCurrentUser]);

  return (
    <AuthProvider>
      <Router>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" component={HomePage} /> 
              <Route exact path="/dashboard" component={DashboardPage} />
              <Route exact path="/recipes" component={RecipesPage} />
              <Route exact path="/recipes/:id" component={RecipeDetailPage} />
              <Route exact path="/recipes/:id/edit" component={EditRecipePage} />
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