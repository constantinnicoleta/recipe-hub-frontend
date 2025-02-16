import React from "react";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
    const currentUser = useAuth();

    return (
        <div>
            <h1>Welcome to Your Dashboard!</h1>
            {currentUser ? <h2>Hello, {currentUser.username}!</h2> : <p>You are not logged in.</p>}
        </div>
    );
};

export default DashboardPage;