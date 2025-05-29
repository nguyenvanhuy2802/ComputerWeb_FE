import { useEffect, useState } from 'react';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridPaginationModel,
} from '@mui/x-data-grid';
import { getAllUsers, deleteUser } from '../../../api/userApi';
import {
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Chip,
    useTheme,
    Tooltip,
    Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { User } from '../../../types/User';
import { useNavigate } from 'react-router-dom';

export default function UserListPage() {
    const theme = useTheme();
    const [users, setUsers] = useState<User[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });

    useEffect(() => {
        getAllUsers().then((res) => setUsers(res));
    }, []);

    const handleOpenConfirm = (id: string) => {
        const targetUser = users.find((user) => String(user.userId) === id);
        if (!targetUser) return;

        if (targetUser.role === 'ADMIN') {
            enqueueSnackbar('Không thể xóa người dùng ADMIN', { variant: 'warning' });
            return;
        }

        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) return;
        deleteUser(selectedId)
            .then(() => {
                enqueueSnackbar('Xóa người dùng thành công', { variant: 'success' });
                return getAllUsers().then(res => setUsers(res));
            })
            .catch(() => {
                enqueueSnackbar('Xóa thất bại', { variant: 'error' });
            })
            .finally(() => {
                setConfirmOpen(false);
                setSelectedId(null);
            });
    };

    const handleAddUser = () => {
        navigate('/admin/users/create');
    };

    const columns: GridColDef[] = [
        { field: 'userId', headerName: 'ID', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'name', headerName: 'Họ tên', flex: 2 },
        { field: 'username', headerName: 'Tên đăng nhập', flex: 2 },
        {
            field: 'role',
            headerName: 'Vai trò',
            flex: 2,
            renderCell: (params) => {
                const isAdmin = params.value === 'ADMIN';
                return (
                    <Chip
                        icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                        label={isAdmin ? 'Admin' : 'Customer'}
                        color={isAdmin ? 'error' : 'primary'}
                        variant="outlined"
                    />
                );
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            getActions: (params) => [
                <Tooltip title="Chỉnh sửa">
                    <GridActionsCellItem
                        icon={<EditIcon color="primary" />}
                        label="Sửa"
                        onClick={() => navigate(`/admin/users/edit/${params.id}`)}
                    />
                </Tooltip>,
                <Tooltip title="Xóa">
                    <GridActionsCellItem
                        icon={<DeleteIcon color="error" />}
                        label="Xóa"
                        onClick={() => handleOpenConfirm(String(params.id))}
                    />
                </Tooltip>,
            ],
        },
    ];

    return (
        <Box sx={{ padding: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: theme.palette.primary.main,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    }}
                >
                    Quản lý người dùng
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    color="primary"
                    onClick={handleAddUser}
                >
                    Thêm người dùng
                </Button>
            </Stack>

            <Box
                sx={{
                    height: 500,
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 2,
                    overflow: 'hidden',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.light,
                        color: '#222',
                        fontWeight: 'bold',
                        fontSize: 16,
                    },
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: theme.palette.action.selected,
                    },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: theme.palette.grey[100],
                    },
                }}
            >
                <DataGrid
                    rows={users}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    loading={users.length === 0}
                />
            </Box>


            {/* Dialog xác nhận xóa */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa người dùng này không? Thao tác này không thể
                        hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
