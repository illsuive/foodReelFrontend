import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/reducer/cart.js';

import '../styles/AddressPage.css';

const AddressPage = () => {
    const dispatch = useDispatch();
    // 1. cartData now contains { userId, totalAmount, groupedItems }
    const { items: cartData } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('user_addresses')) || [];
        setAddresses(saved);
    }, []);

    const saveToLocal = (updatedList) => {
        setAddresses(updatedList);
        localStorage.setItem('user_addresses', JSON.stringify(updatedList));
    };

    const handleAddOrUpdate = () => {
        if (!newAddress.trim()) return toast.error("Address cannot be empty");

        let updated;
        if (editingIndex !== null) {
            updated = [...addresses];
            updated[editingIndex] = newAddress;
            setEditingIndex(null);
            toast.success("Address updated");
        } else {
            updated = [...addresses, newAddress];
            toast.success("Address saved");
        }

        saveToLocal(updated);
        setNewAddress("");
    };

    const deleteAddress = (index) => {
        const updated = addresses.filter((_, i) => i !== index);
        saveToLocal(updated);
        if (selectedAddress === index) setSelectedAddress(null);
        toast.success("Address deleted");
    };

    const handlePayment = async () => {
        if (selectedAddress === null) return toast.error("Please select an address");

        if (!window.Razorpay) {
            return toast.error("Razorpay SDK failed to load. Are you online?");
        }

        try {
            // 2. FIX: Flatten the groupedItems back into a flat array for the Order model
            // Your Order backend likely expects a flat array of items
            const allItems = cartData?.groupedItems?.flatMap(group => group.items) || [];

            const payload = {
                items: allItems,
                totalPrice: cartData.totalAmount, // Use totalAmount from new structure
                shipping: addresses[selectedAddress]
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/order/create`,
                payload,
                { withCredentials: true }
            );

            if (data.success) {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: data.order.totalPrice * 100, 
                    currency: "INR",
                    name: "FoodReel",
                    description: "Delicious Food Delivery",
                    image: "https://your-logo-url.com/logo.png",
                    order_id: data.order.razorPay_order_id,
                    handler: async (response) => {
                        try {
                            const verifyRes = await axios.post(
                                `${import.meta.env.VITE_BACKEND_URL}/order/verify`,
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                },
                                { withCredentials: true }
                            );

                            if (verifyRes.data.success) {
                                toast.success("Payment Successful! 🍕");

                                // 3. CLEAR BACKEND CART
                                // This route now returns the grouped structure: { userId, totalAmount: 0, groupedItems: [] }
                                const clearRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart/clear`, { withCredentials: true });

                                // 4. UPDATE REDUX STATE
                                if (clearRes.data.success) {
                                    dispatch(clearCart(clearRes.data.cart)); 
                                }

                                navigate('/orders');
                            } else {
                                toast.error(verifyRes.data.message || "Signature verification failed.");
                            }
                        } catch (err) {
                            toast.error(err.response?.data?.message || "Signature verification failed.");
                        }
                    },
                    prefill: {
                        name: user?.fullName || "Customer",
                        email: user?.email || "",
                        contact: user?.phoneNo || ""
                    },
                    theme: {
                        color: "#ff4757"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    toast.error("Payment Failed: " + response.error.description);
                });
                rzp.open();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment initialization failed");
        }
    };

    return (
        <div className="address-container">
            <h2>Select Delivery Address</h2>

            <div className="address-input-section">
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter house no, street, city..."
                />
                <button onClick={handleAddOrUpdate}>
                    {editingIndex !== null ? "Update Address" : "Add New Address"}
                </button>
            </div>

            <div className="address-list">
                {addresses.map((addr, index) => (
                    <div
                        key={index}
                        className={`address-card ${selectedAddress === index ? 'active' : ''}`}
                        onClick={() => setSelectedAddress(index)}
                    >
                        <p>{addr}</p>
                        <div className="card-actions">
                            <button onClick={(e) => { e.stopPropagation(); setNewAddress(addr); setEditingIndex(index) }}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); deleteAddress(index) }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {addresses.length > 0 && (
                <button className="pay-btn" onClick={handlePayment}>
                    Proceed to Pay ₹{cartData?.totalAmount || 0}
                </button>
            )}
        </div>
    );
};

export default AddressPage;