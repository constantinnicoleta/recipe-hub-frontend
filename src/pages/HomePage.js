import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const currentUser = useAuth();
    const history = useHistory();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {currentUser ? (
                <h1>You are logged in. 🎉</h1>
            ) : (
                <>
                    <h1>Welcome to Recipe Hub! 🍽️</h1>
                    <p>Discover and share amazing recipes!</p>
                    <button onClick={() => history.push("/signin")}>Log In</button>
                    <button onClick={() => history.push("/signup")}>Sign Up</button>
                </>
            )}
        </div>
    );
};

export default HomePage;