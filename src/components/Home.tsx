import React, {useEffect, useState} from "react";
import {Category} from "../types/Category";
import {Product} from "../types/Product";
import {getAllCategories} from "../api/categoryApi";
import {getPaginatedProducts, getProductById} from "../api/productApi";
import {Link, useNavigate} from "react-router-dom";
import "../css/home.css";
import {getAverageRatingByProductId, getReviewCountByProductId} from "../api/reviewApi";
import {saveCartItem} from "../api/cartItemApi";
import {toast} from "react-toastify";
import {useCart} from "../context/CartContext";
import {useUser} from "../context/UserContext";
import {Item} from "../types/CartItem";
import {useRequireLogin} from "../hooks/useRequireLogin";

interface EnrichedItem extends Item {
    product?: Product;
}

const Home: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [averageRatings, setAverageRatings] = useState<{ [key: number]: number }>({});
    const [reviewCounts, setReviewCounts] = useState<{ [key: number]: number }>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [modalAction, setModalAction] = useState<"buy" | "add-to-cart">("buy");
    const {refreshCartCount} = useCart();
    const {userId, cart} = useUser();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [hasMore, setHasMore] = useState(true);
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
        const fetchData = async () => {
            try {
                const catRes = await getAllCategories();
                setCategories(catRes);
                loadMoreProducts();
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    const loadMoreProducts = async () => {
        try {
            const data = await getPaginatedProducts(page, size);
            const newProducts: Product[] = data.content;
            const isLastPage: boolean = data.last;

            // Gộp sản phẩm mới vào danh sách cũ
            setProducts(prev => {
                const existingIds = new Set(prev.map(p => p.productId));
                const filteredNew = newProducts.filter(p => !existingIds.has(p.productId));
                return [...prev, ...filteredNew];
            });

            setHasMore(!isLastPage);
            setPage(prev => prev + 1);

            // Lấy rating cho sản phẩm mới
            const ratingsPromises = newProducts.map(p =>
                getAverageRatingByProductId(p.productId).then(rating => [p.productId, rating])
            );
            const ratingsEntries = await Promise.all(ratingsPromises);
            setAverageRatings(prev => ({...prev, ...Object.fromEntries(ratingsEntries)}));

            const countPromises = newProducts.map(p =>
                getReviewCountByProductId(p.productId).then(count => [p.productId, count])
            );
            const countEntries = await Promise.all(countPromises);
            setReviewCounts(prev => ({...prev, ...Object.fromEntries(countEntries)}));

        } catch (error) {
            console.error("Lỗi khi tải sản phẩm phân trang:", error);
        }
    };

    return (
        <div className="container home-container">
            {/* Mục danh mục sản phẩm */}
            <section>
                <h2 className="mb-5 text-center fw-bold">Danh Mục Sản Phẩm</h2>
                <div className="row g-4">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.categoryId} className="col-12 col-sm-6 col-md-4">
                                <Link
                                    to={`/category/${cat.categoryId}`}
                                    className="text-decoration-none"
                                >
                                    <div
                                        className="category-card shadow rounded overflow-hidden"
                                        style={{
                                            backgroundImage: `url('${cat.categoryImage}')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            height: "200px",
                                            display: "flex",
                                            alignItems: "flex-end",
                                            transition: "transform 0.3s ease",
                                        }}
                                    >
                                        <div className="card-title-container p-3 bg-dark bg-opacity-50 w-100">
                                            <h5 className="card-title text-white text-center" translate="no">{cat.name}</h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted">Không có danh mục sản phẩm nào.</div>
                    )}
                </div>
            </section>

            {/* Mục danh sách sản phẩm */}
            <section className="mt-5">
                <h2 className="mb-5 text-center fw-bold">Danh Sách Sản Phẩm</h2>
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div key={p.productId} className="col-12 col-sm-6 col-md-4">
                                <div className="card h-100 shadow border-0 rounded-3 product-card">
                                    <Link to={`/product/${p.productId}`} className="text-decoration-none">
                                        <img translate="no"
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

            <div className="text-center mt-4 position-relative">
                {hasMore && (
                    <div className="text-center mt-3">
                        <button onClick={loadMoreProducts} className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
                            <i className="fa fa-plus me-2"></i> Xem thêm
                        </button>
                    </div>
                )}

                {/* Nút lên đầu trang */}
                <button
                    className="btn btn-outline-secondary position-fixed"
                    onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                    style={{
                        bottom: "120px",
                        right: "20px",
                        borderRadius: "50%",
                        width: "48px",
                        height: "48px",
                        zIndex: 1000,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                    }}
                    title="Quay lên đầu trang"
                >
                    <i className="fa fa-arrow-up"></i>
                </button>
            </div>
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

export default Home;
