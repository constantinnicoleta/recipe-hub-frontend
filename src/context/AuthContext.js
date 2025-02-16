import { createContext, useContext, useState, useEffect } from "react";
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

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const refresh = localStorage.getItem("refresh_token");
                if (!refresh) return;

                const { data } = await axios.post("/auth/token/refresh/", { refresh });


                localStorage.setItem("access_token", data.access);
                axios.defaults.headers["Authorization"] = `Bearer ${data.access}`;

                const userResponse = await axios.get("/auth/user/", {
                    headers: { Authorization: `Bearer ${data.access}` },
                });

                setAuth(userResponse.data);
                localStorage.setItem("user", JSON.stringify(userResponse.data));

            } catch (error) {
                console.error("Token refresh failed:", error);
                setAuth(null);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
            }
        };

        refreshToken();
    }, []);

    return (
        <AuthContext.Provider value={auth}>
            <SetAuthContext.Provider value={setAuth}>
                {children}
            </SetAuthContext.Provider>
        </AuthContext.Provider>
    );
};