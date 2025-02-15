import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>Welcome to Your Dashboard!</h1>
            {user ? <h2>Hello, {user.username}!</h2> : <p>You are not logged in.</p>}
        </div>
    );
};

export default DashboardPage;