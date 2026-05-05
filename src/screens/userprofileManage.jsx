import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfile from '../userScreens/userProfile.jsx';
import ShowDetailsForPatners from '../foodPatnerScreens/patnerProfile.jsx';

const ShowDetails = () => {
    const { id } = useParams();
    const { user, FoodPatner, loading } = useSelector((state) => state.auth);

        if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (user && (user._id === id || user.id === id)) {
        return <UserProfile id={id} user={user} loading={loading} />;
    }

    if (FoodPatner && FoodPatner._id === id) {
        return <ShowDetailsForPatners id={id} FoodPatner={FoodPatner} loading={loading} />;
    }

    return <Navigate to="/login" replace />;
};

export default ShowDetails;