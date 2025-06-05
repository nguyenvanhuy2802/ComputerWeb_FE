import {axiosInstance} from "./axiosInstance";
import {Review} from "../types/Review";

export const getAverageRatingByProductId = async (productId: number): Promise<number> => {
    const response = await axiosInstance.get(`/reviews/product/${productId}/average`);
    return response.data;
};

export const getReviewCountByProductId = async (productId: number): Promise<number> => {
    const response = await axiosInstance.get(`/reviews/product/${productId}`);
    return response.data.length;
}

export const getReviewsByProductId = async (productId: number) => {
    const response = await axiosInstance.get(`/reviews/product/${productId}`);
    return response.data;
}

export const createReview = async (data: ReviewDTO) => {
    const response = await axiosInstance.post("/reviews", data);
    return response.data;
}
