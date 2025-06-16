import React, { useEffect, useState } from "react";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import InventoryIcon from '@mui/icons-material/Inventory';
import DoneAllIcon from '@mui/icons-material/DoneAll';
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
const statusStyles: Record<OrderStatus, { color: string; bgColor: string; icon: React.ReactNode }> = {
    PENDING: {
        color: "#ff9800",
        bgColor: "#fff3e0",
        icon: <HourglassEmptyIcon fontSize="small" />,
    },
    CONFIRMED: {
        color: "#1976d2",
        bgColor: "#e3f2fd",
        icon: <AssignmentTurnedInIcon fontSize="small" />,
    },
    PACKAGING: {
        color: "#9c27b0",
        bgColor: "#f3e5f5",
        icon: <InventoryIcon fontSize="small" />,
    },
    SHIPPED: {
        color: "#009688",
        bgColor: "#e0f2f1",
        icon: <LocalShippingIcon fontSize="small" />,
    },
    COMPLETED: {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: <DoneAllIcon fontSize="small" />,
    },
    CANCELED: {
        color: "#f44336",
        bgColor: "#ffebee",
        icon: <CancelIcon fontSize="small" />,
    },
    RETURNED: {
        color: "#795548",
        bgColor: "#efebe9",
        icon: <ReplayIcon fontSize="small" />,
    },
};
const isUsingGoogleTranslate = () => {
    const lang = document.documentElement.lang;
    return lang && lang !== "vi";
};
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELED"],
    CONFIRMED: ["PACKAGING", "CANCELED"],
    PACKAGING: ["SHIPPED", "CANCELED"],
    SHIPPED: ["COMPLETED", "CANCELED"],
    COMPLETED: ["RETURNED"],
    CANCELED: [],
    RETURNED: [],
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
        { field: "orderId", headerName: "Mã đơn", flex: 1,
            renderCell: (params) => (
                <span translate="no">{params.value}</span>
            )},
        { field: "buyerName", headerName: "Người mua", flex: 1.5 ,
            renderCell: (params) => (
                <span translate="no">{params.value}</span>
            )},
        { field: "deliveryAddress", headerName: "Địa chỉ giao hàng", flex: 2 ,
            renderCell: (params) => (
                <span translate="no">{params.value}</span>
            )},
        {
            field: "totalAmount",
            headerName: "Tổng tiền (đ)",
            flex: 1,
            renderCell: (params) => {
                <span translate="no">{params.value}</span>
                const price = params.row.totalAmount;
                return price.toLocaleString("vi-VN", {style: "currency", currency: "VND"});
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1.5,
            renderCell: (params: GridRenderCellParams<OrderDTO>) => {
                const currentStatus = params.row.status;
                const validNextStatuses = allowedTransitions[currentStatus];
                const style = statusStyles[currentStatus];

                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        translate="no"
                        gap={1}
                        sx={{
                            backgroundColor: style.bgColor,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontWeight: "bold",
                            color: style.color,
                        }}
                    >
                        {style.icon}
                        <Select
                            value={currentStatus}
                            onChange={(e) =>
                                requestStatusChange(Number(params.row.orderId), e.target.value as OrderStatus)
                            }
                            size="small"
                            variant="standard"
                            translate="no"
                            disableUnderline
                            disabled={validNextStatuses.length === 0}
                            sx={{
                                fontWeight: "bold",
                                color: style.color,
                                minWidth: 120,
                                backgroundColor: "transparent",
                                "& .MuiSelect-icon": { color: style.color },
                            }}
                        >
                            <MenuItem value={currentStatus} translate="no">
                                {statusLabels[currentStatus]}
                            </MenuItem>
                            {validNextStatuses.map((status) => (
                                <MenuItem key={status} value={status} translate="no">
                                    {statusLabels[status]}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                );
            },
        },
        {
            field: "orderDate",
            headerName: "Ngày đặt",
            flex: 1.5,
            renderCell: (params) => {
                <span translate="no">{params.value}</span>
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

            <Dialog open={confirmDialogOpen} onClose={cancelStatusChange} >
                <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn cập nhật đơn hàng{" "}
                        <strong translate="no">#{selectedOrderId}</strong> thành trạng thái{" "}
                        <strong translate="no">{selectedNewStatus && statusLabels[selectedNewStatus]}</strong>?
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
