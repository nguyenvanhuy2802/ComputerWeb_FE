import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    useTheme,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridPaginationModel,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../../api/productApi";
import { Product } from "../../../types/Product";
import { useSnackbar } from "notistack";
import {getAllCategories} from "../../../api/categoryApi";
import {Category} from "../../../types/Category";

export default function ProductListPage() {
    const theme = useTheme();
    const [products, setProducts] = useState<Product[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res);
            } catch (error) {
                enqueueSnackbar("Lỗi khi tải danh mục", { variant: "error" });
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        getAllProducts()
            .then((res) => setProducts(res))
            .catch(() => {
                enqueueSnackbar("Lỗi khi tải sản phẩm", { variant: "error" });
            });
    }, []);

    const handleOpenConfirm = (id: number) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) return;
        deleteProduct(selectedId)
            .then(() => {
                enqueueSnackbar("Xóa sản phẩm thành công", { variant: "success" });
                return getAllProducts().then((res) => setProducts(res));
            })
            .catch(() => {
                enqueueSnackbar("Xóa thất bại", { variant: "error" });
            })
            .finally(() => {
                setConfirmOpen(false);
                setSelectedId(null);
            });
    };

    const columns: GridColDef[] = [
        { field: "productId", headerName: "ID", flex: 1 ,
            renderCell: (params) => (
                <span translate="no">{params.value}</span>
            )},
        { field: "name", headerName: "Tên sản phẩm", flex: 2 ,
            renderCell: (params) => (
                <span translate="no">{params.value}</span>
            )},
        {
            field: "price",
            headerName: "Giá",
            flex: 1.5,
            renderCell: (params) => {
                const price = params.row.price;
                return (
                    <span translate="no">
                {price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                })}
            </span>
                );
            },
        },
        {
            field: "stockQuantity", headerName: "Số lượng tồn kho", flex: 1.5 ,
            renderCell: (params) => (
                <span translate="no">{params.value}</span>
            )},
        {
            field: "categoryId",
            headerName: "Danh mục",
            flex: 2,
            renderCell: (params) => {
                <span translate="no">{params.value}</span>
                const category = categories.find(c => c.categoryId === params.value);
                if (!category) return null;

                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}} translate="no" >
                        <img
                            src={category.categoryImage}
                            alt={category.name}
                            width={40}
                            height={40}
                            style={{marginRight: 8, objectFit: 'cover', borderRadius: 4}}
                        />
                        <Typography>{category.name}</Typography>
                    </Box>
                );
            }
        },
        {
            field: "productImage",
            headerName: "Hình ảnh",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt={params.row.name}
                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                />
            ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Hành động",
            flex: 1.5,
            getActions: (params) => [
                <Tooltip title="Chỉnh sửa" key="edit">
                    <GridActionsCellItem
                        icon={<EditIcon color="primary" />}
                        label="Sửa"
                        onClick={() => navigate(`/admin/products/edit/${params.id}`)}
                    />
                </Tooltip>,
                <Tooltip title="Xóa" key="delete">
                    <GridActionsCellItem
                        icon={<DeleteIcon color="error" />}
                        label="Xóa"
                        onClick={() => handleOpenConfirm(Number(params.id))}
                    />
                </Tooltip>,
            ],
        },
    ];

    const handleAddProduct = () => {
        navigate("/admin/products/create");
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        color: theme.palette.primary.main,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    }}
                >
                    Quản lý sản phẩm
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleAddProduct}>
                    Thêm sản phẩm
                </Button>
            </Stack>

            <Box
                sx={{
                    height: 500,
                    width: "100%",
                    borderRadius: 2,
                    boxShadow: 2,
                    overflow: "hidden",
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.primary.light,
                        color: "#222",
                        fontWeight: "bold",
                        fontSize: 16,
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: theme.palette.action.hover,
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: theme.palette.action.selected,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: theme.palette.grey[100],
                    },
                }}
            >
                <DataGrid
                    rows={products}
                    columns={columns}
                    getRowId={(row) => row.productId}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    loading={products.length === 0}
                />
            </Box>

            {/* Dialog xác nhận xóa */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.error.main }}>
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
