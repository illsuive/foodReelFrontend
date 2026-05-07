import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import '../styles/Auth.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { loginAsFoodPartner , loginAsUser } from '../store/reducer/auth.js'
import { useDispatch } from 'react-redux';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('gautambutola@icloud.com');
    const [password, setPassword] = useState('qwerty');

    const PartnerUrl = `${import.meta.env.VITE_BACKEND_URL}/user/login-food-partner`;
    const UserUrl = `${import.meta.env.VITE_BACKEND_URL}/user/login`;

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const url = role === 'user' ? UserUrl : PartnerUrl;
        const res = await axios.post(url, {
            email,
            password
        }, {
            withCredentials: true 
        });

        if (res.data.success) {
            // Save the token if returned by your backend
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            if (role == `user`) {
                toast.success('Login successful as User!');
                dispatch(loginAsUser(res.data.user));
            } else {
                toast.success('Login successful as Food Partner!');
                dispatch(loginAsFoodPartner(res.data.user));
            }
            navigate('/');
        }

    } catch (error) {
        console.error("Login Error:", error.response?.data);
        toast.error(error.response?.data?.message || 'Login failed');
    }
};
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back!</h2>

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

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        {/* Fixed: Use htmlFor and matching id for accessibility */}
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            autoComplete="username"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        {/* Fixed: Use htmlFor and matching id for accessibility */}
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        {role === 'user' ? 'Login as User' : 'Login as Partner'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    <p>Forgot Password? <Link to="/forgot-password">Reset here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;