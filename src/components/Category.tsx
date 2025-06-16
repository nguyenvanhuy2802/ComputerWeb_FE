import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import "../css/category.css";
import {Product} from "../types/Product";
import {Category} from "../types/Category";
import {useCart} from "../context/CartContext";
import {saveCartItem} from "../api/cartItemApi";
import {toast} from "react-toastify";
import {getAllProducts, getProductById, getProductsByCategory} from "../api/productApi";
import {getAverageRatingByProductId, getReviewCountByProductId} from "../api/reviewApi";
import {useUser} from "../context/UserContext";
import {Item} from "../types/CartItem";
import {getCategoryById} from "../api/categoryApi";
import {useRequireLogin} from "../hooks/useRequireLogin";

interface EnrichedItem extends Item {
    product?: Product;
}

const CategoryComp: React.FC = () => {

    const {id} = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [averageRatings, setAverageRatings] = useState<{ [key: number]: number }>({});
    const [reviewCounts, setReviewCounts] = useState<{ [key: number]: number }>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [modalAction, setModalAction] = useState<"buy" | "add-to-cart">("buy");
    const {refreshCartCount} = useCart();
    const {cart} = useUser();
    const navigate = useNavigate();
    const requireLogin = useRequireLogin();

    const handleShowModal = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;

                const prodRes = await getProductsByCategory(Number(id));
                const proArr = prodRes.data;
                setProducts(proArr);

                const categoryData = await getCategoryById(Number(id));
                setCategory(categoryData);

                // Gọi API để lấy điểm đánh giá trung bình cho từng sản phẩm
                const ratingsPromises = proArr.map(p =>
                    getAverageRatingByProductId(p.productId).then(rating => [p.productId, rating] as [number, number])
                );
                const ratingsEntries = await Promise.all(ratingsPromises);
                setAverageRatings(Object.fromEntries(ratingsEntries));

                // Gọi API để lấy số lượng đánh giá cho từng sản phẩm
                const countPromises = proArr.map(p =>
                    getReviewCountByProductId(p.productId).then(count => [p.productId, count] as [number, number])
                );
                const countEntries = await Promise.all(countPromises);
                setReviewCounts(Object.fromEntries(countEntries));
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!requireLogin()) return;
        if (!selectedProduct || !cart) {
            toast.error("Không tìm thấy giỏ hàng!");
            return;
        }
        try {
            if (modalAction === "add-to-cart") {
                await saveCartItem(quantity, cart.cartId, selectedProduct.productId);
                await refreshCartCount();
                toast.success("Đã thêm vào giỏ hàng!");
                handleCloseModal();
            } else if (modalAction === "buy") {
                const product = await getProductById(selectedProduct.productId);
                const selectedCartItems: EnrichedItem[] = [
                    {
                        productId: selectedProduct.productId,
                        quantity: quantity,
                        product: product,
                    },
                ];
                navigate("/payment", {
                    state: {
                        cartItems: selectedCartItems,
                        many: false
                    },
                });
            }

        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };


    return (
        <div className="container category-container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-white shadow-sm p-3 rounded">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            Trang chủ
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {category?.name}
                    </li>
                </ol>
            </nav>

            {/* Mục danh sách sản phẩm */}
            <section className="mt-5">
                <h2 className="mb-5 text-center fw-bold">Danh Sách Sản Phẩm: {category?.name}</h2>
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div key={p.productId} className="col-12 col-sm-6 col-md-4">
                                <div className="card h-100 shadow border-0 rounded-3 product-card">
                                    <Link to={`/product/${p.productId}`} className="text-decoration-none">
                                        <img
                                            src={p.productImage}
                                            alt={p.name}
                                            className="card-img-top product-card-img rounded-top"
                                            style={{height: "200px", objectFit: "cover"}}
                                            loading="lazy"
                                        />
                                    </Link>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{p.name}</h5>
                                        <div className="rating mb-2">
                                            <div className="d-flex align-items-center mb-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                        key={star}
                                                        className={
                                                            averageRatings[p.productId] >= star
                                                                ? "bi bi-star-fill text-warning"
                                                                : averageRatings[p.productId] >= star - 0.5
                                                                    ? "bi bi-star-half text-warning"
                                                                    : "bi bi-star text-warning"
                                                        }
                                                    ></i>
                                                ))}
                                            </div>
                                            <small className="text-muted">
                                                {averageRatings[p.productId]?.toFixed(1) || "0.0"} / 5
                                                {" "}({reviewCounts[p.productId] || 0} lượt đánh giá)
                                            </small>

                                            <p className="card-text text-danger fw-bold price">
                                                {p.price.toLocaleString()} VND
                                            </p>
                                        </div>
                                        <div className="btn-group d-flex gap-2 mt-auto">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary flex-grow-1"
                                                onClick={() => {
                                                    setModalAction("add-to-cart");
                                                    setQuantity(1);
                                                    handleShowModal(p);
                                                }}
                                            >
                                                <i className="bi bi-cart-plus me-2"></i>Thêm vào Giỏ
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-success flex-grow-1"
                                                onClick={() => {
                                                    setModalAction("buy");
                                                    setQuantity(1);
                                                    handleShowModal(p);
                                                }}
                                            >
                                                <i className="bi bi-credit-card me-2"></i>Mua Ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted">Không có sản phẩm nào.</div>
                    )}
                </div>
            </section>
            {/* Modal hiển thị chi tiết sản phẩm */}
            {selectedProduct && (
                <div className={`modal fade ${showModal ? "show d-block" : ""} custom-modal`} tabIndex={-1}>
                    <div className="modal-dialog">
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Thông tin sản phẩm */}
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={selectedProduct.productImage}
                                            alt={selectedProduct.name}
                                            className="img-fluid rounded-circle"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                marginRight: "15px"
                                            }}
                                        />
                                        <div>
                                            <h5>{selectedProduct.name}</h5>
                                            <p className="text-danger fw-bold">{selectedProduct.price.toLocaleString()} VND</p>
                                        </div>
                                    </div>

                                    {/* Nhập số lượng với nút giảm và tăng */}
                                    <div className="mb-3">
                                        <label htmlFor="modalQuantity" className="form-label">Số lượng:</label>
                                        <div className="input-group">
                                            <button type="button" className="btn btn-outline-secondary"
                                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}>-
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                id="modalQuantity"
                                                name="quantity"
                                                value={quantity}
                                                min={1}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                required
                                            />
                                            <button type="button" className="btn btn-outline-secondary"
                                                    onClick={() => setQuantity(q => q + 1)}>+
                                            </button>
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary">Xác nhận</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>

    );
}
export default CategoryComp;