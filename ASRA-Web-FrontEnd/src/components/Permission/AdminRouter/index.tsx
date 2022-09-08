import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "commons/utils/js-cookie";
import { ROLE_ADMIN } from "commons/constants/Role";
import NotAuthentication from "views/errors/403-Page";

function AdminRouter({ children }: { children: JSX.Element }) {
  const location = useLocation();
  let isLoggedIn = Boolean(getToken());

  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  let adminRole: boolean = false;

  adminRole = userInfor?.roles.includes(ROLE_ADMIN);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (!adminRole) {
    return <NotAuthentication />;
  } else {
    return children;
  }
}

export default AdminRouter;
