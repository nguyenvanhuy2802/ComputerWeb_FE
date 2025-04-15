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