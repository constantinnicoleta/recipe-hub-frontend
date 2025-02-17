import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { useAuth, useSetAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
    const currentUser = useAuth();
    const setCurrentUser = useSetAuth();
    const history = useHistory();
    const [expanded, setExpanded] = useState(false); // State to control navbar toggle

    const handleLogout = async () => {
        setCurrentUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        history.push("/signin");
        setExpanded(false); // Close menu after logout
    };

    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top" expanded={expanded}>
            <Container className={styles.NavContainer}>
                {/* Logo */}
                <NavLink to="/" className={styles.NavLogoContainer}>
                    <Navbar.Brand>
                        <img src={logo} alt="Recipe Hub" className={styles.NavLogo} />
                    </Navbar.Brand>
                </NavLink>

                {/* Toggle Button (Hamburger Menu) */}
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                    className={styles.NavToggle}
                />

                {/* Collapsible Menu */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={styles.NavItems} onClick={() => setExpanded(false)}>
                        <NavLink className={styles.NavLink} to="/">Home</NavLink>
                        <NavLink className={styles.NavLink} to="/recipes">Recipes</NavLink>
                        <NavLink className={styles.NavLink} to="/categories">Categories</NavLink>

                        {currentUser ? (
                            <>
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