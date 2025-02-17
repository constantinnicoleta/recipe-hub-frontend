import React, { useEffect, useState } from "react";
import { axiosRes } from "../api/axiosDefaults";
import { Container, Card, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/FeedPage.module.css";

const FeedPage = () => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = useAuth();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const { data } = await axiosRes.get("/api/feed/");
                setFeed(data.length ? data : []);
            } catch (error) {
                console.error("Error fetching feed:", error);
                setFeed([]);
            }
            setLoading(false);
        };

        if (currentUser) {
            fetchFeed();
        }
    }, [currentUser]);

    if (!currentUser) {
        return <p className={styles.Message}>Please log in to view your feed.</p>;
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
                                    <em>{item.data.title}</em>
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
                            {item.type === "follow" && (
                                <>
                                    <strong>{item.data.author}</strong> followed{" "}
                                    <em>{item.data.followed_name}</em>
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