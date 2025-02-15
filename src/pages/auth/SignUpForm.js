import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { signupUser } from "../../api/auth";
import { Alert, Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const SignUpForm = () => {
    const [signupData, setSignupData] = useState({
        username: "",
        password1: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const history = useHistory();

    const handleChange = (event) => {
        setSignupData({
            ...signupData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            await signupUser(signupData);
            console.log("Signup successful!");
            setSuccessMessage("Signup successful! Redirecting you to login...");

            setTimeout(() => {
                history.push("/signin");
            }, 3000);
        } catch (err) {
            console.error("Signup failed:", err.response?.data || err.message);
            if (err.response && err.response.data) {
                setError(Object.values(err.response.data).join(" "));
            } else {
                setError("Signup failed. Please try again.");
            }
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto py-2 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4`}>
                    <h1 className={styles.Header}>Sign up</h1>

                    {}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={signupData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password1">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="Password"
                                name="password1"
                                value={signupData.password1}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password2">
                            <Form.Label className="d-none">Confirm Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="Confirm Password"
                                name="password2"
                                value={signupData.password2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button 
                            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                            disabled={successMessage}
                        >
                            Sign Up
                        </Button>
                    </Form>
                </Container>

                <Container className={`mt-3 ${appStyles.Content}`}>
                    <p className={styles.Text}>
                        Already have an account? <a href="/signin">Sign in</a>
                    </p>
                </Container>
            </Col>

            {}
            <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}>
                <Image
                    className={`${appStyles.FillerImage}`}
                    src="https://res.cloudinary.com/dwbt48jtf/image/upload/v1734136495/pexels-69816215-8365696_rtvmh2.jpg"
                    alt="Signup Visual"
                />
            </Col>
        </Row>
    );
};

export default SignUpForm;