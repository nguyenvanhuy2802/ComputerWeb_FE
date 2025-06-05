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
            onReviewSuccess(); // để reload lại danh sách review
            onHide();
        } catch (err) {
            alert("Lỗi khi gửi đánh giá.");
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Viết đánh giá & bình luận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <strong>Đánh giá:</strong>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`fa-star ${
                                    (hover || rating) >= star ? "fas text-warning" : "far text-muted"
                                } me-1`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                style={{ cursor: "pointer" }}
                            />
                        ))}
                    </div>
                </div>
                <Form.Group controlId="reviewText" className="mb-3">
                    <Form.Label>Bình luận</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Nhập cảm nhận của bạn..."
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button
                    variant="primary"
                    disabled={rating === 0 || reviewText.trim() === ""}
                    onClick={handleSubmit}
                >
                    Đánh giá
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReview;
