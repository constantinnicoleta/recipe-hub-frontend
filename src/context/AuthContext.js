import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();
const SetAuthContext = createContext();

export const useAuth = () => useContext(AuthContext); // Provides user authentication state
export const useSetAuth = () => useContext(SetAuthContext); // Provides function to update auth state

/* 
   AuthProvider manages authentication state, token refresh, 
   and user session persistence using localStorage.
*/
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    /* Logs out the user by clearing authentication data and refreshing the page. */
    const logoutUser = useCallback(() => {
        setAuth(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        axios.defaults.headers.common["Authorization"] = null;
        window.location.reload();
    }, []);

    /* Refreshes the access token using the stored refresh token. */
    const refreshToken = useCallback(async () => {
        const refresh = localStorage.getItem("refresh_token");

        if (!refresh) {
            logoutUser();
            return;
        }

        try {
            const { data } = await axios.post("/auth/token/refresh/", { refresh });

            if (!data.access) {
                throw new Error("No access token returned");
            }

            localStorage.setItem("access_token", data.access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

            const userResponse = await axios.get("/auth/user/", {
                headers: { Authorization: `Bearer ${data.access}` },
            });

            if (!userResponse.data) {
                throw new Error("Invalid user data");
            }

            setAuth(userResponse.data);
            localStorage.setItem("user", JSON.stringify(userResponse.data));

        } catch (error) {
            console.error("Token refresh failed:", error);
            logoutUser();
        }
    }, [logoutUser]);

    /* Automatically refreshes token on mount if an access token exists but no auth state. */
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken && !auth) { 
            refreshToken();
        }
    }, [auth, refreshToken]);

    /* Attaches access token to outgoing requests if available. */
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={auth}>
            <SetAuthContext.Provider value={setAuth}>
                {children}
            </SetAuthContext.Provider>
        </AuthContext.Provider>
    );
};