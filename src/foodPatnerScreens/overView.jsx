import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { fetchFoodPatnerOrder } from '../store/reducer/order.js';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import '../styles/OverView.css';

const OverView = () => {
    const dispatch = useDispatch();
    const { FoodPatner } = useSelector((state) => state.auth);
    const { foodPatnerOrder } = useSelector((state) => state.order);
    const [fetching, setFetching] = useState(false);

    // Function to fetch orders if they are missing or belong to a different session
    const getPartnerOrders = async () => {
        try {
            setFetching(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/order/food-partner/${FoodPatner._id}`, 
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(fetchFoodPatnerOrder(res.data.orders));
            }
        } catch (error) {
            toast.error("Failed to sync dashboard data");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
       getPartnerOrders();
    }, []);

    if (fetching) return <div className="overview-loader">Syncing your restaurant reports...</div>;

    // Analytics Calculations
    const totalEarnings = foodPatnerOrder?.reduce((acc, order) => acc + (order.partnerSubtotal || 0), 0) || 0;
    const totalOrders = foodPatnerOrder?.length || 0;
    const totalReels = FoodPatner?.totalMeals?.length || 0;

    const chartData = foodPatnerOrder?.slice(0, 7).map(order => ({
        name: new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        earnings: order.partnerSubtotal
    })).reverse();

    const COLORS = ['#ff4757', '#2f3542', '#747d8c'];

    return (
        <div className="overview-wrapper">
            <header className="overview-header">
                <div className="welcome-text">
                    <h1>Dashboard Overview</h1>
                    <p>Live performance tracking for {FoodPatner?.restaurant || "your restaurant"}.</p>
                </div>
                {/* <button className="refresh-btn" onClick={getPartnerOrders}>🔄 Refresh Data</button> */}
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                        <h3>₹{totalEarnings}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <h3>{totalOrders}</h3>
                        <p>Orders Received</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🎥</span>
                    <div className="stat-info">
                        <h3>{totalReels}</h3>
                        <p>Active Reels</p>
                    </div>
                </div>
            </div>

            <div className="reports-layout">
                <div className="chart-container main-chart">
                    <h3>Recent Revenue (₹)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="earnings" stroke="#ff4757" fillOpacity={1} fill="url(#colorEarnings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container side-chart">
                    <h3>Business Health</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Orders', value: totalOrders },
                                    { name: 'Reels', value: totalReels }
                                ]}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {COLORS.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OverView;