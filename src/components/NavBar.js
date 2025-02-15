import { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const NavBar = () => {
    const { isAuthenticated, username, logout } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push("/signin");
    };

    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" />
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        <NavLink className={styles.NavLink} to="/">Home</NavLink>
                        <NavLink className={styles.NavLink} to="/recipes">Recipes</NavLink>
                        <NavLink className={styles.NavLink} to="/categories">Categories</NavLink>

                        {isAuthenticated ? (
                            <>
                                <span className={styles.NavLink}>Welcome, {username}</span>
                                <button className={styles.NavButton} onClick={handleLogout}>Logout</button>
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