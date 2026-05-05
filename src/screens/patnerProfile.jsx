import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/reducer/cart.js';
import '../styles/PartnerProfile.css';

const PatnerProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    // Accessing the new structure: { userId, totalAmount, groupedItems }
    const { items: cartData } = useSelector((state) => state.cart);
    
    const [partnerProfile, setPartnerProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPartnerProfile = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/food-partner/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setPartnerProfile(res.data.foodPartner);
            }
        } catch (error) {
            toast.error('Failed to fetch partner profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (meal) => {
        try {
            // NEW: Added foodPartner to payload as required by your updated controller
            const payload = {
                foodId: meal._id,
                name: meal.name,
                price: meal.price,
                foodPartner: id // Using the 'id' from useParams
            };
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/add`, payload, { withCredentials: true });
            if (res.data.success) {
                dispatch(fetchCart(res.data.cart));
                toast.success('Added to cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleCartAction = async (action, foodId) => {
        try {
            const urls = {
                increase: `${import.meta.env.VITE_BACKEND_URL}/cart/increase`,
                reduce: `${import.meta.env.VITE_BACKEND_URL}/cart/reduce`,
            };

            const res = await axios.post(urls[action], { foodId }, { withCredentials: true });

            if (res.data.success) {
                dispatch(fetchCart(res.data.cart));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };
    
    useEffect(() => {
        fetchPartnerProfile();
    }, [id]);

    if (loading) return <div className="loading-spinner">Loading Profile...</div>;

    return (
        <div className="profile-container">
            {partnerProfile && (
                <>
                    <div className="profile-header">
                        <div className="header-glass">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${partnerProfile.restaurant}&background=random&size=128`} 
                                alt="Restaurant Logo" 
                                className="partner-logo"
                            />
                            <div className="partner-details">
                                <h1 className="restaurant-name">{partnerProfile.restaurant}</h1>
                                <p className="partner-address">📍 {partnerProfile.address}</p>
                                <div className="stats-bar">
                                    <div className="stat-item"><strong>{partnerProfile.totalMeals?.length}</strong> <span>Meals</span></div>
                                    <div className="stat-item"><strong>{partnerProfile.customers?.length}</strong> <span>Customers</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="meals-section">
                        <h2 className="section-title">Menu Reels</h2>
                        <div className="meals-grid">
                            {partnerProfile.totalMeals?.map((meal) => {
                                // FIX: Updated quantity logic to search through groupedItems
                                let quantity = 0;
                                if (cartData?.groupedItems) {
                                    cartData.groupedItems.forEach(group => {
                                        const foundItem = group.items.find(item => 
                                            (item.foodId?._id || item.foodId) === meal._id
                                        );
                                        if (foundItem) quantity = foundItem.quantity;
                                    });
                                }

                                return (
                                    <div key={meal._id} className="meal-card">
                                        <div className="video-container">
                                            <video 
                                                src={meal.video} 
                                                muted loop 
                                                onMouseOver={(e) => e.target.play()} 
                                                onMouseOut={(e) => e.target.pause()}
                                            />
                                            <div className="price-badge">₹{meal.price}</div>
                                        </div>
                                        
                                        <div className="meal-content">
                                            <h3>{meal.name}</h3>
                                            <p className="description">{meal.description}</p>
                                            
                                            <div className="card-footer">
                                                <span className="category">{meal.category}</span>
                                                
                                                <div className="cart-controls">
                                                    {quantity === 0 ? (
                                                        <button 
                                                            className="add-btn" 
                                                            onClick={() => handleAddToCart(meal)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    ) : (
                                                        <div className="counter-box">
                                                            <button onClick={() => handleCartAction('reduce', meal._id)}>−</button>
                                                            <span className="count">{quantity}</span>
                                                            <button onClick={() => handleCartAction('increase', meal._id)}>+</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PatnerProfile;