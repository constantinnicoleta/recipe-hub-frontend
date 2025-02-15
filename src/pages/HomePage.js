import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {isAuthenticated ? (
        <h1> You are logged in. 🎉</h1>
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