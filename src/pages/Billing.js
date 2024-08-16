import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../styles/Billing.css';
import { AppContext } from '../context/AppContext';

const Billing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, clearCart } = useContext(AppContext);
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
    });

    const { totalAmount, selectedAddress, cart , directCart  } = location.state || {};
    const products = cart.length > 0 ? cart : directCart;

    useEffect(() => {
        console.log('Cart:', cart);
        console.log('DirectCart:', directCart);
        console.log('Products:', products);
    }, [cart, directCart, products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo({
            ...paymentInfo,
            [name]: value,
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        // Validate that products array is properly structured
        if (!Array.isArray(products) || products.length === 0 || (!products[0].id && !products[0].product.id)) {
            toast.error('Invalid cart data.');
            console.log('Products array is invalid:', products);
            return;
        }

        try {
            const orderPayload = {
                totalAmount,
                orderDate: new Date().toISOString(),
                status: 'Pending',
                address: {
                    id: selectedAddress,
                },
                products: products.map(item => ({ id: item.product ? item.product.id : item.id })),
            };

            console.log('Order Payload:', orderPayload);
            const response = await api.post(`/orders/user/${userId}`, orderPayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await clearCart();

            toast.success('Payment successful!');
            navigate('/order-summary', { state: { order: response.data, cart: products } });
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Error processing payment.');
        }
    };

    const formatAmount = (amount) => {
        if (isNaN(amount)) {
            return '₹0';
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="billing">
            <h1>Billing Information</h1>
            <h2>Total Amount: {formatAmount(totalAmount)}</h2>
            <form onSubmit={handlePayment}>
                <label>
                    Card Number:
                    <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Expiry Date:
                    <input
                        type="date"
                        name="cardExpiry"
                        value={paymentInfo.cardExpiry}
                        onChange={handleInputChange}
                        required
                        min={today} // Ensure the expiry date is not before today
                    />
                </label>
                <label>
                    CVC:
                    <input
                        type="text"
                        name="cardCvc"
                        value={paymentInfo.cardCvc}
                        onChange={handleInputChange}
                        required
                        maxLength="3" // Limit CVV to 3 digits
                        pattern="\d{3}" // Ensure CVV contains only digits
                    />
                </label>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Billing;
