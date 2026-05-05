import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector , useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/UploadReel.css";
import { loginAsFoodPartner } from '../store/reducer/auth.js';

const UploadReel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { FoodPatner, loading: authLoading } = useSelector((state) => state.auth);

    const [allData, setAllData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
    });
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null); // For UI preview
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!authLoading && !FoodPatner) {
            toast.error("Only food partners can upload reels.");
            navigate("/login");
        }
    }, [FoodPatner, authLoading, navigate]);

    const handleChange = (e) => {
        setAllData({ ...allData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast.error("File is too large. Max 50MB.");
                e.target.value = null;
                return;
            }
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
        }
    };

    const handleRemoveVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) return toast.error("Please select a video file");

        setIsUploading(true);
        const formData = new FormData();
        formData.append("name", allData.name);
        formData.append("description", allData.description);
        formData.append("category", allData.category);
        formData.append("price", allData.price);
        formData.append("video", videoFile);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/food/upload`, formData, 
                {
                    headers: { 
                        "Content-Type": "multipart/form-data" 
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success("Food item uploaded successfully!");
                setAllData({
                    name: "",
                    description: "",
                    category: "",
                    price: "",
                });
                setVideoFile(null);
                setVideoPreview(null);  
                
                try {
                    const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/food-partner/${FoodPatner._id}`, {
                        withCredentials: true
                    });
                    if (profileRes.data.success) {
                        dispatch(loginAsFoodPartner(profileRes.data.foodPartner));
                    }
                } catch (e) {
                    console.error("Failed to refresh partner data", e);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload reel');
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading) return <div className="loader">Loading...</div>;

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h1>Upload Your Food Reel</h1>
                
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="input-group">
                        <label>Food Name</label>
                        <input name="name" type="text" value={allData.name} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" value={allData.description} onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="input-group">
                            <label>Price ($)</label>
                            <input name="price" type="number" value={allData.price} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Category</label>
                            <input name="category" type="text" value={allData.category} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="video-section">
                        {!videoPreview ? (
                            <div className="file-input-wrapper">
                                <label className="file-label">
                                    <span className="icon">➕</span>
                                    <span>Select Video</span>
                                    <input type="file" accept="video/*" onChange={handleFileChange} required />
                                </label>
                            </div>
                        ) : (
                            <div className="video-preview-container">
                                <video 
                                src={videoPreview} 
                                // poster={`${meal.video}?tr=so-2,w-400`}
                                className="video-preview" controls />
                                <button type="button" onClick={handleRemoveVideo} className="remove-btn">
                                    ✕ Remove Video
                                </button>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={isUploading} className="submit-btn">
                        {isUploading ? "Uploading..." : "Upload Reel"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadReel;