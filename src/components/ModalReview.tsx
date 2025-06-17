import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createReview } from "../api/reviewApi";
import { ReviewDTO } from "../types/Review";

interface ModalReviewProps {
    show: boolean;
    onHide: () => void;
    productId: number;
    userId: number;
    onReviewSuccess: () => void;
}

const ModalReview: React.FC<ModalReviewProps> = ({
                                                     show,
                                                     onHide,
                                                     productId,
                                                     userId,
                                                     onReviewSuccess,
                                                 }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const handleSubmit = async () => {
        const data: ReviewDTO = {
            productId,
            userId,
            rating,
            reviewText,
        };

        try {
            await createReview(data);
            onReviewSuccess();
            onHide();
        } catch (err) {
            alert("Lỗi khi gửi đánh giá.");
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>🌟 Viết đánh giá & bình luận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <strong className="d-block mb-2 fs-6 text-dark">Đánh giá của bạn:</strong>
                    <div className="d-flex">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const filled = hover ? hover >= star : rating >= star;
                            return (
                                <i
                                    key={star}
                                    className={`fa-star me-2 ${filled ? "fas text-warning" : "far text-muted"}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    style={{ cursor: "pointer", fontSize: "2rem" }}
                                />
                            );
                        })}
                    </div>
                </div>

                <Form.Group controlId="reviewText" className="mb-4">
                    <Form.Label className="fw-bold">Bình luận</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        className="shadow-sm"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>
                    ❌ Hủy
                </Button>
                <Button
                    variant="success"
                    disabled={rating === 0 || reviewText.trim() === ""}
                    onClick={handleSubmit}
                >
                    ✅ Gửi đánh giá
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReview;
