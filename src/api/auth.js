import { axiosReq } from "./axiosDefaults";

/* Handles user signup by sending registration data to the API. */
export const signupUser = async (signupData) => {
    const response = await axiosReq.post("/auth/registration/", signupData);
    return response.data;
};

/* Handles user login by sending credentials to the API. */
export const loginUser = async (loginData) => {
    const response = await axiosReq.post("/auth/login/", loginData);
    return response.data;
};

/* Logs out the user by making a logout request to the API. */
export const logoutUser = async () => {
    await axiosReq.post("/auth/logout/");
};

/* Checks the user's authentication status by making a request to the API. */
export const checkUserStatus = async () => {
    try {
        const response = await axiosReq.get("/auth/user-status/", {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user status:", error);
        return { is_logged_in: false };
    }
};