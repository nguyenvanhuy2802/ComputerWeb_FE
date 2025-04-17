import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để tự động đính kèm token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    const excludeAuthPaths = [
        "/auth/login",
        "/auth/register",
        "/auth/upload-imgur"
    ];

    const shouldExclude = excludeAuthPaths.some(path => config.url?.includes(path));
    if (token && !shouldExclude) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

