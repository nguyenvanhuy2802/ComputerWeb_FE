import {axiosInstance} from "./axiosInstance";

export const saveCartItem = async (quantity: number, cartId: number, productId: number) => {
    const response = await axiosInstance.post(`/cart-items/cart/${cartId}/product/${productId}?quantity=${quantity}`);
    return response.data;
};

export const countCartItems = async (cartId: number) => {
    const response = await axiosInstance.get(`/cart-items/cart/${cartId}/count`);
    return response.data;
};

export const getCartItemsByCartId = async (cartId: number) => {
    const response = await axiosInstance.get(`/cart-items/cart/${cartId}`);
    return response.data;
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
    const response = await axiosInstance.put(`/cart-items/${cartItemId}?quantity=${quantity}`);
    return response.data;
};

export const deleteCartItem = async (cartItemId: number) => {
    const response = await axiosInstance.delete(`/cart-items/${cartItemId}`);
    return response.data;
};

