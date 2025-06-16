import React from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getUserRoleFromToken } from "../utils/jwtUtils";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    CssBaseline,
    Button,
    Stack,
    Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import GoogleTranslate from "../components/GoogleTranslate";

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/admin/login" replace />;
    const role = getUserRoleFromToken(token);
    if (role !== "ROLE_ADMIN") return <Navigate to="/admin/login" replace />;

    const handleLogout = () => {
        localStorage.clear();
        navigate("/admin/login", { replace: true });
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <CssBaseline />
            <AppBar
                position="static"
                sx={{
                    background: "linear-gradient(to right, #283593, #1e88e5)",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
            >
                <Toolbar>
                    <DashboardIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Bảng điều khiển Quản trị viên
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <GoogleTranslate />
                        <Button
                            variant={isActive("/admin/users") ? "contained" : "text"}
                            color="inherit"
                            startIcon={<GroupIcon />}
                            onClick={() => navigate("/admin/users")}
                            sx={{
                                bgcolor: isActive("/admin/users") ? "#3949ab" : "transparent",
                                "&:hover": {
                                    bgcolor: "#5c6bc0",
                                },
                            }}
                        >
                            Người dùng
                        </Button>
                        <Button
                            variant={isActive("/admin/products") ? "contained" : "text"}
                            color="inherit"
                            startIcon={<InventoryIcon />}
                            onClick={() => navigate("/admin/products")}
                            sx={{
                                bgcolor: isActive("/admin/products") ? "#3949ab" : "transparent",
                                "&:hover": {
                                    bgcolor: "#5c6bc0",
                                },
                            }}
                        >
                            Sản phẩm
                        </Button>
                        <Button
                            variant={isActive("/admin/orders") ? "contained" : "text"}
                            color="inherit"
                            startIcon={<ReceiptLongIcon />}
                            onClick={() => navigate("/admin/orders")}
                            sx={{
                                bgcolor: isActive("/admin/orders") ? "#3949ab" : "transparent",
                                "&:hover": {
                                    bgcolor: "#5c6bc0",
                                },
                            }}
                        >
                            Đơn hàng
                        </Button>
                        <Button
                            color="inherit"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                "&:hover": {
                                    bgcolor: "#ef5350",
                                    color: "white",
                                },
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    width: "100%",
                    minHeight: "calc(100vh - 64px - 180px)",
                    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                    px: { xs: 0, sm: 0, md: 0 },
                    py: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ width: "100%", maxWidth: "lg" === "lg" ? 1200 : "100%" }}>
                    <Outlet />
                </Box>
            </Box>



            <Box
                component="footer"
                sx={{
                    mt: 4,
                    py: 4,
                    px: 2,
                    background: "linear-gradient(45deg, #1e88e5, #1565c0, #0d47a1)",
                    backgroundSize: "300% 300%",
                    animation: "oceanGradient 10s ease infinite",
                    color: "white",
                    textAlign: "center",
                    fontSize: "0.95rem",
                    fontWeight: 400,
                    lineHeight: 1.6,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Quản trị hệ thống bán hàng
                </Typography>
                <Typography>Địa chỉ: 123 Đường Quản Trị, Quận 1, TP.HCM</Typography>
                <Typography>Email: admin@yourdomain.com | Hotline: 1900 999 888</Typography>
                <Typography sx={{ mt: 1, fontStyle: "italic", fontSize: "0.85rem" }}>
                    © 2025 Công ty Quản trị. Bản quyền thuộc về nhóm phát triển hệ thống.
                </Typography>

                <style>
                    {`
            @keyframes oceanGradient {
                0%{background-position:0% 50%}
                50%{background-position:100% 50%}
                100%{background-position:0% 50%}
            }
        `}
                </style>
            </Box>
        </>
    );
};

export default AdminLayout;
