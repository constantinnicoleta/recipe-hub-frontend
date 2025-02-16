import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import styles from "../styles/RecipesPage.module.css";

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axiosReq.get("api/recipes/");
                setRecipes(response.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <Container className={styles.centeredContainer}>
            <h1 className={styles.pageTitle}>All Recipes</h1>

            <div className={styles.buttonContainer}>
                <Link to="/recipes/create">
                    <Button variant="success">Create New Recipe</Button>
                </Link>
            </div>

            {recipes.length === 0 ? (
                <p className={styles.noRecipesText}>No recipes found.</p>
            ) : (
                <Row>
                    {recipes.map((recipe) => (
                        <Col key={recipe.id} md={4} className="mb-4">
                            <Card className={styles.recipeCard}>
                                {recipe.image && <Card.Img variant="top" src={recipe.image} alt={recipe.title} />}
                                <Card.Body>
                                    <Card.Title>{recipe.title}</Card.Title>
                                    <Card.Text>{recipe.description}</Card.Text>
                                    <Link to={`/recipes/${recipe.id}`}>
                                        <Button variant="primary">View Recipe</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default RecipesPage;