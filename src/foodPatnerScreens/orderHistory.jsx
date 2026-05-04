import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import axios from 'axios';
import { fetchFoodPatnerOrder } from '../store/reducer/order.js';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
    const { foodPatnerOrder } = useSelector((state) => state.order);
    const { FoodPatner } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const fetchOrder = async () => {
        try {
            // Updated URL to match your partner orders route
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/order/food-partner/${FoodPatner._id}`, 
                { withCredentials: true }
            );
            if (res.data.success) {
                // Dispatching the new structure: [{ orderId, partnerItems, partnerSubtotal, customer, etc. }]
                dispatch(fetchFoodPatnerOrder(res.data.orders));
                toast.success(res.data.message || "Orders updated");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch partner orders');
        }
    };

    useEffect(() => {
        if (FoodPatner?._id) {
            fetchOrder();
        }
    }, [FoodPatner?._id]);

    return (
        <div className="partner-orders-wrapper">
            <header className="page-header">
                <h1>Incoming Orders</h1>
                <p>Manage your restaurant's active and past orders</p>
            </header>

            <div className="orders-grid">
                {foodPatnerOrder && foodPatnerOrder.length === 0 ? (
                    <div className="no-orders">No orders received yet.</div>
                ) : (
                    foodPatnerOrder?.map((order) => (
                        <div key={order.orderId} className="partner-order-card">
                            <div className="card-top">
                                <div className="customer-chip">
                                    <span className="user-icon">👤</span>
                                    <div>
                                        <h4>{order.customer?.fullName}</h4>
                                        <p>{order.customer?.email}</p>
                                    </div>
                                </div>
                                <span className={`order-status-badge ${order.status?.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="shipping-info">
                                <strong>Delivery To:</strong>
                                <p>{order.shippingAddress}</p>
                            </div>

                            <div className="partner-items-list">
                                {order.partnerItems?.map((item) => (
                                    <div key={item._id} className="partner-item-row">
                                        <div className="item-main">
                                            <span className="qty-badge">{item.quantity}x</span>
                                            <span className="item-name">{item.name}</span>
                                        </div>
                                        <span className="item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="card-footer">
                                <div className="earnings-box">
                                    <span>Your Earnings</span>
                                    <h3>₹{order.partnerSubtotal}</h3>
                                </div>
                                <div className="time-box">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;