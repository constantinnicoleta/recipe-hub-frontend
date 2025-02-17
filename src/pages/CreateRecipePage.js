import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import styles from "../styles/EditRecipePage.module.css";

/* 
   CreateRecipePage allows authenticated users to create new recipes.
   It fetches available categories and submits the recipe data to the API.
*/
const CreateRecipePage = () => {
    const currentUser = useAuth(); // Retrieves the authenticated user
    const history = useHistory();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        category: "",
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    /* Redirects unauthenticated users to the sign-in page. */
    useEffect(() => {
        if (!currentUser) {
            history.push("/signin");
        }
    }, [currentUser, history]);

    /* Fetches recipe categories from the API. */
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

    /* Updates form state as the user inputs data. */
    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name === "category") {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    /* Submits the recipe form to the API and handles success or error messages. */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
    
        try {
            const formDataToSend = {
                ...formData,
                category: parseInt(formData.category),
            };
    
            await axiosReq.post("/api/recipes/", formDataToSend);
            setSuccessMessage("Recipe created successfully!");
            setTimeout(() => history.push("/recipes"), 2000);
        } catch (error) {
            setError("Failed to create recipe. Please check your inputs.");
        }
    };

    return (
        <Container className={styles.centeredContainer}> 
            <Card className={styles.editCard}> 
                <Card.Body>
                    <h2 className={styles.title}>Create New Recipe</h2>
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

                        {/* Category Selection */}
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

                        <Button type="submit" className={styles.updateButton}>
                            Create Recipe
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateRecipePage;