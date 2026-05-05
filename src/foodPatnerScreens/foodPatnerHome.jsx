import { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/PartnerDashboard.css';
import OverView from './overView';
import MyReels from './Myreels.jsx';
import UploadReel from './createFood.jsx';
import OrderHistory from './orderHistory.jsx';

const FoodPatnerPage = () => {
    const { FoodPatner } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('overview');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile toggle
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const tabs = ['overview', 'my-reels', 'upload', 'orders'];

    return (
        <div className="dashboard-container">
             <button className="mobile-menu-btn" onClick={toggleMenu}>
                {isMenuOpen ? '✖ Close' : '☰ Menu'}
            </button>

            {/* 1. Sidebar */}
            <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>{FoodPatner?.restaurant}</h2>
                    <p>Partner Panel</p>
                </div>
                <nav className="sidebar-nav">
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            className={activeTab === tab ? 'active' : ''} 
                            onClick={() => {
                                setActiveTab(tab);
                                setIsMenuOpen(false); // Close menu on selection
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 2. Main Content */}
            <main className="main-content">
                <header className="content-header">
                    <div className="header-text">
                        <h1>Welcome, {FoodPatner?.fullName.split(' ')[0]}</h1>
                        <h4>{FoodPatner?.email}</h4>
                        <p className="subtitle">Here's what's happening today</p>
                    </div>
                    <div className="user-badge">
                        <span className="active-dot">●</span> Online
                    </div>
                </header>

                {/* Tab: Overview */}
                {activeTab === 'overview' && (<OverView  />)}

                {/* Tab: My Reels (Responsive List) */}
                {activeTab === 'my-reels' && (<MyReels FoodPatner={FoodPatner} />)}

                {/* Tab: Upload */}
                {activeTab === 'upload' && (<UploadReel />)}

                {/* Tab: Orders */}
                {activeTab === 'orders' && (<OrderHistory />)}

                {/* Tab: Settings */}
                {/* {activeTab === 'settings' && (<Settings />)} */}

            </main>
        </div>
    );
};

export default FoodPatnerPage;