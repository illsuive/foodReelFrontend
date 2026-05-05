import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setOrders } from '../store/reducer/order.js';
import '../styles/PaymentPage.css';

const PaymentPage = () => {
    const dispatch = useDispatch();
    const { orders: storedOrders } = useSelector((state) => state.order);
    console.log(storedOrders);
    
    const fetchOrder = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/user-orders`, { withCredentials: true });
            console.log(res.data.orders);
            if (res.data.success) {
                dispatch(setOrders(res.data.orders));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        }
    };
    
    console.log(storedOrders);
    
    useEffect(() => {
        fetchOrder();
    }, []);

    return (
        <div className="orders-page-wrapper">
            <div className="orders-container">
                <h1 className="page-title">Order History</h1>
                
                {storedOrders && storedOrders.length === 0 ? (
                    <div className="empty-orders">
                        <p>You haven't placed any orders yet. 🍕</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {storedOrders?.map((order) => (
                            <div key={order._id} className="order-card">
                                {/* Order Main Header */}
                                <div className="order-header">
                                    <div className="order-meta">
                                        <span className="order-id-label">ORDER ID</span>
                                        <h3 className="order-id">#{order.razorPay_order_id}</h3>
                                        <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-shipping">
                                        <span className="label">Delivery Address:</span>
                                        <p>{order.shipping}</p>
                                    </div>
                                </div>

                                {/* STEP 1: Map through Grouped Items (By Partner) */}
                                <div className="order-groups">
                                    {order.groupedItems?.map((group) => (
                                        <div key={group.foodPartnerId} className="partner-order-group">
                                            <p>{group.restaurantName}</p>
                                            <div className="partner-group-header">
                                                <h4>🏪 {group.restaurantName}</h4>
                                                <span className="partner-subtotal">Subtotal: ₹{group.partnerSubtotal}</span>
                                            </div>

                                            {/* STEP 2: Map through Items within this specific Group */}
                                            <div className="order-items">
                                                {group.items.map((item) => (
                                                    <div key={item._id} className="item-row">
                                                        {/* <div className="item-video-box">
                                                            <video 
                                                                src={item.foodId?.video} 
                                                                muted loop 
                                                                onMouseOver={(e) => e.target.play()} 
                                                                onMouseOut={(e) => e.target.pause()} 
                                                            />
                                                        </div> */}
                                                        <div className="item-details">
                                                            <h5>{item.name}</h5>
                                                            {/* <p className="item-desc">{item.foodId?.description?.substring(0, 60)}...</p> */}
                                                            <div className="item-meta">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span>₹{item.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="order-footer">
                                    <div className="total-box">
                                        <span className="label">Total Paid (Grand Total)</span>
                                        <span className="total-amount">₹{order.totalPrice || order.totalAmount}</span>
                                    </div>
                                    <span className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;