import React, {useEffect, useState} from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    TextField,
    Button,
    Stack,
    Paper,
    useTheme,
    MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {validateChangeInforUserData, ValidationErrors} from '../validation/validation';
import { uploadAvatar } from '../api/imageApi';
import {updateUser, getCurrentUserId, changePassword, getUser, changeInfor} from '../api/userApi';
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 80;

const UserInformationPage: React.FC = () => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (_: any, newIndex: number) => setTabIndex(newIndex);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        profileImage: '',
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [uploading, setUploading] = useState(false);



    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const idUser = await getCurrentUserId();
                const userData = await getUser(String(idUser));

                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    profileImage: userData.profileImage || '',
                });
            } catch (error) {
                enqueueSnackbar('Không thể tải thông tin người dùng', { variant: 'error' });
            }
        };

        fetchUserInfo();
    }, []);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadAvatar(file);
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
            enqueueSnackbar('Tải ảnh thành công!', { variant: 'success' });
        } catch {
            enqueueSnackbar('Lỗi khi tải ảnh!', { variant: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleUserInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateChangeInforUserData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar('Vui lòng sửa các lỗi trong biểu mẫu.', { variant: 'error' });
            return;
        }


        try {
            const idUser =  await getCurrentUserId();
            const res = await changeInfor(String(idUser), formData);
            enqueueSnackbar('Cập nhật thông tin thành công', { variant: 'success' });
        } catch (error: any) {
            enqueueSnackbar(`Lỗi cập nhật: ${error.message || 'Đã có lỗi xảy ra'}`, { variant: 'error' });
        }
    };


    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwords;

        if (!currentPassword || !newPassword || !confirmPassword) {
            enqueueSnackbar('Vui lòng điền đầy đủ thông tin', { variant: 'warning' });
            return;
        }

        if (newPassword.length < 6) {
            enqueueSnackbar('Mật khẩu mới phải có ít nhất 6 ký tự', { variant: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            enqueueSnackbar('Mật khẩu xác nhận không khớp', { variant: 'error' });
            return;
        }
        try {
            const idUser =  await getCurrentUserId();
            await changePassword(String(idUser), {
                oldPassword: passwords.currentPassword,
                newPassword: passwords.confirmPassword,
            });
            enqueueSnackbar('Đổi mật khẩu thành công', { variant: 'success' });
        }  catch (error: any) {
                enqueueSnackbar(`Lỗi cập nhật: ${error.response?.data|| 'Đã có lỗi xảy ra'}`, {variant: 'error'});

        }

    };


    return (
        <>
            <Header />
            <Box sx={{ height: `${HEADER_HEIGHT+100}px` }} />
            <Box
                component="nav"
                aria-label="breadcrumb"
                sx={{ ml: '280px', mb: 2 }}
            >
                <ol className="breadcrumb p-3 rounded">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            Trang chủ
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Thông tin tài khoản
                    </li>
                </ol>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    minHeight: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                }}
            >
                <Box
                    sx={{
                        width: 250,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        pt: 3,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Tabs
                        orientation="vertical"
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="scrollable"
                    >
                        <Tab label="Thông tin người dùng" />
                        <Tab label="Đổi mật khẩu" />
                    </Tabs>
                </Box>

                <Box sx={{ flex: 1, p: 3 }}>
                    {tabIndex === 0 && (
                        <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin người dùng
                            </Typography>
                            <form onSubmit={handleUserInfoSubmit}>
                                <Stack spacing={2}>
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
                                    <Box display="flex" justifyContent="center">
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
                                        <Button type="submit" variant="contained">
                                            Cập nhật
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </Paper>
                    )}

                    {tabIndex === 1 && (
                        <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
                            <Typography variant="h6" gutterBottom>
                                Đổi mật khẩu
                            </Typography>
                            <form onSubmit={handlePasswordSubmit}>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Mật khẩu hiện tại"
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) =>
                                            setPasswords({ ...passwords, currentPassword: e.target.value })
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Mật khẩu mới"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Xác nhận mật khẩu"
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) =>
                                            setPasswords({ ...passwords, confirmPassword: e.target.value })
                                        }
                                        fullWidth
                                    />
                                    <Button type="submit" variant="contained">
                                        Đổi mật khẩu
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    )}
                </Box>
            </Box>
            <Footer />
        </>
    );
};

export default UserInformationPage;
