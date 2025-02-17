import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { signupUser } from "../../api/auth";
import { Alert, Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";

/* 
   SignUpForm handles user registration, submits signup data to the API, 
   and redirects to the login page upon success.
*/
const SignUpForm = () => {
    const [signupData, setSignupData] = useState({
        username: "",
        password1: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const history = useHistory();

    /* Updates form state as the user inputs data. */
    const handleChange = (event) => {
        setSignupData({
            ...signupData,
            [event.target.name]: event.target.value,
        });
    };

    /* Submits the signup form, handles API response, and manages errors. */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            await signupUser(signupData);
            console.log("Signup successful!");
            setSuccessMessage("Signup successful! Redirecting to login...");

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
        <Container className={styles.FullHeightContainer}>
            <Row className={styles.SignUpRow}>
                {/* Signup Form Column */}
                <Col xs={12} sm={8} md={6} lg={5} className={styles.FormColumn}>
                    <h1 className={styles.Header}>Sign up</h1>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
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
                            <Form.Label>Password</Form.Label>
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
                            <Form.Label>Confirm Password</Form.Label>
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
                            className={`w-100 mt-3 ${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                            disabled={successMessage}
                        >
                            Sign Up
                        </Button>
                    </Form>

                    <div className="mt-3 text-center">
                        <p className={styles.Text}>
                            Already have an account? <a href="/signin">Sign in</a>
                        </p>
                    </div>
                </Col>

                {/* Visual Placeholder Column */}
                <Col md={6} lg={5} className="d-none d-md-flex justify-content-center">
                    <Image
                        className={`img-fluid ${styles.FillerImage}`}
                        src="https://res.cloudinary.com/dwbt48jtf/image/upload/v1734136495/pexels-69816215-8365696_rtvmh2.jpg"
                        alt="Signup Visual"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default SignUpForm;