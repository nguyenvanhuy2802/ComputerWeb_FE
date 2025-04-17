import {axiosInstance} from "./axiosInstance";

export const uploadFile = async (file: FormData) => {
    const response = await axiosInstance.post("/auth/upload-imgur", file, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return response.data;
};

export const uploadAvatar = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("image", file);
    const result = await uploadFile(data);
    return result.link;
};
