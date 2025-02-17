import React, { useState } from "react";
import axios from "axios";
import { Form, Alert, Button, Col, Row, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useSetAuth } from "../../context/AuthContext";
import styles from "../../styles/SignInForm.module.css";


function LoginForm() {
    const setAuth = useSetAuth();
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const { username, password } = loginData;
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        try {
            const { data } = await axios.post("/auth/token/", loginData, {
                headers: { "Content-Type": "application/json" },
            });

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            axios.defaults.headers["Authorization"] = `Bearer ${data.access}`;

            const userResponse = await axios.get("/auth/user/", {
                headers: { Authorization: `Bearer ${data.access}` },
            });

            if (data.access) {
                setAuth(userResponse.data);
                history.push("/dashboard");
            }
        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    const handleChange = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    return (
        <Container fluid className={styles.FullHeightContainer}>
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={8} md={6} lg={4} className={styles.Content}>
                    <h1 className={styles.Header}>Sign In</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={username}
                                onChange={handleChange}
                                required
                                className={styles.Input}
                            />
                        </Form.Group>
                        {errors.username && <Alert variant="danger" className={styles.Alert}>{errors.username}</Alert>}

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                required
                                className={styles.Input}
                            />
                        </Form.Group>
                        {errors.password && <Alert variant="danger" className={styles.Alert}>{errors.password}</Alert>}

                        <Button type="submit" className={styles.Button}>
                            Sign in
                        </Button>
                    </Form>

                    {errors.non_field_errors && (
                        <Alert variant="danger" className={styles.Alert}>
                            {errors.non_field_errors}
                        </Alert>
                    )}

                    <div className="mt-3 text-center">
                        <Link to="/signup" className={styles.Link}>
                            Don't have an account? <span>Sign up now!</span>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;