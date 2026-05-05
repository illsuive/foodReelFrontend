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
    
    // Using the grouped items structure from your cart
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
            
            // 1. Dispatch Logout to clear Redux
            dispatch(logOut());
            
            // 2. Clear persistence to prevent "previous user" data leakage
            localStorage.removeItem('persist:root');
            
            setIsMenuOpen(false);
            toast.success('Logout successful!');
            
            // 3. Force reload to login to ensure all state is wiped
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };

    // Calculate total unique items from grouped structure
    const cartCount = cartData?.groupedItems?.reduce((sum, group) => sum + group.items.length, 0) || 0;

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Company Logo */}
                <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
                    Food<span>Reel</span>
                </Link>

                {/* Mobile Toggle */}
                <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        /* --- USER NAVBAR --- */
                        <div className="nav-actions">
                            <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                            <div className="cart-wrapper" onClick={() => {navigate('/cart'); setIsMenuOpen(false)}}>
                                <span className="cart-icon">🛒</span>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </div>
                            <div className="user-profile-section" onClick={()=> navigate(`/user-profile/${user._id}`) || setIsMenuOpen(false)}>
                                <span className="user-name">Hi, {user.fullName?.split(' ')[0]}</span>
                                <button className="logout-btn" onClick={HandleLogout}>Logout</button>
                            </div>
                        </div>
                    ) : FoodPatner ? (
                        /* --- FOOD PARTNER NAVBAR --- */
                        <div className="nav-actions">
                            {/* <Link to="/partner/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link> */}
                            <div className="user-profile-section" onClick={() => setIsMenuOpen(false)}>
                                <span className="partner-badge">Partner</span>
                                <span className="user-name" onClick={()=> navigate(`/user-profile/${FoodPatner._id}`)}>{FoodPatner.restaurant}</span>
                                <button className="logout-btn" onClick={HandleLogout}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        /* --- LOGGED OUT / LOGIN BUTTON --- */
                        <div className="nav-auth">
                            <Link to="/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;