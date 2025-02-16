import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink, useHistory } from "react-router-dom";
import { useAuth, useSetAuth } from "../context/AuthContext";

const NavBar = () => {
    const currentUser = useAuth();
    const setCurrentUser = useSetAuth();
    const history = useHistory();

    const handleLogout = async () => {
        setCurrentUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        history.push("/signin");
    };

    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container className={styles.NavContainer}>
                {}
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" />
                    </Navbar.Brand>
                </NavLink>

                {}
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-md-none" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    {}
                    <Nav className={styles.NavItems}>
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