import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/OrderManager.css';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(prevState => ({ ...prevState, [orderId]: true }));
    try {
      await api.put(`/orders/${orderId}/status`, null, {
        params: { status: newStatus }
      });
      const updatedOrder = await fetchOrderById(orderId);
      if (updatedOrder) {
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(prevState => ({ ...prevState, [orderId]: false }));
    }
  };

  const handleCancelOrder = async (orderId) => {
    setUpdatingStatus(prevState => ({ ...prevState, [orderId]: true }));
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error canceling order:', error);
    } finally {
      setUpdatingStatus(prevState => ({ ...prevState, [orderId]: false }));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="order-manager">
      <h2>Order Manager</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Total Amount</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>₹ {order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>
                {updatingStatus[order.id] ? (
                  <span>Updating...</span>
                ) : (
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                )}
              </td>
              <td>
                {order.addressDTO ? (
                  <div>
                    <p>{order.addressDTO.addressLine1}</p>
                    <p>{order.addressDTO.city}, {order.addressDTO.state}, {order.addressDTO.postalCode}</p>
                    <p>{order.addressDTO.country}</p>
                  </div>
                ) : 'N/A'}
              </td>
              <td>
                {updatingStatus[order.id] ? (
                  <span>Updating...</span>
                ) : (
                  <button onClick={() => handleCancelOrder(order.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
