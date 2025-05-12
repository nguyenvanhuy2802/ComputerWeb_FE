import axios from "axios";
import {axiosInstance} from "./axiosInstance";

export const getAverageRatingByProductId = async (productId: number): Promise<number> => {
    const response = await axiosInstance.get(`/reviews/product/${productId}/average`);
    return response.data;
};

export const getReviewCountByProductId = async (productId: number): Promise<number> => {
    const response = await axiosInstance.get(`/reviews/product/${productId}`);
    return response.data.length;
}