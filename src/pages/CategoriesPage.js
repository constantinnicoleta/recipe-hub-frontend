import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { Link } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import styles from "../styles/CategoriesPage.module.css";

/* 
   CategoriesPage fetches and displays all recipe categories, 
   allowing users to navigate to category-specific recipes.
*/
const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);

    /* Fetches categories from the API on component mount. */
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

    return (
        <Container className={styles.centeredContainer}>
            <h1 className={styles.pageTitle}>Recipe Categories</h1>
            <Row className={styles.categoriesContainer}>
                {categories.length === 0 ? (
                    <p>No categories available.</p>
                ) : (
                    categories.map((category) => (
                        <Col key={category.id} md={6} lg={4} className="mb-4">
                            <Card className={styles.categoryCard}>
                                <Card.Body>
                                    <Card.Title className={styles.categoryTitle}>{category.name}</Card.Title>
                                    <Link to={`/categories/${category.id}`} className={styles.categoryLink}>
                                        View Recipes
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default CategoriesPage;