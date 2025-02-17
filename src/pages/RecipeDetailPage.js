import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Button } from "react-bootstrap";
import styles from "../styles/RecipeDetailPage.module.css";

const RecipeDetailPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const currentUser = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axiosReq.get(`api/recipes/${id}/`);
                setRecipe(response.data);
            } catch (error) {
                setError("Recipe not found.");
            }
        };

        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        try {
            await axiosReq.delete(`api/recipes/${id}/`);
            alert("Recipe deleted successfully!");
            history.push("/recipes");
        } catch (error) {
            setError("Failed to delete recipe.");
        }
    };

    if (error) return <p className="text-danger">{error}</p>;
    if (!recipe) return <p>Loading...</p>;

    const isAuthor = currentUser &&
        recipe.author &&
        (currentUser.username === recipe.author.username || currentUser.username === recipe.author);

    return (
        <Container className={styles.centeredContainer}>
            <Card className={styles.recipeCard}>
                <Card.Body>
                    <Card.Title className={styles.recipeTitle}>{recipe.title}</Card.Title>
                    <Card.Text><strong>Description:</strong> {recipe.description}</Card.Text>
                    <Card.Text><strong>Ingredients:</strong> {recipe.ingredients}</Card.Text>
                    <Card.Text><strong>Instructions:</strong> {recipe.instructions}</Card.Text>
                    <Card.Text><strong>Category:</strong> {recipe.category_name || "Uncategorized"}</Card.Text>
                    <Card.Text><strong>Author:</strong> {recipe.author ? recipe.author.username || recipe.author : "Unknown"}</Card.Text>
                    <Card.Text><strong>Created At:</strong> {new Date(recipe.created_at).toLocaleDateString()}</Card.Text>
                    <Card.Text><strong>Last Updated:</strong> {new Date(recipe.updated_at).toLocaleDateString()}</Card.Text>

                    {isAuthor && (
                        <div className={styles.buttonGroup}>
                            <Button className={styles.detailButton} onClick={() => history.push(`/recipes/${id}/edit`)}>Edit</Button>
                            <Button className={styles.detailButton} onClick={handleDelete}>Delete</Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RecipeDetailPage;
