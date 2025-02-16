import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Container, Alert } from "react-bootstrap";

const EditRecipePage = () => {
    const { id } = useParams();
    const history = useHistory();
    const currentUser = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        category: "",
        image: null,
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axiosReq.get(`api/recipes/${id}/`);
                setFormData(response.data);
                setIsAuthor(response.data.author === currentUser?.username);
            } catch (error) {
                setError("Recipe not found or you do not have permission to edit.");
            }
        };

        fetchRecipe();
    }, [id, currentUser]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!isAuthor) {
            setError("You do not have permission to edit this recipe.");
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await axiosReq.patch(`/recipes/${id}/`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage("Recipe updated successfully!");
            setTimeout(() => history.push(`/recipes/${id}`), 2000);
        } catch (error) {
            setError("Failed to update recipe. Please check your inputs.");
        }
    };

    return (
        <Container className="mt-4">
            <h1>Edit Recipe</h1>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>

                <Button type="submit" className="mt-3" disabled={!isAuthor}>Update Recipe</Button>
            </Form>
        </Container>
    );
};

export default EditRecipePage;