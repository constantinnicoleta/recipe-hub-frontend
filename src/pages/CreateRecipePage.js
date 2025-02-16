import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Form, Button, Container, Alert } from "react-bootstrap";

const CreateRecipePage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const history = useHistory();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        image: null,
        category: "",
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!isAuthenticated) {
            setError("You must be logged in to create a recipe.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("ingredients", formData.ingredients);
        formDataToSend.append("instructions", formData.instructions);
        formDataToSend.append("category", formData.category);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            await axiosInstance.post("/recipes/", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage("Recipe created successfully!");
            setTimeout(() => history.push("/recipes"), 2000);
        } catch (error) {
            console.error("Error creating recipe:", error);
            setError("Failed to create recipe. Please check your inputs.");
        }
    };

    return (
        <Container className="mt-4">
            <h1>Create a Recipe</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Ingredients</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Instructions</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>

                <Button type="submit" className="mt-3">Create Recipe</Button>
            </Form>
        </Container>
    );
};

export default CreateRecipePage;