import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../store/reducer/auth.js';
import { useState } from 'react'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/header.css';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const { user, FoodPatner } = useSelector((state) => state.auth);
    
    // cartData now uses the grouped structure: { totalAmount, groupedItems }
    const { items: cartData } = useSelector((state) => state.cart);

    const HandleLogout = async () => {
        const userUrl = `${import.meta.env.VITE_BACKEND_URL}/user/logout`;
        const partnerUrl = `${import.meta.env.VITE_BACKEND_URL}/user/logout-food-partner`;

        try {
            if (user) {
                await axios.get(userUrl, { withCredentials: true });
            } else if (FoodPatner) {
                await axios.get(partnerUrl, { withCredentials: true });
            }
            dispatch(logOut());
            setIsMenuOpen(false);
            toast.success('Logout successful!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };

    // Calculate total items across all groups for the badge
    const totalCartItems = cartData?.groupedItems?.reduce((sum, group) => {
        return sum + group.items.length;
    }, 0) || 0;

    return (
        <nav className="navbar">
            <Link to={'/'} className="nav-logo-link" onClick={() => setIsMenuOpen(false)}>
                <div className="nav-brand">
                    Food<span>Reel</span>
                </div>
            </Link>

            <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className={isMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMenuOpen ? "bar open" : "bar"}></span>
                <span className={isMenuOpen ? "bar open" : "bar"}></span>
            </div>

            <div className={`nav-actions ${isMenuOpen ? "active" : ""}`}>
                {/* 1. If USER is logged in: Show Orders, Cart, and Logout */}
                {user && (
                    <>
                        <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            My Orders
                        </Link>
                        <div className="cart-icon-wrapper" onClick={() => setIsMenuOpen(false) || navigate('/cart')}>
                            <div className="cart-badge-container">
                                {totalCartItems > 0 && (
                                    <span className="cart-badge">{totalCartItems}</span>
                                )}
                                <span className="cart-icon">🛒 cart</span>
                            </div>
                        </div>
                        <div className="user-section" onClick={()=> navigate(`/user-profile/${user.id}`) || setIsMenuOpen(false)}>
                            <span className="user-name">Hi, {user.fullName.split(' ')[0]}</span>
                            <button onClick={HandleLogout} className="logout-btn">Logout</button>
                        </div>
                    </>
                )}

                {/* 2. If FOOD PARTNER is logged in: Show only Name and Logout */}
                {FoodPatner && (
                    <div className="user-section" onClick={()=> navigate(`/user-profile/${FoodPatner._id}`) || setIsMenuOpen(false)}>
                        <span className="user-name">Hi, {FoodPatner.fullName.split(' ')[0]}</span>
                        <button onClick={HandleLogout} className="logout-btn">Logout</button>
                    </div>
                )}

                {/* 3. If NO ONE is logged in: Show Login */}
                {!user && !FoodPatner && (
                    <div className="login-link" onClick={() => setIsMenuOpen(false) || navigate('/login')}>
                        Login
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;