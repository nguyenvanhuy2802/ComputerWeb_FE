import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { createUser } from "../../../api/userApi";
import {CreateUserData, User} from "../../../types/User";
import { useNavigate } from "react-router-dom";
import { validateAddUserData, ValidationErrors } from "../../../validation/validation";

const roles = [
    { value: "ADMIN", label: "ADMIN" },
    { value: "CUSTOMER", label: "CUSTOMER" },
];

interface FormData extends Omit<User, "userId" | "createdAt"> {
    password: string;
    confirmPassword: string;
}

const AddUserPage: React.FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // State form
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        username: "",
        role: "CUSTOMER", // chú ý trùng với roles.value
        phone: "",
        address: "",
        profileImage: "",
        password: "",
        confirmPassword: "",
    });

    // State lỗi validate
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Xử lý input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateAddUserData(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            enqueueSnackbar("Vui lòng sửa các lỗi trước khi gửi.", { variant: "warning" });
            return;
        }

        try {
            // Gửi data (bỏ confirmPassword)
            const submitData: CreateUserData = {
                name: formData.name,
                email: formData.email,
                username: formData.username,
                role: formData.role,
                password:formData.password,
                phone: formData.phone,
                address: formData.address,
                profileImage: formData.profileImage,
            };

            await createUser(submitData);
            enqueueSnackbar("Thêm user thành công!", { variant: "success" });
            navigate("/admin/users");
        } catch (error: any) {
            enqueueSnackbar("Lỗi khi tạo user: " + error?.response?.data?.message, { variant: "error" });
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 700,
                mx: "auto",
                mt: 4,
                p: 3,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            component={Paper}
        >
            <Typography variant="h5" component="h1" mb={2}>
                Thêm người dùng mới
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <TextField
                    label="Họ tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    required
                    fullWidth
                />
                <TextField
                    label="Tên đăng nhập"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                    required
                    fullWidth
                />
                <TextField
                    select
                    label="Vai trò"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    error={Boolean(errors.role)}
                    helperText={errors.role}
                    required
                    fullWidth
                >
                    {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                    fullWidth
                />
                <TextField
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={Boolean(errors.address)}
                    helperText={errors.address}
                    fullWidth
                    multiline
                    rows={2}
                />
                <TextField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    required
                    fullWidth
                />
                <TextField
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                    required
                    fullWidth
                />
                <TextField
                    label="URL ảnh đại diện"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    fullWidth
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Thêm user
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddUserPage;
