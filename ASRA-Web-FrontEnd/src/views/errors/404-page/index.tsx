import { Result } from "antd";
import Button from "components/Layout/components/Button";
import { Link } from "react-router-dom";
import { ROLE_ADMIN } from "commons/constants/Role";

function NotFound() {
  const userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");

  return (
    <>
      <Result
        status={userInfor?.roles?.includes(ROLE_ADMIN) ? "403" : "404"}
        title={userInfor?.roles?.includes(ROLE_ADMIN) ? "403" : "404"}
        subTitle={
          userInfor?.roles?.includes(ROLE_ADMIN)
            ? " Sorry, you are not authorized to access this page."
            : "Sorry, the page you visited does not exist."
        }
        extra={
          <Link
            to={
              userInfor?.roles?.includes(ROLE_ADMIN) ? "/admin/dashboard" : "/"
            }
          >
            <Button primary>Back Home</Button>
          </Link>
        }
      />
    </>
  );
}

export default NotFound;
