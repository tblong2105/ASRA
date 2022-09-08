import { Result } from "antd"
import Button from "components/Layout/components/Button"
import { Link } from "react-router-dom"

function NotAuthentication() {
    return(
        <>
            <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Link to={"/"}> <Button primary>Back Home</Button> </Link>}
        />
        </>
    )
}

export default NotAuthentication