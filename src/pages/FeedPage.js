import React, { useEffect, useState } from "react";
import { axiosRes } from "../api/axiosDefaults";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import styles from "../styles/FeedPage.module.css";
import { useAuth } from "../context/AuthContext";

const FeedPage = () => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = useAuth();

    useEffect(() => {
        if (!auth) {
            setError("You must be logged in to view your feed.");
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchFeed = async () => {
            try {
                const response = await axiosRes.get("/api/feed/");
                if (isMounted) {
                    setFeed(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching feed:", error);
                if (isMounted) {
                    setError("Failed to load feed.");
                    setLoading(false);
                }
            }
        };

        fetchFeed();

        return () => {
            isMounted = false;
        };
    }, [auth]);

    if (error) {
        return (
            <Container className={styles.FeedContainer}>
                <h1 className={styles.pageTitle}>Your Feed</h1>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className={styles.FeedContainer}>
            <h1 className={styles.pageTitle}>Your Feed</h1>
            {loading ? (
                <div className={styles.Loader}>
                    <Spinner animation="border" />
                </div>
            ) : feed.length === 0 ? (
                <p className={styles.Message}>No activity yet. Follow users to see updates!</p>
            ) : (
                feed.map((item, index) => (
                    <Card key={index} className={styles.FeedCard}>
                        <Card.Body>
                            {item.type === "recipe" && (
                                <>
                                    <strong>{item.data.author}</strong> posted a new recipe:{" "}
                                    <a href={`/recipes/${item.data.id}`} className={styles.RecipeLink}>
                                        {item.data.title}
                                    </a>
                                </>
                            )}
                            {item.type === "like" && (
                                <>
                                    <strong>{item.data.author}</strong> liked a recipe.
                                </>
                            )}
                            {item.type === "comment" && (
                                <>
                                    <strong>{item.data.author}</strong> commented:{" "}
                                    <em>"{item.data.content}"</em>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default FeedPage;