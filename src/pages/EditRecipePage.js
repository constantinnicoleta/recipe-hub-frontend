import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import styles from "../styles/EditRecipePage.module.css";

const EditRecipePage = () => {
    const { id } = useParams();
    const history = useHistory();
    const currentUser = useAuth();
    const [categories, setCategories] = useState([]); // ✅ Fetch categories from backend

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        category: "",  // ✅ Store selected category ID
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);

    // ✅ Fetch available categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosReq.get("/api/categories/");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // ✅ Fetch recipe details
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axiosReq.get(`/api/recipes/${id}/`);
                setFormData({
                    title: response.data.title || "",
                    description: response.data.description || "",
                    ingredients: response.data.ingredients || "",
                    instructions: response.data.instructions || "",
                    category: response.data.category || "",  // ✅ Store category ID
                });
                setIsAuthor(response.data.author === currentUser?.username);
            } catch (error) {
                setError("Recipe not found or you do not have permission to edit.");
            }
        };

        fetchRecipe();
    }, [id, currentUser]);

    // ✅ Handle form changes
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!isAuthor) {
            setError("You do not have permission to edit this recipe.");
            return;
        }

        try {
            await axiosReq.patch(`/api/recipes/${id}/`, formData);
            setSuccessMessage("Recipe updated successfully!");
            setTimeout(() => history.push(`/recipes/${id}`), 2000);
        } catch (error) {
            setError("Failed to update recipe. Please check your inputs.");
        }
    };

    return (
        <Container className={styles.centeredContainer}>
            <Card className={styles.editCard}>
                <Card.Body>
                    <h2 className={styles.title}>Edit Recipe</h2>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className={styles.formGroup}>
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className={styles.formGroup}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className={styles.formGroup}>
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                name="ingredients" 
                                value={formData.ingredients} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className={styles.formGroup}>
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                name="instructions" 
                                value={formData.instructions} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        {/* ✅ Category Dropdown */}
                        <Form.Group className={styles.formGroup}>
                            <Form.Label>Category</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button type="submit" className={styles.updateButton} disabled={!isAuthor}>
                            Update Recipe
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditRecipePage;