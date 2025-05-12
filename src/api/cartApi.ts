import { axiosInstance } from "./axiosInstance";

export const saveCart = async ( customerId:number) => {
    const response = await axiosInstance.post(`/carts/customer/${customerId}`);
    return response.data;
};
