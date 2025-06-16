import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getProductById} from "../api/productApi";
import {getAverageRatingByProductId, getReviewsByProductId} from "../api/reviewApi";
import {Product} from "../types/Product";
import "../css/productDetail.css";
import {saveCartItem} from "../api/cartItemApi";
import {toast} from "react-toastify";
import {useUser} from "../context/UserContext";
import {useCart} from "../context/CartContext";
import {Item} from "../types/CartItem";
import {Review} from "../types/Review";
import ModalReview from "./ModalReview";
import {getCategoryById} from "../api/categoryApi";
import {Category} from "../types/Category";

interface EnrichedItem extends Item {
    product?: Product;
}

const ProductDetail: React.FC = () => {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState<number | null>(null); // <-- Thêm dòng này
    const [quantity, setQuantity] = useState(1);
    const [modalAction, setModalAction] = useState<"buy" | "add-to-cart">("buy");
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const {userId, cart} = useUser();
    const {refreshCartCount} = useCart();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const defaultAvatar = "data:image/jpeg;base64,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";
    const productId = parseInt(id!);


    const fetchReviews = async () => {
        const res = await getReviewsByProductId(Number(id));
        setReviews(res);
    };
    useEffect(() => {
        if (!id || isNaN(Number(id))) return;

        const fetchData = async () => {
            try {
                const productData = await getProductById(Number(id));
                setProduct(productData);

                const categoryData = await getCategoryById(productData.categoryId);
                setCategory(categoryData);

                const rating = await getAverageRatingByProductId(Number(id));
                setAverageRating(rating);

                await fetchReviews();
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm hoặc đánh giá:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const renderStars = (rating: number) => {
        const stars = [];
        const rounded = Math.round(rating * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            if (i <= rounded) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
            } else if (i - 0.5 === rounded) {
                stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning"></i>);
            }
        }
        return stars;
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product || !cart) {
            console.log("Bị loi");
            return
        }
        try {
            if (modalAction === "add-to-cart") {
                await saveCartItem(quantity, cart.cartId, product.productId);
                await refreshCartCount();
                toast.success("Đã thêm vào giỏ hàng!");
                handleCloseModal();
            } else if (modalAction === "buy") {
                const selectedCartItems: EnrichedItem[] = [
                    {
                        productId: product.productId,
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

    if (loading) return <div className="text-center mt-5">Đang tải...</div>;
    if (!product) return <div className="text-center text-danger mt-5">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="detail-wrapper">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-white shadow-sm p-3 rounded">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            Trang chủ
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/category/${category?.categoryId}`} className="text-decoration-none">
                            {category?.name || "Danh mục"}
                        </Link>

                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {product.name}
                    </li>
                </ol>
            </nav>
            <div className="container my-5">
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <img
                                src={product.productImage}
                                className="card-img-top rounded"
                                alt={product.name}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow p-4">
                            <h2 className="card-title mb-3">{product.name}</h2>

                            {/* Hiển thị sao đánh giá */}
                            {averageRating !== null && (
                                <div className="mb-2">
                                    <span className="me-2">{renderStars(averageRating)}</span>
                                    <span className="text-muted">({averageRating.toFixed(1)} sao)</span>
                                </div>
                            )}

                            <h4 className="text-danger fw-bold mb-3">
                                {product.price.toLocaleString()} VND
                            </h4>

                            <p className="text-muted mb-2">Mã sản phẩm: #{product.productId}</p>

                            <p className="mb-3">
                                <span className="fw-bold">Tồn kho: </span>
                                {product.stockQuantity > 0 ? (
                                    <span className="badge bg-success">{product.stockQuantity} sản phẩm</span>
                                ) : (
                                    <span className="badge bg-danger">Hết hàng</span>
                                )}
                            </p>

                            <p className="mb-4">{product.description}</p>

                            <div className="btn-group d-flex gap-2 mt-auto">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary flex-grow-1"
                                    onClick={() => {
                                        setModalAction("add-to-cart");
                                        setQuantity(1);
                                        handleShowModal();
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
                                        handleShowModal();
                                    }}
                                >
                                    <i className="bi bi-credit-card me-2"></i>Mua Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-4">Đánh giá & Bình luận</h3>
                {/* Nút đánh giá */}
                <div className="text-end mt-2 mb-3">
                    <button className="btn btn-primary" onClick={() => setShowDetailModal(true)}
                            disabled={reviews.some((review) => review.userId === userId)}>
                        {reviews.some((review) => review.userId === userId) ? "Bạn đã đánh giá" : "Viết đánh giá & bình luận"}
                    </button>
                </div>
                {/* Khu vực bình luận */}
                {reviews.length === 0 ? (
                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                ) : (
                    <div
                        style={{
                            maxHeight: (reviews.length > 3) ? "400px" : "auto",
                            overflowY: (reviews.length > 3) ? "auto" : "visible",
                        }}
                    >
                        {reviews.slice(0, 3).map((review) => (
                            <div
                                key={review.reviewId}
                                className="border p-3 mb-3 rounded shadow-sm"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <img
                                            src={defaultAvatar}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{width: 40, height: 40}}
                                        />
                                        <strong>
                                            {review.userId === userId ? "Bạn" : "Người dùng"}
                                        </strong>
                                    </div>
                                    <span>{renderStars(review.rating)}</span>
                                </div>
                                <p className="mb-1">{review.reviewText}</p>
                                <small className="text-muted">
                                    {new Date(review.createdAt).toLocaleString("vi-VN")}
                                </small>
                            </div>
                        ))}
                    </div>
                )}

                {userId !== null && (
                    <ModalReview
                        show={showDetailModal}
                        onHide={() => setShowDetailModal(false)}
                        productId={productId}
                        userId={userId}
                        onReviewSuccess={fetchReviews}
                    />
                )}
            </div>


            {/* Modal hiển thị chi tiết sản phẩm */}
            {product && (
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
                                            src={product.productImage}
                                            alt={product.name}
                                            className="img-fluid rounded-circle"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                marginRight: "15px"
                                            }}
                                        />
                                        <div>
                                            <h5>{product.name}</h5>
                                            <p className="text-danger fw-bold">{product.price.toLocaleString()} VND</p>
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
};

export default ProductDetail;
