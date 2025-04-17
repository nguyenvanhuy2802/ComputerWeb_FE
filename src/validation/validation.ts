import {LoginData, RegisterData} from "../types/User";

export interface ValidationErrors {
    [key: string]: string;
}

export function validateRegisterData(formData: RegisterData, avatarFile: File | null): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name) errors.name = "Vui lòng nhập họ tên.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = "Email không hợp lệ.";

    const phoneRegex = /^[0-9]{9,12}$/;
    if (!phoneRegex.test(formData.phone)) errors.phone = "Số điện thoại không hợp lệ.";

    if (!formData.address) errors.address = "Vui lòng nhập địa chỉ.";

    if (!formData.username) errors.username = "Vui lòng nhập username.";

    if (formData.password.length < 6) errors.password = "Mật khẩu ít nhất 6 ký tự.";

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Mật khẩu không khớp.";
    }

    if (!avatarFile) {
        errors.avatar = "Vui lòng chọn ảnh đại diện.";
    } else if (!avatarFile.type.startsWith("image/")) {
        errors.avatar = "Tệp đại diện phải là hình ảnh (jpg, png, v.v.).";
    }
    return errors;
}

export function validateLoginData(formData: LoginData): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.username) errors.name = "Vui lòng nhập tài khoản.";
    if (formData.password.length < 6) errors.password = "Mật khẩu ít nhất 6 ký tự.";

    return errors;
}
