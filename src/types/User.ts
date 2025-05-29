export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData{
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    password: string;
    confirmPassword?: string;
    profileImage: string;
}
export type Role = "ADMIN" | "CUSTOMER";

export type User = {
    userId: number;
    name: string;
    email: string;
    username: string;
    role: Role;
    phone?: string;
    address?: string;
    profileImage?: string;
    createdAt?: string;
};
export interface CreateUserData {
    name: string;
    email: string;
    username: string;
    role: Role;
    phone?: string;
    address?: string;
    profileImage?: string;
    password: string;
}