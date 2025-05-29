import React, {useEffect, useState} from "react";
import {deleteCartItem, getCartItemsByCartId} from "../api/cartItemApi";
import {getProductById} from "../api/productApi";
import {useUser} from "../context/UserContext";
import {CartItem} from "../types/CartItem";
import {Product} from "../types/Product";
import {toast} from "react-toastify";
import {ClipLoader} from "react-spinners";
import {updateCartItem} from "../api/cartItemApi";
import "../css/cart.css";
import {Link, useNavigate} from "react-router-dom";
import {useCart} from "../context/CartContext";

interface EnrichedCartItem extends CartItem {
    product?: Product;
}

const Cart: React.FC = () => {
    const {cart, loading} = useUser();
    const [cartItems, setCartItems] = useState<EnrichedCartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [inputQuantities, setInputQuantities] = useState<{ [key: number]: string }>({});
    const {refreshCartCount} = useCart();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchItems = async () => {
            if (!cart) return;
            try {
                const items = await getCartItemsByCartId(cart.cartId);
                const enrichedItems: EnrichedCartItem[] = await Promise.all(
                    items.map(async (item: CartItem) => {
                        try {
                            const product = await getProductById(item.productId);
                            console.log("Product fetched: ", product);
                            return {...item, product};
                        } catch (err) {
                            console.error(`Error loading product ${item.productId}`, err);
                            return {...item};
                        }
                    })
                );

                setCartItems(enrichedItems);
            } catch (error) {
                toast.error("Lỗi khi tải giỏ hàng");
                console.error(error);
            }
        };

        fetchItems();
    }, [cart]);

    useEffect(() => {
        const total = cartItems
            .filter(item => selectedItems.includes(item.cartItemId) && item.product)
            .reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
        setTotalPrice(total);
    }, [cartItems, selectedItems]);

    const handleCheckboxChange = (cartItemId: number) => {
        setSelectedItems(prev =>
            prev.includes(cartItemId)
                ? prev.filter(id => id !== cartItemId)
                : [...prev, cartItemId]
        );
    };


    const handleQuantityChange = async (cartItemId: number, quantity: number) => {
        try {
            // Cập nhật UI
            setCartItems(prev =>
                prev.map(item =>
                    item.cartItemId === cartItemId ? {...item, quantity} : item
                )
            );
            await updateCartItem(cartItemId, quantity);
            toast.success("Cập nhật số lượng thành công");
        } catch (error) {
            toast.error("Lỗi khi cập nhật số lượng");
            console.error(error);
        }
    };

    const handleDelete = async (cartItemId: number) => {
        try {
            await deleteCartItem(cartItemId);
            await refreshCartCount();
            setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
            console.error(error);
        }
    };

    const handleCheckout = async () => {
        const selectedCartItems = cartItems.filter(item =>
            selectedItems.includes(item.cartItemId)
        );
        navigate("/payment", {
            state: {
                cartItems: selectedCartItems,
                many: true
            },
        });
    };


    const formatCurrency = (value: number): string =>
        value.toLocaleString("vi-VN", {style: "currency", currency: "VND"});

    if (loading) {
        return (
            <div className="text-center mt-5">
                <ClipLoader color="#36d7b7" loading={true} size={50}/>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-white shadow-sm p-3 rounded">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            Trang chủ
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Giỏ hàng của bạn
                    </li>
                </ol>
            </nav>

            <h2 className="mb-4 fw-bold text-dark">🛒 Giỏ Hàng Của Bạn</h2>

            {cartItems.length > 0 ? (
                <>
                    <div className="table-responsive shadow-sm rounded bg-white p-3">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark text-center">
                            <tr>
                                <th>#</th>
                                <th>Chọn</th>
                                <th>Sản Phẩm</th>
                                <th>Số Lượng</th>
                                <th>Giá</th>
                                <th>Thành Tiền</th>
                                <th>Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={item.cartItemId} className="text-center align-middle"
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.cartItemId)}
                                            onChange={() => handleCheckboxChange(item.cartItemId)}
                                            style={{width: 24, height: 24, cursor: "pointer"}}
                                        />

                                    </td>
                                    <td className="text-start d-flex align-items-center">
                                        {item.product ? (
                                            <>
                                                <img
                                                    src={item.product.productImage}
                                                    alt={item.product.name}
                                                    className="rounded shadow-sm me-2"
                                                    style={{width: 50, height: 50, objectFit: "cover"}}
                                                />
                                                <span>{item.product.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-muted">Không có thông tin sản phẩm</span>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={inputQuantities[item.cartItemId] ?? item.quantity.toString()}
                                            min={1}
                                            className="form-control text-center"
                                            style={{width: 80}}
                                            onChange={e => {
                                                const newValue = e.target.value;
                                                setInputQuantities(prev => ({
                                                    ...prev,
                                                    [item.cartItemId]: newValue,
                                                }));
                                            }}
                                            onBlur={e => {
                                                const parsed = parseInt(e.target.value);
                                                if (!isNaN(parsed) && parsed > 0) {
                                                    handleQuantityChange(item.cartItemId, parsed);
                                                }
                                                setInputQuantities(prev => ({
                                                    ...prev,
                                                    [item.cartItemId]: parsed > 0 ? parsed.toString() : item.quantity.toString(),
                                                }));
                                            }}
                                        />
                                    </td>
                                    <td>{item.product ? formatCurrency(item.product.price) : "—"}</td>
                                    <td>{item.product ? formatCurrency(item.product.price * item.quantity) : "—"}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(item.cartItemId)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link to="/" className="btn btn-outline-secondary">
                            <i className="bi bi-arrow-left"></i> Tiếp tục mua hàng
                        </Link>

                        <h4 className="mb-0">
                            Tổng Cộng:{" "}
                            <strong className="text-success">{formatCurrency(totalPrice)}</strong>
                        </h4>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn btn-success btn-lg"
                            onClick={handleCheckout}
                            disabled={selectedItems.length === 0}
                        >
                            Tiến Hành Thanh Toán
                        </button>
                    </div>
                </>
            ) : (
                <div className="alert alert-warning shadow-sm">Giỏ hàng của bạn đang trống.</div>
            )}
        </div>

    );
};

export default Cart;
