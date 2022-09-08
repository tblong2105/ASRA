import Room from "components/Layout/components/Room";
import styles from "./index.module.scss";
import "./index.scss";
import classNames from "classnames/bind";
import { RoomCard, SearchTrendCard } from "models/Room";
import { Button, Col, Image, Row, Spin } from "antd";
import SearchTrend from "components/Layout/components/SearchTrend/searchTrend";
import banner from "assets/images/banner-1.jpg";
import { suggestionRooms, searchTrends } from "api/room";
import { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
const cx = classNames.bind(styles);

/**
 * Home Screen
 * [Guest Module] As ASRA guest, I can view Suggestion
 * [Guest Module] As ASRA guest, I can view SearchTrend
 */
let searchCardList: SearchTrendCard[] = [
  {
    image:
      "http://docs.portal.danang.gov.vn/images/images/chuyende/nguhanhson/danh-thang-ngu-hanh-son-da-nang-01-1024x574.jpg",
    address: "",
  },
  {
    image:
      "https://vcnet.vn/publish/thumbnail/20893/600x600xwidth/upload/20893/20190731/FB_IMG_1564525039589.jpg",
    address: "",
  },
  {
    image:
      "https://scontent.fdad5-1.fna.fbcdn.net/v/t1.6435-9/49342943_579439962527390_3169457260518703104_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=qY3tCD-9L-kAX_EqkA5&tn=aNsouLRfpwiVC65A&_nc_ht=scontent.fdad5-1.fna&oh=00_AT_y05CdRtaWGuKZg-_wZpk3ytVcmrWksADdwVsFR1-Pvw&oe=63078EC3",
    address: "",
  },
  {
    image:
      "http://media.dulich24.com.vn/diemden/bai-bien-nam-o-4959/e7aae1e3-d71f-4a46-9d49-0b08c8380a4b.jpg",
    address: "",
  },
  {
    image:
      "https://static.vinwonders.com/2022/03/chua-linh-ung-da-nang-01.jpg",
    address: "",
  },
];
function Home() {
  const [roomSuggestion, setRoomSuggestion] = useState<RoomCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTrendLoading, setSearchTrendLoading] = useState<boolean>(true);
  useEffect(() => {
    suggestionRooms().then((res: any) => {
      setRoomSuggestion(res.rooms);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    searchTrends().then((res: any) => {
      res.map((x: any, index: number) => {
        searchCardList[index].address = x.replace(",", "/");
      });
      setSearchTrendLoading(false);
    });
  }, []);

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <>
      <div>
        <Row className={cx("home-screen")}>
          <Col span={24} className={cx("home-backdrop")}>
            <Row>
              {/* backdrop home screen */}
              <Image
                preview={false}
                className={cx("home-backdrop-image")}
                src={banner}
              />
            </Row>
          </Col>
          <Col span={24} className={cx("home-header")}>
            <Row>
              <Col span={24} className={cx("breadcrumb")}></Col>
              <Col span={24} className={cx("title")}>
                <Row>
                  {/* title suggestion */}
                  <Col span={16} className={cx("label")}>
                    Suggestions
                  </Col>
                  {/* title search trends */}
                  <Col span={7} className={cx("label")}>
                    Search trends
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24} className={cx("home-body")}>
            <Row>
              {/* list data room suggestion */}
              <Col span={16} className={cx("room-data")}>
                <Spin
                  spinning={loading}
                  size="large"
                  delay={0}
                  className={cx("spin")}
                >
                  {roomSuggestion.map((item: RoomCard, index: number) => (
                    <Room key={index} roomCard={item}></Room>
                  ))}
                </Spin>
              </Col>
              {/* list data location search trend */}
              <Col span={7} className={cx("search-trend-data")}>
                <Spin
                  spinning={searchTrendLoading}
                  size="large"
                  delay={0}
                  className={cx("spin")}
                >
                  {!searchTrendLoading && (
                    <SearchTrend searchCardList={searchCardList}></SearchTrend>
                  )}
                </Spin>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div style={{ zIndex: 4 }}>
        <div style={{ position: "fixed", bottom: 80, right: 80 }}>
          <button
            className={cx("btn-move-to-top")}
            onClick={scrollToTop}
            style={{ display: visible ? "inline" : "none", zIndex: 4 }}
          >
            <ArrowUpOutlined style={{ fontSize: "18px", marginTop: "2px" }} />
          </button>
        </div>
      </div>
    </>
  );
}
export default Home;
