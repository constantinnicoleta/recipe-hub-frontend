import React, { useEffect, useState, useCallback } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/RecipesPage.module.css";

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const currentUser = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (!currentUser) {
            history.push("/signin");
        }
    }, [currentUser, history]);

    const fetchRecipes = useCallback(async () => {
        try {
            const response = await axiosReq.get(`/api/recipes/?author=${currentUser?.username}`);
            console.log("Fetched Recipes:", response.data); 
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchRecipes();
        }
    }, [fetchRecipes, currentUser]);

    const handleDelete = async (recipeId) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        try {
            await axiosReq.delete(`/api/recipes/${recipeId}/`);
            setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe.");
        }
    };

    return currentUser ? (
        <Container className={styles.centeredContainer}>
            <h1 className={styles.pageTitle}>My Recipes</h1>

            <div className={styles.buttonContainer}>
                <Link to="/recipes/create">
                    <Button variant="success" className={styles.createButton}>
                        Create New Recipe
                    </Button>
                </Link>
            </div>

            {recipes.length === 0 ? (
                <p className={styles.noRecipesText}>You haven't created any recipes yet.</p>
            ) : (
                <Row className={styles.recipesContainer}>
                    {recipes.map((recipe) => (
                        <Col key={recipe.id} md={6} lg={4} className="mb-4">
                            <Card className={styles.recipeCard}>
                                <Card.Body>
                                    <Card.Title className={styles.recipeTitle}>
                                        {recipe.title}
                                    </Card.Title>
                                    <Card.Text className={styles.recipeDescription}>
                                        {recipe.description}
                                    </Card.Text>

                                    <div className={styles.buttonGroup}>
                                        <Link to={`/recipes/${recipe.id}`}>
                                            <Button variant="primary" className={styles.recipeButton}>
                                                View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="warning"
                                            className={styles.recipeButton}
                                            onClick={() => history.push(`/recipes/${recipe.id}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className={styles.recipeButton}
                                            onClick={() => handleDelete(recipe.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    ) : (
        <Redirect to="/signin" />
    );
};

export default RecipesPage;