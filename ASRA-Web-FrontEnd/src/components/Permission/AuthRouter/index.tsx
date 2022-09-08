
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "commons/utils/js-cookie";
import { LocationProps } from "models/User";

function AuthRouter({ children }: { children: JSX.Element }) {

    const location = useLocation() as LocationProps
    const isLoggedIn = Boolean(getToken())

    // Check if the user change URL to /login or /register, the router will be redirected homepage(not logout) 
    return isLoggedIn ? <Navigate to="/" state={{ from: location }} /> : children
    
}

export default AuthRouter