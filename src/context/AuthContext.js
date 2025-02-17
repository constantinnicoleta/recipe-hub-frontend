import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();
const SetAuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const useSetAuth = () => useContext(SetAuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Function to log out user and clear localStorage
    const logoutUser = useCallback(() => {
        setAuth(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    }, []);

    // Function to refresh token and check user authentication
    const refreshToken = useCallback(async () => {
        const refresh = localStorage.getItem("refresh_token");

        if (!refresh) {
            logoutUser();
            return;
        }

        try {
            const { data } = await axios.post("/auth/token/refresh/", { refresh });

            localStorage.setItem("access_token", data.access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

            const userResponse = await axios.get("/auth/user/", {
                headers: { Authorization: `Bearer ${data.access}` },
            });

            setAuth(userResponse.data);
            localStorage.setItem("user", JSON.stringify(userResponse.data));

        } catch (error) {
            console.error("Token refresh failed:", error);
            logoutUser();
        }
    }, [logoutUser]);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            refreshToken();
        }
    }, [refreshToken]);

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