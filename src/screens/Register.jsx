import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for better UX
import axios from 'axios';
import '../styles/Auth.css';
import { toast } from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('user');

    const [foodPartnerData, setFoodPartnerData] = useState({
        fullName: '',
        restaurant: '',
        email: '',
        phoneNo: '',
        address: '',
        password: ''
    });

    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phoneNo: '',
        password: ''
    });

    const handleInputChange = (e) => {    
        const { name, value } = e.target;
        if (role === 'user') {
            setUserData(prev => ({ ...prev, [name]: value }));
        } else {
            setFoodPartnerData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
     
        const url = role === 'user' 
            ? `${import.meta.env.VITE_BACKEND_URL}/user/register`
            : `${import.meta.env.VITE_BACKEND_URL}/user/register-food-partner`;

        const data = role === 'user' ? userData : foodPartnerData;

        try {
            const response = await axios.post(url, data , {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Registration successful!');
            
            navigate('/login'); // Redirect to login after success
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{role === 'user' ? 'Create User Account' : 'Partner with FoodReel'}</h2>
                
                <div className="role-toggle">
                    <button 
                        type="button"
                        className={`role-btn ${role === 'user' ? 'active' : ''}`}
                        onClick={() => setRole('user')}
                    >
                        User
                    </button>
                    <button 
                        type="button"
                        className={`role-btn ${role === 'partner' ? 'active' : ''}`}
                        onClick={() => setRole('partner')}
                    >
                        Food Partner
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} method='post'>
                    <div className="input-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input 
                            id="fullName" name="fullName" type="text" 
                            value={role === 'user' ? userData.fullName : foodPartnerData.fullName}
                            onChange={handleInputChange} required 
                        />
                    </div>
                    
                    {role === 'partner' && (
                        <div className="input-group">
                            <label htmlFor="restaurant">Restaurant Name</label>
                            <input 
                                id="restaurant" name="restaurant" type="text" 
                                value={foodPartnerData.restaurant}
                                onChange={handleInputChange} required 
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            id="email" name="email" type="email" 
                            value={role === 'user' ? userData.email : foodPartnerData.email}
                            autoComplete="username"
                            onChange={handleInputChange} required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="phoneNo">Phone Number</label>
                        <input 
                            id="phoneNo" name="phoneNo" type="tel" 
                            value={role === 'user' ? userData.phoneNo : foodPartnerData.phoneNo}
                            onChange={handleInputChange} required 
                        />
                    </div>

                    {role === 'partner' && (
                        <div className="input-group">
                            <label htmlFor="address">Business Address</label>
                            <textarea 
                                id="address" name="address" rows="2" 
                                value={foodPartnerData.address}
                                onChange={handleInputChange} required 
                            ></textarea>
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password" name="password" type="password" 
                            value={role === 'user' ? userData.password : foodPartnerData.password}
                            autoComplete="new-password"
                            onChange={handleInputChange} required 
                        />
                    </div>
                    
                    <button type="submit" className="submit-btn">
                        {role === 'user' ? 'Register as User' : 'Register as Partner'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
