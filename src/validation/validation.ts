import {LoginData, RegisterData, User} from "../types/User";
import {ProductDTO} from "../types/Product";

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

export function validateAddUserData(formData: Omit<User, "userId" | "createdAt"> & { password: string; confirmPassword: string }): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name || formData.name.trim() === "") {
        errors.name = "Vui lòng nhập họ tên.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = "Email không hợp lệ.";
    }

    if (formData.phone && !/^[0-9]{9,12}$/.test(formData.phone)) {
        errors.phone = "Số điện thoại không hợp lệ.";
    }


    if (!formData.username || formData.username.trim() === "") {
        errors.username = "Vui lòng nhập username.";
    }

    if (!formData.role) {
        errors.role = "Vui lòng chọn vai trò.";
    }

    if (!formData.password || formData.password.length < 6) {
        errors.password = "Mật khẩu ít nhất 6 ký tự.";
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Mật khẩu không khớp.";
    }

    return errors;
}
export function validateEditUserData(formData: Omit<User, "userId" | "createdAt">): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name || formData.name.trim() === "") {
        errors.name = "Vui lòng nhập họ tên.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = "Email không hợp lệ.";
    }

    if (formData.phone && !/^[0-9]{9,12}$/.test(formData.phone)) {
        errors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!formData.username || formData.username.trim() === "") {
        errors.username = "Vui lòng nhập username.";
    }

    if (!formData.role) {
        errors.role = "Vui lòng chọn vai trò.";
    }

    return errors;
}
export function validateChangeInforUserData(formData: Omit<User, "userId" | "createdAt"|"role"|"username">): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name || formData.name.trim() === "") {
        errors.name = "Vui lòng nhập họ tên.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = "Email không hợp lệ.";
    }

    if (formData.phone && !/^[0-9]{9,12}$/.test(formData.phone)) {
        errors.phone = "Số điện thoại không hợp lệ.";
    }

    return errors;
}
export function validateProductData(formData: ProductDTO): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name || formData.name.trim() === "") {
        errors.name = "Vui lòng nhập tên sản phẩm.";
    }

    if (!formData.description || formData.description.trim() === "") {
        errors.description = "Vui lòng nhập mô tả sản phẩm.";
    }

    if (formData.price <= 0) {
        errors.price = "Giá sản phẩm phải lớn hơn 0.";
    }

    if (formData.stockQuantity < 1) {
        errors.stockQuantity = "Số lượng phải lớn hơn 0.";
    }

    if (!formData.categoryId || formData.categoryId <= 0) {
        errors.categoryId = "Vui lòng chọn danh mục.";
    }

    if (!formData.productImage) {
        errors.productImage = "Vui lòng tải ảnh sản phẩm.";
    }

    return errors;
}