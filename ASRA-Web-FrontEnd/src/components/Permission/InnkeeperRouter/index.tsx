import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "commons/utils/js-cookie";
import { ROLE_INNKEEPER } from "commons/constants/Role";
import NotAuthentication from "views/errors/403-Page";

function InnkeeperRouter({ children }: { children: JSX.Element }) {

    const location = useLocation()
    let isLoggedIn = Boolean(getToken())

    let userInfor = JSON.parse(localStorage.getItem("userInfor") || '{}')
    let innkeeperRole: boolean = false
    
    innkeeperRole = userInfor?.roles.includes(ROLE_INNKEEPER)

    if(!isLoggedIn){
        return <Navigate to="/login" state={{ from: location }} replace />;
    }else if(!innkeeperRole){
        return <NotAuthentication />
    }else{
        return children
    }
};

export default InnkeeperRouter