import { useParams } from 'react-router-dom'
import {useSelector , useDispatch} from 'react-redux'
import UserProfile from '../userScreens/userProfile.jsx'
import ShowDetailsForPatners from '../foodPatnerScreens/patnerProfile.jsx'

const ShowDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {user , FoodPatner , loading} = useSelector((state) => state.auth);
    
    return (
        <div>
            {id == user?.id ? (
                <UserProfile id={id} user={user} loading={loading}/>
            ) : id == FoodPatner?._id ? (
                <ShowDetailsForPatners id={id} FoodPatner={FoodPatner} loading={loading}/>
            ) : null}
        </div>
    )

}

export default ShowDetails;