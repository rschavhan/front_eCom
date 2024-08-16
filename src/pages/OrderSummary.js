import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'; 
import '../styles/OrderSummary.css';

const StarRating = ({ rating, onChange }) => {
    const handleClick = (value) => {
        onChange(value);
    };

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

const OrderSummary = () => {
    const { userId, userName } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewInputs, setReviewInputs] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/orders/user/${userId}/details`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                    setOrders(sortedOrders);
                } else {
                    toast.error('No orders found.');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Error fetching orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await api.put(`/orders/${orderId}/status`, null, {
                params: { status: "Cancelled" }
            });
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: "Cancelled" } : order
            ));
            toast.success('Order cancelled successfully.');
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Failed to cancel the order.');
        }
    };

    const handleReviewChange = (e, productId) => {
        const { name, value } = e.target;
        setReviewInputs(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                [name]: value
            }
        }));
    };

    const handleStarRatingChange = (productId, value) => {
        setReviewInputs(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                rating: value
            }
        }));
    };

    const handleAddReview = async (productId, orderId) => {
        const review = reviewInputs[productId];
        if (!review || !review.comment || !review.rating) {
            toast.error('Please fill in all fields.');
            return;
        }
    
        const reviewData = {
            ...review,
            reviewerName: userName,
            userId,
            rating: parseInt(review.rating, 10) // Ensure the rating is an integer
        };
    
        try {
            // Send the review data to the backend
            await api.post(`/products/${productId}/reviews`, reviewData);
            
            // Clear the review input for this product
            setReviewInputs(prevState => ({
                ...prevState,
                [productId]: {
                    comment: '',
                    rating: 0
                }
            }));
            
            toast.success('Review added successfully.');
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Failed to add the review.');
        }
    };
    

    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-summary">
            <h1>Order Summary</h1>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map((order, index) => (
                    <div key={order.id} className="order-details">
                        <div className="order-header">
                            <h2>Order Number: {index + 1}</h2> 
                            <p><strong>Total Amount:</strong> ₹ {order.totalAmount !== null ? order.totalAmount.toFixed(2) : 'N/A'}</p>
                            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p className="status"><strong>Status:</strong> {order.status}</p>
                            <p className="address"><strong>Address:</strong> 
                                {order.addressDTO ? (
                                    <span>
                                        {order.addressDTO.addressLine1}, {order.addressDTO.city}, {order.addressDTO.state}, {order.addressDTO.postalCode}, {order.addressDTO.country}
                                    </span>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div className="products-section">
                            <h3>Products in this Order:</h3>
                            {order.productsDTO && order.productsDTO.length > 0 ? (
                                order.productsDTO.map(product => (
                                    <div key={product.id} className="product-item">
                                        <img src={product.imgSrc} alt={product.name} />
                                        <div>
                                            <p>{product.name}</p>
                                            <p>Price: ₹ {product.price.toFixed(2)}</p>
                                            <div className="review-section">
                                                <textarea 
                                                    name="comment"
                                                    placeholder="Write your review..."
                                                    value={reviewInputs[product.id]?.comment || ''}
                                                    onChange={(e) => handleReviewChange(e, product.id)}
                                                />
                                                <StarRating 
                                                    rating={reviewInputs[product.id]?.rating || 0}
                                                    onChange={(value) => handleStarRatingChange(product.id, value)}
                                                />
                                                <button onClick={() => handleAddReview(product.id, order.id)}>
                                                    Submit Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available for this order.</p>
                            )}
                        </div>
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                            <button 
                                className="cancel-order-button" 
                                onClick={() => handleCancelOrder(order.id)}
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderSummary;
