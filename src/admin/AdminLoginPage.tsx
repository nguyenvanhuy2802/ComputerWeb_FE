import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { getUserRoleFromToken } from "../utils/jwtUtils";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async () => {
        try {
            const res = await axiosInstance.post("/auth/login", {
                username,
                password,
            });
            const token = res.data.data

            const role = getUserRoleFromToken(token);

            if (role !== "ROLE_ADMIN") {
                enqueueSnackbar("Bạn không có quyền truy cập Admin!", {
                    variant: "warning",
                });
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("currentUser", JSON.stringify(res.data.user)); // nếu cần

            enqueueSnackbar("Đăng nhập thành công!", {
                variant: "success",
            });
            navigate("/admin");
        } catch (error) {
            enqueueSnackbar("Đăng nhập thất bại. Vui lòng kiểm tra lại.", {
                variant: "error",
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 10 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Đăng nhập Quản trị viên
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Tên đăng nhập"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Mật khẩu"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        fullWidth
                        size="large"
                    >
                        Đăng nhập
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminLoginPage;
