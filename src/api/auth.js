import axiosInstance from "./axiosDefaults";

export const signupUser = async (signupData) => {
    const response = await axiosInstance.post("/auth/registration/", signupData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await axiosInstance.post("/auth/login/", loginData);
    return response.data;
};


export const logoutUser = async () => {
    await axiosInstance.post("/auth/logout/");
};

export const checkUserStatus = async () => {
    const response = await axiosInstance.get("/auth/user-status/");
    return response.data;
};