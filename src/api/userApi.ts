
import { axiosInstance } from "./axiosInstance";
import {CreateUserData, User} from "../types/User";
import {GridRenderCellParams} from "@mui/x-data-grid";
import {OrderDTO, OrderStatus} from "../types/Order";
import {MenuItem, Select} from "@mui/material";
import React from "react";

export const getAllUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users");
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}/delete`);
};
export const getPagedUsers = async (
    limit: number,
    offset: number
): Promise<User[]> => {
    const response = await axiosInstance.get("/users/page", {
        params: { limit, offset },
    });
    return response.data;
};

export const getOrderedUsers = async (
    limit: number,
    offset: number,
    orderBy: string,
    orderDir: "asc" | "desc"
): Promise<User[]> => {
    const response = await axiosInstance.get("/users/sorted", {
        params: { limit, offset, orderBy, orderDir },
    });
    return response.data;
};
export const createUser = async (user: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post("/users", user);
    return response.data;
};
export const getUser = async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};
export const updateUser = async (id: string, data: Partial<User>): Promise<any> => {
    const response = await axiosInstance.put(`/users/${id}/update`, data);
    return response.data;
};

export const getCurrentUserId = async (): Promise<number> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
};

export const getUserById = async (id: number): Promise<number> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};

