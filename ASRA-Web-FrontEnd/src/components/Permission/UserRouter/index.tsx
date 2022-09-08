import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "commons/utils/js-cookie";
import { ROLE_USER, ROLE_INNKEEPER } from "commons/constants/Role";
import NotAuthentication from "views/errors/403-Page";

function UserRouter({ children }: { children: JSX.Element }) {
  const location = useLocation();
  let isLoggedIn = Boolean(getToken());
  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  let userOrInnkeeperRole: boolean = false;

  userOrInnkeeperRole =
    userInfor?.roles.includes(ROLE_USER) ||
    userInfor?.roles.includes(ROLE_INNKEEPER);
  // Check some pages where the user must log in
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (!userOrInnkeeperRole) {
    return <NotAuthentication />;
  } else {
    return children;
  }
}

export default UserRouter;
