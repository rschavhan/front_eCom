import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, cart } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [localCart, setLocalCart] = useState([]);

    useEffect(() => {
        fetchAddresses();
        if (location.state) {
            const { totalAmount, directCart } = location.state;
            setTotalAmount(totalAmount || 0);
            setLocalCart(directCart || cart || []);
        }
    }, [location.state, cart]);

    const fetchAddresses = async () => {
        try {
            const response = await api.get(`/addresses/user/${userId}`);
            if (response.data.length > 0) {
                setAddresses(response.data);
                setShowAddressForm(false); // Hide form if addresses exist
            } else {
                setShowAddressForm(true); // Show form if no addresses exist
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Error fetching addresses.');
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: value,
        });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...newAddress,
            userId: userId,
        };
        try {
            const response = await api.post('/addresses', payload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setAddresses([...addresses, response.data]);
            setNewAddress({
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
            });
            setShowAddressForm(false);
            toast.success('Address added successfully!');
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error('Error adding address.');
        }
    };

    const handleCheckout = () => {
        if (!selectedAddress) {
            toast.error('Please select an address for checkout.');
            return;
        }
        console.log("checkout cart :",cart);
        navigate('/billing', { state: { totalAmount, selectedAddress, cart: localCart } });
    };

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-content">
                {showAddressForm ? (
                    <div>
                        <h2>Add Address</h2>
                        <form onSubmit={handleAddressSubmit}>
                            <div>
                                <label>Address Line 1</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={newAddress.addressLine1}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Address Line 2</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={newAddress.addressLine2}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={newAddress.postalCode}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={newAddress.country}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <button type="submit">Save Address</button>
                            <button type="button" onClick={() => setShowAddressForm(false)}>Cancel</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        {addresses.length > 0 ? (
                            <div>
                                <h2>Select Address</h2>
                                {addresses.map((address) => (
                                    <div key={address.id} className="address-item">
                                        <input
                                            type="radio"
                                            id={`address-${address.id}`}
                                            name="selectedAddress"
                                            value={address.id}
                                            checked={selectedAddress === address.id}
                                            onChange={() => setSelectedAddress(address.id)}
                                        />
                                        <label htmlFor={`address-${address.id}`}>
                                            <p>{address.addressLine1}</p>
                                            <p>{address.addressLine2}</p>
                                            <p>{address.city}, {address.state} {address.postalCode}</p>
                                            <p>{address.country}</p>
                                        </label>
                                    </div>
                                ))}
                                <button onClick={() => setShowAddressForm(true)}>Add New Address</button>
                                <button onClick={handleCheckout}>Proceed to Checkout</button>
                            </div>
                        ) : (
                            <div>
                                <h2>Add Address</h2>
                                <form onSubmit={handleAddressSubmit}>
                                    {/* Form fields here */}
                                    <button type="submit">Save Address</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
