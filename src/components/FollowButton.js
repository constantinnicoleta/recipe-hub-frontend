import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Button.module.css";

/* FollowButton component allows authenticated users to follow or unfollow another user. */
const FollowButton = ({ userId }) => {
    const currentUser = useAuth(); // Retrieves the authenticated user
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        /* Checks if the current user is already following the given user. */
        const checkFollowingStatus = async () => {
            if (!currentUser) return;

            try {
                console.log("Checking follow status for user:", userId);
                const { data } = await axios.get(`/api/users/${userId}/is-following/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                console.log("Follow status response:", data);
                setIsFollowing(data.is_following);
            } catch (error) {
                console.error("Error checking follow status:", error.response?.data || error.message);
            }
        };

        checkFollowingStatus();
    }, [userId, currentUser]);

    /* Toggles follow/unfollow state by sending a request to the API. */
    const toggleFollow = async () => {
        if (!currentUser) {
            alert("You need to be logged in to follow users!");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending follow/unfollow request for user:", userId);
            await axios.post(
                `/api/users/${userId}/follow/`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
            );
            setIsFollowing((prev) => !prev);
            console.log("Follow/unfollow successful.");
        } catch (error) {
            console.error("Error following/unfollowing user:", error.response?.data || error.message);
        }
        setLoading(false);
    };

    return (
        <Button
            className={styles.Button}
            variant={isFollowing ? "danger" : "primary"}
            onClick={toggleFollow}
            disabled={loading}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
};

export default FollowButton;