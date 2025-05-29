import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { ProductDTO } from "../../../types/Product";
import { createProduct } from "../../../api/productApi";
import { uploadAvatar } from "../../../api/imageApi";
import { getAllCategories } from "../../../api/categoryApi";
import { validateProductData, ValidationErrors } from "../../../validation/validation";

interface Category {
    categoryId: number;
    name: string;
}

const AddProductPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProductDTO>({
        name: "",
        description: "",
        price: 100000,
        stockQuantity: 1,
        categoryId: 0,
        productImage: "",
    });

    const [formErrors, setFormErrors] = useState<ValidationErrors>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
                if (data.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        categoryId: data[0].categoryId,
                    }));
                }
            } catch (error) {
                enqueueSnackbar("Lỗi khi tải danh sách danh mục", { variant: "error" });
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [enqueueSnackbar]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "stockQuantity" || name === "categoryId"
                ? Number(value)
                : value,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadAvatar(file);
            setFormData((prev) => ({ ...prev, productImage: imageUrl }));
            enqueueSnackbar("Tải ảnh thành công!", { variant: "success" });
        } catch (err) {
            enqueueSnackbar("Lỗi khi tải ảnh!", { variant: "error" });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validateProductData(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            enqueueSnackbar("Vui lòng kiểm tra lại thông tin!", { variant: "warning" });
            return;
        }

        try {
            await createProduct(formData);
            enqueueSnackbar("Tạo sản phẩm thành công!", { variant: "success" });
            navigate("/admin/products");
        } catch (error: any) {
            enqueueSnackbar("Lỗi khi tạo sản phẩm: " + error?.response?.data?.message, {
                variant: "error",
            });
        }
    };

    return (
        <Box
            component={Paper}
            sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}
        >
            <Typography variant="h5" mb={2}>Thêm sản phẩm mới</Typography>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <TextField
                    label="Tên sản phẩm"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                />
                <TextField
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    rows={3}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                />
                <TextField
                    label="Giá"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                />
                <TextField
                    label="Số lượng"
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!formErrors.stockQuantity}
                    helperText={formErrors.stockQuantity}
                />

                {loadingCategories ? (
                    <Box display="flex" alignItems="center">
                        <CircularProgress size={20} />
                        <Typography ml={2}>Đang tải danh mục...</Typography>
                    </Box>
                ) : (
                    <TextField
                        select
                        label="Danh mục"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!formErrors.categoryId}
                        helperText={formErrors.categoryId}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                <Box mt={1} display="flex" justifyContent="center">
                    <img
                        src={formData.productImage || "/placeholder-image.png"}
                        alt="Chưa có ảnh sản phẩm vui lòng chọn ảnh"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                    />
                </Box>
                <Button variant="outlined" component="label" disabled={uploading}>
                    {uploading ? "Đang tải ảnh..." : "Chọn ảnh sản phẩm"}
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                {formErrors.productImage && (
                    <Typography color="error" variant="body2">{formErrors.productImage}</Typography>
                )}

                <Button type="submit" variant="contained" color="primary">
                    Thêm sản phẩm
                </Button>
            </form>
        </Box>
    );
};

export default AddProductPage;
