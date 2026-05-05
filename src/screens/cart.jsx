import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/reducer/cart.js';
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../styles/cart.css';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    // Accessing the new structure from Redux
    const { items: cartData, loading } = useSelector((state) => state.cart);
   
    
    const getCart = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart/get`, { withCredentials: true });
            if (res.data.success) {
                dispatch(fetchCart(res.data.cart));
            }
        } catch (error) {
            toast.error('Failed to fetch cart');
        }
    };

    const handleCartAction = async (action, foodId) => {
        try {
            const urls = {
                increase: `${import.meta.env.VITE_BACKEND_URL}/cart/increase`,
                reduce: `${import.meta.env.VITE_BACKEND_URL}/cart/reduce`,
                remove: `${import.meta.env.VITE_BACKEND_URL}/cart/remove`
            };

            const res = await axios.post(urls[action], { foodId }, { withCredentials: true });

            if (res.data.success) {
                dispatch(fetchCart(res.data.cart)); 
                if (action === 'remove') toast.success('Item removed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    useEffect(() => {
        getCart();
    }, [user]);

    if (loading) return <div className="loader">Loading your delicious picks...</div>;

    const groupedItems = cartData?.groupedItems || [];
    
    if (groupedItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <h1>Your cart is feeling light.</h1>
                <p>Add some food reels to get started!</p>
                <button className="continue-btn" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <h1 className="cart-title">Your Food Cart</h1>
            
            <div className="cart-layout">
                <div className="grouped-container">
                    {/* STEP 1: Map through different Food Partners */}
                    {groupedItems.map((group) => (
                        <div key={group.foodPartnerId} className="partner-section">
                            <div className="partner-header" onClick={() => navigate(`/profile/${group.foodPartnerId}`)}>
                                <div className="partner-info">
                                    <span className="shop-icon">🏪</span>
                                    <h2>{group.restaurantName}</h2>
                                </div>
                                <div className="partner-subtotal">
                                    Subtotal: <span>₹{group.partnerSubtotal}</span>
                                </div>
                            </div>

                            <div className="items-list">
                                {/* STEP 2: Map through items belonging to THIS partner */}
                                {group.items.map((item) => (
                                    <div key={item._id} className="cart-item-card">
                                        <div className="item-media">
                                            <video 
                                                src={item.foodId?.video} 
                                                muted loop 
                                                onMouseOver={e => e.target.play()} 
                                                onMouseOut={e => e.target.pause()} 
                                            />
                                        </div>

                                        <div className="item-info">
                                            <div className="info-top">
                                                <h3>{item.name}</h3>
                                                <button className="del-btn" onClick={() => handleCartAction('remove', item.foodId?._id)}>🗑️</button>
                                            </div>
                                            <p className="item-category">#{item.foodId?.category}</p>
                                            
                                            <div className="info-bottom">
                                                <span className="item-price">₹{item.price}</span>
                                                <div className="qty-picker">
                                                    <button onClick={() => handleCartAction('reduce', item.foodId?._id)}>−</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => handleCartAction('increase', item.foodId?._id)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h3>Summary</h3>
                        <div className="summary-row">
                            <span>User ID</span>
                            <span className="user-id-text">{cartData?.userId?.substring(0, 8)}...</span>
                        </div>
                        <div className="summary-row total">
                            <span>Grand Total</span>
                            <span>₹{cartData?.totalAmount}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => navigate('/address')}>Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;