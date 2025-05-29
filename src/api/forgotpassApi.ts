
import { axiosInstance } from "./axiosInstance";

export interface SendOtpRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    tempToken: string;  // token trả về sau khi verifyOtp thành công
    newPassword: string;

}

// Gửi yêu cầu gửi OTP về email
export const sendOtp = async (data: SendOtpRequest) => {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
};

// Gửi OTP để xác thực
export const verifyOtp = async (data: VerifyOtpRequest): Promise<{ tempToken: string }> => {
    const response = await axiosInstance.post("/auth/verify-otp", data);
    return response.data;
};

// Đổi mật khẩu mới
export const resetPassword = async (data: ResetPasswordRequest) => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
};
