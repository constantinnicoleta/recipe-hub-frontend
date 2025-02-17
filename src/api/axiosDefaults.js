import axios from "axios";

const API = axios.create({
    baseURL: "https://recipe-hub-backend-project-3024dae0e274.herokuapp.com",
    withCredentials: true, 
});

axios.defaults.headers.post["Content-Type"] = "application/json"; // Ensures JSON is used for POST requests

const accessToken = localStorage.getItem("access_token"); // Retrieves stored access token

// If an access token exists, set it as the default Authorization header
if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export const axiosReq = axios.create(); // Axios instance for requests
export const axiosRes = axios.create(); // Axios instance for responses
export default API;
