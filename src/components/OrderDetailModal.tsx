import React, {useEffect, useState} from "react";
import {Modal, Button, Image} from "react-bootstrap";
import {OrderItem} from "../types/OrderItem";
import {getProductById} from "../api/productApi";
import {Product} from "../types/Product";

interface OrderDetailModalProps {
    show: boolean;
    onClose: () => void;
    orderId: number | null;
    orderItems: OrderItem[];
}


interface OrderItemWithProduct extends OrderItem {
    product?: Product;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({show, onClose, orderId, orderItems}) => {
    const [detailedItems, setDetailedItems] = useState<OrderItemWithProduct[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const itemsWithProduct: OrderItemWithProduct[] = await Promise.all(orderItems.map(async (item) => {
                try {
                    const product = await getProductById(item.productId);
                    return {...item, product};
                } catch (error) {
                    return {...item};
                }
            }));
            setDetailedItems(itemsWithProduct);
        };

        if (orderItems.length > 0) {
            fetchProducts();
        }
    }, [orderItems]);
    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Chi tiết đơn hàng #{orderId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {detailedItems.length === 0 ? (
                    <p>Không có sản phẩm nào trong đơn hàng này.</p>
                ) : (
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detailedItems.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    {item.product ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <Image
                                                src={item.product.productImage}
                                                alt={item.product.name}
                                                width={60}
                                                height={60}
                                                rounded
                                                style={{objectFit: "cover"}}
                                            />
                                            <span>{item.product.name}</span>
                                        </div>
                                    ) : (
                                        <span>Không tìm thấy sản phẩm</span>
                                    )}
                                </td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toLocaleString()}₫</td>
                                <td>{(item.quantity * item.price).toLocaleString()}₫</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailModal;
