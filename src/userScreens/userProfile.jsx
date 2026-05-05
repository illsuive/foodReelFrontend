import React from 'react';
import '../styles/UserProfile.css';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UserProfile = ({ user, loading }) => {
    const { user: userData } = useSelector((state) => state.auth);
    
    const navigate = useNavigate();
    // If you're fetching data, show a loading state
    if (loading) return <div className="loading">Loading Profile...</div>;
    
    // Fallback if user data hasn't arrived yet
    if (!user) return <div className="error">No user data found.</div>;

    return (    
        <div className="profile-wrapper">
            {/* 1. Header Section */}
            <div className="profile-card">
                <div className="avatar">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <h2 className="user-name">{user.fullName}</h2>
                <p className="user-email">{user.email}</p>
                <button className="edit-profile-btn">Edit Profile</button>
            </div>

            {/* 2. Details & Future Actions Section */}
            <div className="profile-sections">
                <div className="section-box">
                    <h3>Account Details</h3>
                    <div className="detail-item">
                        <span>Phone:</span>
                        <p>{user.phoneNo || "+91 8882523132"}</p>
                    </div>
                    <div className="detail-item">
                        <span>Delivery Address:</span>
                        <p>{localStorage.getItem('user_addresses') || "Add your address here..."}</p>
                    </div>
                </div>

                <div className="section-box">
                    <h3>Activity</h3>
                    <ul className="activity-links">
                        <li className="link-item" onClick={() => navigate('/orders')}>                        
                                <span>📦 My Orders</span>
                                <span className="arrow">→</span>                     
                        </li>
                        <li className="link-item" onClick={() => navigate('/saved-reels')}>
                            <span>🔖 Saved Reels</span>
                            <span className="arrow">→</span>
                        </li>
                        {/* <li className="link-item" onClick={() => navigate('/payment-methods')}>
                            <span>💳 Payment Methods</span>
                            <span className="arrow">→</span>
                        </li> */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;