import { createContext, useState, useEffect } from "react";
import { checkUserStatus, logoutUser } from "../api/auth";
import axiosInstance from "../api/axiosDefaults";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
          try {
            axiosInstance.defaults.withCredentials = true;
            const response = await checkUserStatus();
            console.log("User status response:", response);
      
            if (response.is_logged_in) {
              setIsAuthenticated(true);
              setUsername(response.user.username);
            } else {
              setIsAuthenticated(false);
              setUsername(null);
            }
          } catch (error) {
            console.error("Error checking user status:", error);
            setIsAuthenticated(false);
            setUsername(null);
          }
        };
      
        verifyUser();
    }, []);

    const login = (username) => {
        setIsAuthenticated(true);
        setUsername(username);
    };

    const logout = async () => {
        try {
            await logoutUser();
            setIsAuthenticated(false);
            setUsername(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;