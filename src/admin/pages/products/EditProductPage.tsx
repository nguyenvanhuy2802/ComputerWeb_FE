import React, { useEffect, useState } from "react";
import {
    Box, TextField, Button, Typography, MenuItem, Paper
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { ProductDTO } from "../../../types/Product";
import { getProductByIdAdmin, updateProduct } from "../../../api/productApi";
import { getAllCategories } from "../../../api/categoryApi";
import { validateProductData, ValidationErrors } from "../../../validation/validation";
import {Category} from "../../../types/Category";
import {uploadAvatar} from "../../../api/imageApi";

const EditProductPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<ProductDTO>({
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        categoryId: 0,
        productImage: ""
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    getProductByIdAdmin(Number(id)),
                    getAllCategories(),
                ]);
                // Sửa chỗ này
                setFormData(productRes);
                setCategories(categoriesRes);
            } catch (error) {
                enqueueSnackbar("Lỗi khi tải dữ liệu", { variant: "error" });
                navigate("/admin/products");
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "stockQuantity" || name === "categoryId"
                ? Number(value)
                : value
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
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

        const validationErrors = validateProductData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            enqueueSnackbar("Vui lòng sửa các lỗi trong biểu mẫu.", { variant: "error" });
            return;
        }

        try {
            await updateProduct(Number(id), formData);
            enqueueSnackbar("Cập nhật sản phẩm thành công!", { variant: "success" });
            navigate("/admin/products");
        } catch (error: any) {
            enqueueSnackbar("Cập nhật thất bại: " + error.message, { variant: "error" });
        }
    };

    return (
        <Box sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            p: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 3,
        }} component={Paper}>
            <Typography variant="h5" mb={2}>Chỉnh sửa sản phẩm</Typography>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <TextField
                    label="Tên sản phẩm"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description}
                />
                <TextField
                    label="Giá"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price}
                />
                <TextField
                    label="Số lượng tồn kho"
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity}
                />
                <TextField
                    select
                    label="Danh mục"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.categoryId}
                    helperText={errors.categoryId}
                >
                    {categories.map((category: any) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Box mt={1} display="flex" justifyContent="center">
                    <img
                        src={formData.productImage || "/placeholder-image.png"}
                        alt="Product Preview"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                    />
                </Box>
                <Button variant="outlined" component="label" disabled={uploading}>
                    {uploading ? "Đang tải ảnh..." : "Chọn ảnh mới"}
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                {errors.productImage && (
                    <Typography color="error" variant="body2">{errors.productImage}</Typography>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">Cập nhật</Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditProductPage;
