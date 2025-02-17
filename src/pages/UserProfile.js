import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FollowButton from "../components/FollowButton";
import styles from "../styles/UserProfile.module.css";

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/users/${id}/`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.ProfileContainer}>
            <h1>{user.username}'s Profile</h1>
            <p>Email: {user.email}</p>
            <FollowButton userId={user.id} />
        </div>
    );
};

export default UserProfile;