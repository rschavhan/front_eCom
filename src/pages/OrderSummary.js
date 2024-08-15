import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'; // Import AppContext
import '../styles/OrderSummary.css';

const OrderSummary = () => {
    const location = useLocation();
    const { userId } = useContext(AppContext); // Get userId from context
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/orders/user/${userId}/details`);
                console.log("Orders fetched:", response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    // Sort orders by date descending
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
                            {/* Removed Order ID display */}
                            <h2>Order Number: {index + 1}</h2> {/* Displaying order number as a normal integer */}
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
                                           
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available for this order.</p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderSummary;
