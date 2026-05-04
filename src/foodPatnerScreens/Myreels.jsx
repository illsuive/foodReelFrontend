import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginAsFoodPartner } from '../store/reducer/auth.js';

import '../styles/MyReels.css';

const MyReels = ({ FoodPatner }) => {
    const dispatch = useDispatch();

    // States for Editing
    const [editingMeal, setEditingMeal] = useState(null); // Stores the meal object being edited
    const [updateLoading, setUpdateLoading] = useState(false);
    const [newVideoFile, setNewVideoFile] = useState(null);

    // --- Delete Logic ---
    const deleteMeal = async (mealId) => {
        if (!window.confirm("Are you sure you want to delete this reel?")) return;
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/food/delete/${mealId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success('Meal deleted successfully');
                const updatedMeals = FoodPatner.totalMeals.filter(meal => meal._id !== mealId);
                dispatch(loginAsFoodPartner({ ...FoodPatner, totalMeals: updatedMeals }));
            }
        } catch (error) {
            toast.error('Failed to delete meal');
        }
    };

    // --- Edit/Update Logic ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            let payload = editingMeal;
            let headers = { "Content-Type": "application/json" };

            if (newVideoFile) {
                payload = new FormData();
                payload.append("name", editingMeal.name);
                payload.append("price", editingMeal.price);
                payload.append("category", editingMeal.category);
                payload.append("description", editingMeal.description);
                payload.append("video", newVideoFile);
                headers = { "Content-Type": "multipart/form-data" };
            }

            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/food/update/${editingMeal._id}`,
                payload,
                { headers, withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Meal updated!");
                const updatedMeals = FoodPatner.totalMeals.map(meal =>
                    meal._id === editingMeal._id ? res.data.food : meal
                );
                dispatch(loginAsFoodPartner({ ...FoodPatner, totalMeals: updatedMeals }));
                setEditingMeal(null); // Close dialog
                setNewVideoFile(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast.error("File is too large. Max 50MB.");
                e.target.value = null;
                return;
            }
            setNewVideoFile(file);
            setEditingMeal({ ...editingMeal, video: URL.createObjectURL(file) });
        }
    };

    return (
        <div className="meals-management">
            <h2>Menu Reels</h2>
            <div className="meals-list">
                {FoodPatner?.totalMeals?.map((meal) => (
                    <div key={meal._id} className="meal-edit-card">
                        <video src={meal.video} muted className="meal-preview" />
                        <div className="meal-details">
                            <h4>{meal.name}</h4>
                            <p className="price">₹{meal.price}</p>
                            <div className="edit-actions">
                                <button className="btn-edit" onClick={() => {
                                    setEditingMeal(meal);
                                    setNewVideoFile(null);
                                }}>Edit</button>
                                <button className="btn-delete" onClick={() => deleteMeal(meal._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- EDIT DIALOG (MODAL) --- */}
            {editingMeal && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3>Edit Reel Details</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="input-group">
                                <label>Food Name</label>
                                <input
                                    type="text"
                                    value={editingMeal.name}
                                    onChange={(e) => setEditingMeal({ ...editingMeal, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    value={editingMeal.price}
                                    onChange={(e) => setEditingMeal({ ...editingMeal, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={editingMeal.category}
                                    onChange={(e) => setEditingMeal({ ...editingMeal, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    value={editingMeal.description}
                                    onChange={(e) => setEditingMeal({ ...editingMeal, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Video</label>
                            {editingMeal.video ? (
                                <div className="video-preview-container">
                                    <video src={editingMeal.video} className="video-preview" controls />
                                    <button type="button" className="remove-btn" onClick={() => {
                                        setEditingMeal({ ...editingMeal, video: null });
                                        setNewVideoFile(null);
                                    }}>
                                        ✕ Remove Video
                                    </button>
                                </div>
                            ) : (
                                <div className="file-input-wrapper">
                                    <label className="file-label">
                                        <span className="icon">➕</span>
                                        <span>Select New Video</span>
                                        <input type="file" accept="video/*" onChange={handleFileChange} required />
                                    </label>
                                </div>
                            )}
                            </div>

                            <div className="dialog-actions">
                                <button type="button" className="btn-cancel" onClick={() => {
                                    setEditingMeal(null);
                                    setNewVideoFile(null);
                                }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={updateLoading}>
                                    {updateLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReels;