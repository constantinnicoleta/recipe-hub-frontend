import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../api/auth";
import AuthContext from "../../context/AuthContext";
import { Alert, Form, Button, Container } from "react-bootstrap";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await loginUser(formData);
            login(response.key, formData.username);
            history.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Container className="mt-5">
            <h2>Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Button type="submit" className="mt-3">Login</Button>
            </Form>
        </Container>
    );
};

export default LoginForm;