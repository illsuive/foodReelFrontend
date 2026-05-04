import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';
import Login from '../screens/Login.jsx'
import Register from '../screens/Register.jsx';
import HomePage from '../screens/home.jsx';
import PatnerProfile from '../screens/patnerProfile.jsx';
import ShowDetails from '../screens/userprofileManage.jsx'
import CartPage from '../screens/cart.jsx';
import PaymentPage from '../screens/payment.jsx'
import AddressPage from '../screens/address.jsx'
    
// header
import Header from '../component/header.jsx';
const AppRouter = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path="/about" element={<h1>About</h1>} />

                {/* Home Page */}
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/:id" element={<PatnerProfile />} />

                <Route path="/user-profile/:id" element={<ShowDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<PaymentPage />} />
                <Route path="/address" element={<AddressPage />} />
            </Routes>
        </Router>
    )
}

export default AppRouter
