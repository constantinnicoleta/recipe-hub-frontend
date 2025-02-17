import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Get the stored token from localStorage
const accessToken = localStorage.getItem("access_token");

// Attach token to all requests
if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export const axiosReq = axios.create();
export const axiosRes = axios.create();