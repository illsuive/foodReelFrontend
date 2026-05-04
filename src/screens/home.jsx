import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import UserHomePage from '../userScreens/homePage.jsx';
import FoodPartnerHomePage from '../foodPatnerScreens/foodPatnerHome.jsx';
import { logOut } from '../store/reducer/auth.js';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import '../styles/home.css'; // Add responsive CSS here


const HomePage = () => {
    const dispatch = useDispatch();
    const { user, loading, FoodPatner } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user && !FoodPatner) {
            navigate('/login');
        }
    }, [user, FoodPatner, loading, navigate]);

    if (loading) return <div className="loading-screen">Loading...</div>;

    // Determine the content to show
    const renderContent = () => {
        if (user) return <UserHomePage />;
        if (FoodPatner) return <FoodPartnerHomePage />;
        return null;
    };

    return (
        <div className="app-container">
            {/* Responsive Navbar */}

            {/* Main Content Area */}
            <main className="main-viewport">
                {renderContent()}
            </main>
        </div>
    );
};

export default HomePage;