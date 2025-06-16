import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper
} from "@mui/material";
import { useSnackbar } from "notistack";
import { getUser, updateUser } from "../../../api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../../types/User";
import isEqual from "lodash/isEqual";
import { validateEditUserData, ValidationErrors } from "../../../validation/validation";
import {getUserRoleFromToken,getUsernameFromToken} from "../../../utils/jwtUtils";
import {uploadAvatar} from "../../../api/imageApi";

const roles = [
    { value: "ADMIN", label: "ADMIN" },
    { value: "CUSTOMER", label: "CUSTOMER" },
];

const EditUserPage: React.FC = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    const [originalData, setOriginalData] = useState<User | null>(null);
    const [formData, setFormData] = useState<Omit<User, "userId" | "createdAt">>({
        name: "",
        email: "",
        username: "",
        role: "CUSTOMER",
        phone: "",
        address: "",
        profileImage: "",
    });
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (id) {
            getUser(id)
                .then((data) => {
                    setOriginalData(data);
                    const { name, email, username, role, phone, address, profileImage } = data;
                    setFormData({ name, email, username, role, phone, address, profileImage });
                })
                .catch(() => {
                    enqueueSnackbar("Không tìm thấy người dùng", { variant: "error" });
                    navigate("/admin/users");
                });
        }
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Xóa lỗi khi user sửa field
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadAvatar(file);
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
            enqueueSnackbar("Tải ảnh thành công!", { variant: "success" });
        } catch (err) {
            enqueueSnackbar("Lỗi khi tải ảnh!", { variant: "error" });
        } finally {
            setUploading(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!originalData) return;

        const hasChanged = !isEqual(formData, {
            name: originalData.name,
            email: originalData.email,
            username: originalData.username,
            role: originalData.role,
            phone: originalData.phone,
            address: originalData.address,
            profileImage: originalData.profileImage,
        });

        if (!hasChanged) {
            enqueueSnackbar("Bạn chưa thay đổi thông tin nào.", { variant: "warning" });
            return;
        }

        const validationErrors = validateEditUserData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar("Vui lòng sửa các lỗi trong biểu mẫu.", { variant: "error" });
            return;
        }

        try {
            const response = await updateUser(String(originalData.userId), formData);

            const currentToken = localStorage.getItem("token");
            const currentUserName = currentToken ? getUsernameFromToken(currentToken) : null;
            if (response && currentUserName === originalData.username) {
                localStorage.setItem("token", response);
                const newRole = getUserRoleFromToken(response);
                if (newRole !== "ROLE_ADMIN") {
                    enqueueSnackbar("Bạn không còn quyền quản trị. Đã đăng xuất.", { variant: "warning" });
                    navigate("/admin/login");
                    return;
                }
            }

            enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
            navigate("/admin/users");
        } catch (error: any) {
            enqueueSnackbar("Cập nhật thất bại: " + error.message, { variant: "error" });
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 4,
                p: 3,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
            }}
            component={Paper}
        >
            <Typography variant="h5" component="h1" mb={2}>
                Chỉnh sửa người dùng
            </Typography>

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
                <TextField
                    label="Họ tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Tên đăng nhập"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <TextField
                    select
                    label="Vai trò"
                    name="role"
                    translate="no"
                    value={formData.role}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role}
                >
                    {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}  translate="no">
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
                />
                <TextField
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                />
                <Box mt={1} display="flex" justifyContent="center" >
                    <img
                        src={formData.profileImage || "/placeholder-image.png"}
                        alt="Chưa có ảnh đại diện vui lòng chọn ảnh"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                    />
                </Box>
                <Button variant="outlined" component="label" disabled={uploading}>
                    {uploading ? "Đang tải ảnh..." : "Chọn ảnh đại diện"}
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Cập nhật
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditUserPage;
