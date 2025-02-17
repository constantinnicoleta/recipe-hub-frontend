import { useEffect, useCallback } from "react";
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider, useSetAuth } from './context/AuthContext';
import LoginForm from "./pages/auth/LoginForm";
import SignUpForm from "./pages/auth/SignUpForm";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import EditRecipePage from "./pages/EditRecipePage";
import CreateRecipePage from "./pages/CreateRecipePage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import UsersListPage from "./pages/UsersListPage";
import { axiosRes } from "./api/axiosDefaults";
import FeedPage from "./pages/FeedPage";

function App() {
  const setCurrentUser = useSetAuth();

  const verifyUser = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const { data } = await axiosRes.get("/auth/user/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setCurrentUser(data);
    } catch (error) {
      console.error("Error checking user status:", error);
      setCurrentUser(null);
    }
  }, [setCurrentUser]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <AuthProvider>
      <Router>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" component={FeedPage} />
              <Route exact path="/recipes" component={RecipesPage} />
              <Route path="/recipes/create" component={CreateRecipePage} />
              <Route exact path="/recipes/:recipeId" component={RecipeDetailPage} />
              <Route exact path="/recipes/:id/edit" component={EditRecipePage} />
              <Route exact path="/categories" component={CategoriesPage} />
              <Route exact path="/users" component={UsersListPage} /> 
              <Route exact path="/categories/:id" component={CategoryDetailPage} />
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