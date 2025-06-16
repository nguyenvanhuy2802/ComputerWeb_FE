import React, {useEffect, useState} from "react";
import "../css/result.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Product} from "../types/Product";
import {getProductById, searchProductWithRating} from "../api/productApi";
import {useCart} from "../context/CartContext";
import {useUser} from "../context/UserContext";
import {saveCartItem} from "../api/cartItemApi";
import {toast} from "react-toastify";
import {Item} from "../types/CartItem";
import FilterBar from "./FilterBar";
import {useRequireLogin} from "../hooks/useRequireLogin";

interface EnrichedItem extends Item {
    product?: Product;
}

const Result: React.FC = () => {
    const location = useLocation();
    const [products, setProducts] = useState<Product[]>([]);
    const query = new URLSearchParams(location.search).get("query");
    const [averageRatings, setAverageRatings] = useState<{ [key: number]: number }>({});
    const [reviewCounts, setReviewCounts] = useState<{ [key: number]: number }>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [modalAction, setModalAction] = useState<"buy" | "add-to-cart">("buy");
    const {refreshCartCount} = useCart();
    const {cart} = useUser();
    const navigate = useNavigate();
    const [priceRange, setPriceRange] = useState("");
    const [sortBy, setSortBy] = useState("");
    const requireLogin = useRequireLogin();


    const handleShowModal = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

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

    useEffect(() => {
        const fetchProducts = async () => {
            if (query) {
                try {
                    const list = await searchProductWithRating(query, priceRange, sortBy);
                    setProducts(list);
                } catch (err) {
                    console.error("Lỗi tìm kiếm:", err);
                }
            }
        };
        fetchProducts();
    }, [query, priceRange, sortBy]);


    return (
        <div className="container search-wrapper">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-white shadow-sm p-3 rounded">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            Trang chủ
                        </Link>
                    </li>

                    <li className="breadcrumb-item active" aria-current="page">
                        Kết quả tìm kiếm : "{query}"
                    </li>
                </ol>
            </nav>
            <h2>Kết quả tìm kiếm cho: "{query}"</h2>

            <FilterBar
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <section className="mt-5">
                <h2 className="mb-5 text-center fw-bold">Danh Sách Sản Phẩm</h2>
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
                                        <h5 className="card-title" translate="no">{p.name}</h5>
                                        <div className="rating mb-2">
                                            <div className="d-flex align-items-center mb-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i translate="no"
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
                                            <small className="text-muted" translate="no">
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
                                        <img translate="no"
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
                                            <h5 translate="no">{selectedProduct.name}</h5>
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
                                    <button type="button" className="btn btn-secondary"
                                            onClick={handleCloseModal}>Hủy
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
export default Result;