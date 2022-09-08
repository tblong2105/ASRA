import { SearchTrendCard } from "models/Room";
import { Col, Row } from "antd";
import classNames from "classnames/bind";
import styles from "./searchTrend.module.scss";
import "./searchTrend.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function SearchTrend(props: any) {
  const searchCardList: SearchTrendCard[] = props.searchCardList;

  return (
    <>
      {searchCardList.map((infoCard: any, index: number) => {
        return <Row key={index} className={cx("search-trend-component")}>
          <Link to={`/search/${infoCard.address}`} style={{display:"contents"}}>
          <Col span={24}>
            <div
              className={cx("search-trend-image")}
              style={{
                backgroundImage: `url("${infoCard.image}")`,
              }}
            >
              <div className={cx("overlap")}>
                <p className={cx("search-trend-title")}>{infoCard.address.split("/")[0]}</p>
              </div>
            </div>
          </Col>
          </Link>
        </Row>;
        return;
      })}
    </>
  );
}

export default SearchTrend;
