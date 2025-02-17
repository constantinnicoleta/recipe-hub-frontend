import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import styles from "../styles/CategoryDetailPage.module.css";

/* 
   CategoryDetailPage fetches and displays all recipes within a specific category.
   It retrieves category details and associated recipes using the category ID.
*/
const CategoryDetailPage = () => {
    const { id } = useParams(); // Extracts category ID from URL
    const [recipes, setRecipes] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    /* Fetches category details and recipes when the component mounts. */
    useEffect(() => {
        let isMounted = true;

        const fetchCategoryDetails = async () => {
            try {
                const categoryResponse = await axiosReq.get(`api/categories/${id}/`);
                if (isMounted) setCategoryName(categoryResponse.data.name);

                const recipeResponse = await axiosReq.get(`api/recipes/?category=${id}`);
                if (isMounted) setRecipes(recipeResponse.data);
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching category details:", error);
                    setError("Failed to load category.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCategoryDetails();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <Container className={styles.centeredContainer}>
                <h1 className={styles.pageTitle}>Loading...</h1>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className={styles.centeredContainer}>
                <h1 className={styles.pageTitle}>{error}</h1>
            </Container>
        );
    }

    return (
        <Container className={styles.centeredContainer}>
            <h1 className={styles.pageTitle}>{categoryName} Recipes</h1>

            {recipes.length === 0 ? (
                <p className={styles.noRecipesText}>No recipes found in this category.</p>
            ) : (
                <Row className={styles.recipesContainer}>
                    {recipes.map((recipe) => (
                        <Col key={recipe.id} md={6} lg={4} className="mb-4">
                            <Card className={styles.recipeCard}>
                                <Card.Body>
                                    <Card.Title className={styles.recipeTitle}>{recipe.title}</Card.Title>
                                    <Card.Text className={styles.recipeDescription}>{recipe.description}</Card.Text>

                                    <div className={styles.buttonGroup}>
                                        <Button as={Link} to={`/recipes/${recipe.id}`} className={styles.recipeButton}>
                                            View Recipe
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default CategoryDetailPage;