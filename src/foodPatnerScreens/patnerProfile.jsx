import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/PartnerDetails.css';
import { useDispatch } from 'react-redux';
import { loginAsFoodPartner } from '../store/reducer/auth.js';

const ShowDetailsForPatners = ({ FoodPatner, loading }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        restaurant: FoodPatner?.restaurant || '',
        phoneNo: FoodPatner?.phoneNo || '',
        address: FoodPatner?.address || ''
    });

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!FoodPatner) return <div className="error-container">No details found.</div>;

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            // Replace with your actual update endpoint
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update-partner`, editData, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                // Update the global Redux state so changes reflect immediately
                dispatch(loginAsFoodPartner({ ...FoodPatner, ...editData }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="partner-details-wrapper">
            <header className="partner-hero">
                <div className="partner-logo-large">
                    {editData.restaurant ? editData.restaurant[0] : 'B'}
                </div>
                <div className="partner-title">
                    {isEditing ? (
                        <input 
                            name="restaurant" 
                            className="edit-input-hero"
                            value={editData.restaurant} 
                            onChange={handleChange} 
                        />
                    ) : (
                        <h1>{editData.restaurant}</h1>
                    )}
                    <p className="owner-name">Owned by {FoodPatner.fullName}</p>
                </div>
            </header>

            <div className="details-grid">
                <div className="info-card">
                    <h3>Contact Information</h3>
                    <div className="info-row">
                        <span className="label">📞 Phone Number</span>
                        {isEditing ? (
                            <input 
                                name="phoneNo" 
                                className="edit-input"
                                value={editData.phoneNo} 
                                onChange={handleChange} 
                            />
                        ) : (
                            <p>{editData.phoneNo || "Add phone number"}</p>
                        )}
                    </div>
                    <div className="info-row">
                        <span className="label">📧 Email (Private)</span>
                        <p className="locked-field">{FoodPatner.email} 🔒</p>
                    </div>
                </div>

                <div className="info-card">
                    <h3>Location Details</h3>
                    <div className="info-row">
                        <span className="label">📍 Business Address</span>
                        {isEditing ? (
                            <textarea 
                                name="address" 
                                className="edit-textarea"
                                value={editData.address} 
                                onChange={handleChange} 
                            />
                        ) : (
                            <p>{editData.address}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="action-footer">
                {isEditing ? (
                    <>
                        <button className="save-btn" onClick={handleSave}>Save Changes</button>
                        <button className="secondary-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <button className="primary-btn" onClick={() => setIsEditing(true)}>Edit Details</button>
                )}
            </div>
        </div>
    );
};

export default ShowDetailsForPatners;