import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

/* 
   RecipeDetailPage fetches and displays details of a specific recipe
   based on the recipe ID extracted from the URL parameters.
*/
const RecipeDetailPage = () => {
    let { recipeId } = useParams(); // Extracts recipe ID from URL

    console.log("Extracted Recipe ID:", recipeId); // Debugging log

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* Fetches recipe details from the API on component mount. */
    useEffect(() => {
        if (!recipeId) {
            setError("Invalid recipe ID.");
            setLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Authentication required.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`/api/recipes/${recipeId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Fetched recipe:", response.data);
                setRecipe(response.data);
            } catch (error) {
                console.error("Error fetching recipe:", error);
                setError("Failed to load recipe.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RecipeDetailPage;