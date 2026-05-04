import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const isLogin = () => {
    const { user , FoodPatner , loading} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    if (!user || !FoodPatner) {
        navigate('/login');
        return false;
    }

    return true;
};

export default isLogin;