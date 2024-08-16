import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { userId, cart, addToCart, removeFromCart } = useContext(AppContext);
    const [localCart, setLocalCart] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    useEffect(() => {
        setLocalCart(cart);
        calculateTotalAmount(cart);
    }, [cart]);

    const fetchCartItems = async () => {
        try {
            const response = await api.get(`/cart/${userId}`, { withCredentials: true });
            const fetchedCart = response.data;
            setLocalCart(fetchedCart);
            
            // Delay the calculation of total amount by 1 second
            setTimeout(() => {
                calculateTotalAmount(fetchedCart);
            }, 1000);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error('Error fetching cart items.');
        }
    };

    const calculateTotalAmount = (cartItems = localCart) => {
        const total = cartItems.reduce((acc, item) => {
            if (item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
                return acc + item.product.price * item.quantity;
            }
            return acc;
        }, 0);
        setTotalAmount(total);
    };
    const handleQuantityChange = async (cartId, quantity) => {
        try {
            console.log(`Attempting to update quantity for cart item with ID ${cartId} to ${quantity}`);
            if (quantity < 1) {
                setFeedbackMessage('Quantity must be at least 1.');
                console.log('Quantity must be at least 1.');
                return;
            }
    
            await api.put(`/cart/${cartId}?quantity=${quantity}`, {}, { withCredentials: true });
    
            console.log('Quantity updated on server successfully');
    
            const updatedCart = localCart.map(item =>
                item.id === cartId ? { ...item, quantity } : item
            );
            console.log('Updated local cart:', updatedCart);
    
            setLocalCart(updatedCart);
            console.log('Local cart state updated');
    
            calculateTotalAmount(updatedCart); // Recalculate total amount
            console.log('Total amount recalculated');
    
            // Update global context cart
            addToCart(updatedCart.find(item => item.id === cartId));
            console.log('Global context cart updated');
    
            setFeedbackMessage('Quantity updated successfully!');
            toast.success('Quantity updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
            setFeedbackMessage('Error updating quantity.');
            toast.error('Error updating quantity.');
        }
    };
    
    const handleRemoveFromCart = async (cartId) => {
        try {
            await removeFromCart(cartId); // Use context function to remove item
            const updatedCart = localCart.filter(item => item.id !== cartId);
            setLocalCart(updatedCart);
            calculateTotalAmount(updatedCart); // Recalculate total amount
            // Optionally re-fetch cart to ensure consistency
            // fetchCartItems();
            toast.success('Item removed from cart.');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Error removing item from cart.');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { totalAmount, cart: localCart } });
    };

    return (
        <div className="cart">
            <h1>Cart</h1>
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
            {localCart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {localCart.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.product.imgSrc} alt={item.product.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.product.name}</h3>
                                <p>₹ {item.product.price}</p>
                                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                                <input
                                    type="number"
                                    id={`quantity-${item.id}`}
                                    value={item.quantity || 1} // Default to 1 if quantity is undefined
                                    min="1"
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                />
                                <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h2>Total Amount: ₹ {totalAmount.toFixed(2)}</h2>
                    </div>
                </div>
            )}
            {localCart.length > 0 && (
                <button className="checkout-button" onClick={handleCheckout}>
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
};

export default Cart;
