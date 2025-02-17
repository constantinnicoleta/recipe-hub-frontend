import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import { Container, Card, Row, Col } from "react-bootstrap";
import styles from "../styles/CategoryDetailPage.module.css";

const CategoryDetailPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchCategoryAndRecipes = async () => {
            try {
                const categoryResponse = await axiosReq.get(`/api/categories/${id}/`);
                setCategory(categoryResponse.data);

                const recipesResponse = await axiosReq.get(`/api/recipes/?category_name=${categoryResponse.data.name}`);
                setRecipes(recipesResponse.data);
            } catch (error) {
                console.error("Error fetching category or recipes:", error);
            }
        };

        fetchCategoryAndRecipes();
    }, [id]);

    return (
        <Container className={styles.centeredContainer}>
            {category ? <h1 className={styles.pageTitle}>{category.name} Recipes</h1> : <p>Loading category...</p>}

            <Row className={styles.recipesContainer}>
                {recipes.length === 0 ? (
                    <p>No recipes found in this category.</p>
                ) : (
                    recipes.map((recipe) => (
                        <Col key={recipe.id} md={6} lg={4} className="mb-4">
                            <Card className={styles.recipeCard}>
                                <Card.Body>
                                    <Card.Title className={styles.recipeTitle}>{recipe.title}</Card.Title>
                                    <Card.Text className={styles.recipeDescription}>{recipe.description}</Card.Text>
                                    <Link to={`/recipes/${recipe.id}`} className={styles.recipeLink}>
                                        View Recipe
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default CategoryDetailPage;