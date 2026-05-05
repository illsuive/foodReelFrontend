import { useRef, useEffect, use } from "react";
import '../styles/userHomePage.css'
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setReels, handleLike } from '../store/reducer/food.js'
import { fetchCart } from '../store/reducer/cart.js'

const UserHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { reels } = useSelector((state) => state.food);
    // 1. cartData now contains { userId, totalAmount, groupedItems }
    const { items: cartData } = useSelector((state) => state.cart);

    const videoRefs = useRef([]);

    const fetchAllReels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/food/all` , { withCredentials: true });
            if (res.data.success) {
                dispatch(setReels(res.data.foods));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch reels');
        }
    }

    const handleAddToCart = async (reel) => {
        try {
            const payload = {
                foodId: reel._id,
                name: reel.name,
                price: reel.price,
                foodPartner: reel.foodPartner._id
            }
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/add`, payload, { withCredentials: true });
            if (res.data.success) {
                dispatch(fetchCart(res.data.cart));
                toast.success('Added to cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    }

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

    const handleLikeUnlike = async (reel) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/food/like-food`, { foodId : reel._id }, { withCredentials: true });
            if (res.data.success) {
                dispatch(handleLike({
                    foodId : reel._id,
                    isLiked: res.data.isLiked,
                    likesCount: res.data.likesCount
                }));
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to like');
        }
    }

    useEffect(() => {
        fetchAllReels();
    }, []);

    useEffect(() => {
        const observerOptions = { root: null, threshold: 0.8 };
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            });
        };
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });
        return () => observer.disconnect();
    }, [reels]);

    const openProfile = (partnerId) => {
        navigate(`/profile/${partnerId}`);
    }

    return (
        <div className="reels-container">
            {reels?.map((reel, index) => {
                // 2. FIX: Find the item within the nested groupedItems array
                let quantity = 0;
                if (cartData?.groupedItems) {
                    // Search through each group's items to find the current reel
                    cartData.groupedItems.forEach(group => {
                        const foundItem = group.items.find(item =>
                            (item.foodId?._id || item.foodId) === reel._id
                        );
                        if (foundItem) quantity = foundItem.quantity;
                    });
                }

                return (
                    <div key={reel._id} className="reel-section">
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={reel.video}
                            className="reel-video"
                            loop
                            playsInline
                            muted
                            onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
                        />

                        <div className="reel-overlay">
                            <div className="reel-content">
                                <div className="partner-info" onClick={() => openProfile(reel.foodPartner?._id)}>
                                    <img
                                        src={reel.foodPartner?.profileImage || `https://ui-avatars.com/api/?name=${reel.foodPartner?.fullName}`}
                                        alt="profile"
                                        className="profile-img"
                                    />
                                    <div className="partner-text">
                                        <h3 className="partner-name">{reel.foodPartner?.fullName}</h3>
                                        <span className="visit-tag">Visit Store</span>
                                    </div>
                                </div>

                                <div className="food-details">
                                    <h2 className="food-name">{reel.name}</h2>
                                    <p className="reel-desc">{reel.description}</p>
                                    <div className="reel-meta">
                                        <span className="category-tag">#{reel.category}</span>
                                        <span className="price-tag">₹{reel.price}</span>
                                    </div>
                                </div>

                                <div className="cart-action-area">
                                    {quantity === 0 ? (
                                        <button className="main-add-btn" onClick={() => handleAddToCart(reel)}>
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <div className="reel-counter">
                                            <button onClick={() => handleCartAction("reduce", reel._id)}>−</button>
                                            <span className="qty-text">{quantity}</span>
                                            <button onClick={() => handleCartAction("increase", reel._id)}>+</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="reel-actions">
                                <div className="action-item">
                                    <div className="icon-circle" onClick={() => handleLikeUnlike(reel)}>
                                       {reel.isLiked ? '❤️' : '🤍'}
                                    </div>
                                    <span className="action-text">{reel.likes?.length || 0}</span>
                                </div>
                                <div className="action-item">
                                    <div className="icon-circle">{reel.isSaved ? '🔖' : '📁'}</div>
                                    <span className="action-text">Save</span>
                                </div>
                                <div className="action-item">
                                    <div className="icon-circle">✈️</div>
                                    <span className="action-text">Share</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserHomePage;