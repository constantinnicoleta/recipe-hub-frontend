import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Form } from "react-bootstrap";
import FollowButton from "../components/FollowButton";
import styles from "../styles/UsersListPage.module.css";

/* 
   UsersListPage fetches and displays a list of users with a search functionality.
   Users can be searched by username, and each user has a follow button.
*/
const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    /* Fetches the list of users from the API on component mount. */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("/api/users/");
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);

    /* Filters users based on the search input. */
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container className={styles.UsersContainer}>
            <h1 className={styles.pageTitle}>Find Users to Follow</h1>

            {/* Search bar to filter users */}
            <Form.Control
                type="text"
                placeholder="Search users..."
                className={styles.SearchBar}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
                <div className={styles.Loader}>
                    <Spinner animation="border" />
                </div>
            ) : (
                filteredUsers.map((user) => (
                    <Card key={user.id} className={styles.UserCard}>
                        <Card.Body>
                            <div className={styles.UserInfo}>
                                <strong>{user.username}</strong>
                                <FollowButton userId={user.id} />
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default UsersListPage;