import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { useAuth, useSetAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";

/* 
   NavBar component provides navigation for the application, 
   including authentication-based links and logout functionality.
*/
const NavBar = () => {
    const currentUser = useAuth(); // Retrieves the authenticated user
    const setCurrentUser = useSetAuth(); // Function to update authentication state
    const history = useHistory();
    const [expanded, setExpanded] = useState(false);

    /* Handles user logout by clearing authentication data and redirecting to sign-in. */
    const handleLogout = async () => {
        setCurrentUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        history.push("/signin");
        setExpanded(false);
    };

    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top" expanded={expanded}>
            <Container className={styles.NavContainer}>
                {/* Logo Link */}
                <NavLink to="/" className={styles.NavLogoContainer}>
                    <Navbar.Brand>
                        <img src={logo} alt="Recipe Hub" className={styles.NavLogo} />
                    </Navbar.Brand>
                </NavLink>

                {/* Mobile Navigation Toggle */}
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                    className={styles.NavToggle}
                />

                {/* Navigation Links */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={styles.NavItems} onClick={() => setExpanded(false)}>
                        <NavLink className={styles.NavLink} to="/">Feed</NavLink>
                        {currentUser && <NavLink className={styles.NavLink} to="/recipes">Recipes</NavLink>}
                        <NavLink className={styles.NavLink} to="/categories">Categories</NavLink>

                        {currentUser ? (
                            <>
                                <NavLink className={styles.NavLink} to="/users">Find Users</NavLink>
                                <span className={styles.NavLink}>
                                    Welcome, {currentUser.username || "User"}
                                </span>
                                <button className={styles.NavButton} onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>   
                                <NavLink className={styles.NavLink} to="/signin">Sign in</NavLink>
                                <NavLink className={styles.NavLink} to="/signup">Sign up</NavLink>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;