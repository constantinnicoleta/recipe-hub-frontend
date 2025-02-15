import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1];

        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;