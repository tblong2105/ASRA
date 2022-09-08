import { memo } from "react";
import { Row, Col } from "antd";
import Button from "components/Layout/components/Button";
import { UserOutlined } from "@ant-design/icons";
import { ROOM_PATH } from "commons/constants";
import moment from "moment";
import { Link } from "react-router-dom";

function ContractInformation({ pathName, cx, contract }: any) {
  
  const calTerm = () => {
    let startYear = new Date(contract.startDate).getFullYear()
    let startMonth = new Date(contract.startDate).getMonth() + 1
    let endYear = new Date(contract.endDate).getFullYear()
    let endMonth = new Date(contract.endDate).getMonth() + 1

    let yearTerm = endYear - startYear
    let monthTerm = endMonth - startMonth

    if(monthTerm < 0){
      yearTerm -= 1
      monthTerm = 12 + monthTerm
    }

    let res = (yearTerm > 0 ? yearTerm + (yearTerm > 1 ? " years" : " year") : "") + (yearTerm > 0 && monthTerm > 0 ? " - " : "") + (monthTerm > 0 ? monthTerm + (monthTerm > 1 ? " months" : " month") : "") || "1 month"
    return res
  }
  return (
    <>
      {/* CONTRACT INFORMATION */}
      <Col className={cx("contract-info-card")} span={8}>
        <Row>
          <Col
            className={cx("title")}
            span={pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) ? 18 : 19}
          >
            <UserOutlined className={cx("contract-icon")} />
            <span className={cx("contract-info-text")}>
              Contract Information
            </span>
          </Col>
        </Row>
        <Row className={cx("contract-info-description")}>
          <Col className={cx("term")} span={12}>
            <span>Term</span>
            <span>{calTerm()}</span>
          </Col>
          <Col className={cx("view-contract")} span={12}>
          <Link to={`/contract/detail/${contract.id}`} target="_blank" ><Button primary >View Contract</Button></Link>
          </Col>
        </Row>
        <Row className={cx("contract-info-description")}>
          <Col className={cx("start-time")} span={12}>
            <span>Start Time</span>
            <span>{moment(contract.startDate).format("MMM DD, YYYY")}</span>
          </Col>
          <Col className={cx("end-time")} span={12}>
            <span>End Time</span>
            <span>{moment(contract.endDate).format("MMM DD, YYYY")}</span>
          </Col>
        </Row>
      </Col>
    </>
  );
}

export default memo(ContractInformation);
