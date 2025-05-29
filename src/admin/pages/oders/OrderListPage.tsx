import React, { useEffect, useState } from "react";
import {
    Box,
    MenuItem,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Paper, Stack, useTheme,
} from "@mui/material";
import {DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams} from "@mui/x-data-grid";
import { getAllOrdersAdmin, updateOrderStatus } from "../../../api/orderApi";
import { OrderAdmin, OrderDTO, OrderStatus } from "../../../types/Order";
import { useSnackbar } from "notistack";

const statusLabels: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PACKAGING: "Đã chuẩn bị hàng",
    SHIPPED: "Đang giao",
    COMPLETED: "Đã giao",
    CANCELED: "Đã hủy",
    RETURNED: "Trả hàng",
};

const OrderListPage: React.FC = () => {
    const theme = useTheme();
    const [orders, setOrders] = useState<OrderAdmin[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedNewStatus, setSelectedNewStatus] = useState<OrderStatus | null>(null);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });
    useEffect(() => {
        const fetchOrders = async () => {

            try {
                const data = await getAllOrdersAdmin();
                setOrders(data);
            } catch (error: any) {
                enqueueSnackbar("Lỗi khi tải đơn hàng: " + error.message, { variant: "error" });
            }
        };

        fetchOrders();
    }, []);

    const requestStatusChange = (orderId: number, newStatus: OrderStatus) => {
        setSelectedOrderId(orderId);
        setSelectedNewStatus(newStatus);
        setConfirmDialogOpen(true);
    };

    const confirmStatusChange = async () => {
        if (selectedOrderId == null || selectedNewStatus == null) return;

        try {
            await updateOrderStatus(selectedOrderId, selectedNewStatus);
            enqueueSnackbar("Cập nhật trạng thái thành công", { variant: "success" });

            setOrders((prev) =>
                prev.map((order) =>
                    order.orderId === selectedOrderId
                        ? { ...order, status: selectedNewStatus }
                        : order
                )
            );
        } catch (error: any) {
            enqueueSnackbar("Cập nhật thất bại: " + error.message, { variant: "error" });
        } finally {
            setConfirmDialogOpen(false);
            setSelectedOrderId(null);
            setSelectedNewStatus(null);
        }
    };

    const cancelStatusChange = () => {
        setConfirmDialogOpen(false);
        setSelectedOrderId(null);
        setSelectedNewStatus(null);
    };

    const columns: GridColDef[] = [
        { field: "orderId", headerName: "Mã đơn", flex: 1 },
        { field: "buyerName", headerName: "Người mua", flex: 1.5 },
        { field: "deliveryAddress", headerName: "Địa chỉ giao hàng", flex: 2 },
        {
            field: "totalAmount",
            headerName: "Tổng tiền (đ)",
            flex: 1,
            renderCell: (params) => {
                const price = params.row.totalAmount;
                return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1.2,
            renderCell: (params: GridRenderCellParams<OrderDTO>) => (
                <Select
                    value={params.row.status}
                    onChange={(e) =>
                        requestStatusChange(Number(params.row.orderId), e.target.value as OrderStatus)
                    }
                    size="small"
                    fullWidth
                    sx={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                    }}
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: "orderDate",
            headerName: "Ngày đặt",
            flex: 1.5,
            renderCell: (params) => {
                const date = new Date(params.row.orderDate);
                return date.toLocaleString("vi-VN");
            },
        },
    ];

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
                    Quản lý đơn hàng
                </Typography>
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
                    rows={orders}
                    columns={columns}
                    getRowId={(row) => row.orderId}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    loading={orders.length === 0}
                />
            </Box>

            <Dialog open={confirmDialogOpen} onClose={cancelStatusChange}>
                <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn cập nhật đơn hàng{" "}
                        <strong>#{selectedOrderId}</strong> thành trạng thái{" "}
                        <strong>{selectedNewStatus && statusLabels[selectedNewStatus]}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelStatusChange}>Hủy</Button>
                    <Button variant="contained" color="primary" onClick={confirmStatusChange}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderListPage;
