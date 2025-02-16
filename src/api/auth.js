import { axiosReq } from "./axiosDefaults";

export const signupUser = async (signupData) => {
    const response = await axiosReq.post("/auth/registration/", signupData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await axiosReq.post("/auth/login/", loginData);
    return response.data;
};

export const logoutUser = async () => {
    await axiosReq.post("/auth/logout/");
};

export const checkUserStatus = async () => {
    try {
        const response = await axiosReq.get("/auth/user-status/", {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(" Error fetching user status:", error);
        return { is_logged_in: false };
    }
};