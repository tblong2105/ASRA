import classNames from "classnames/bind";
import {
  Col,
  Row,
  Select,
  Pagination,
  Breadcrumb,
  PaginationProps,
} from "antd";
import Filter from "./filter/Filter";
import { RoomCard } from "models/Room";
import Room from "components/Layout/components/Room";
import { useEffect, useState } from "react";
import { useAppSelector } from "app/hooks";
import { locationSelector } from "store/selectors";
import { searchRooms } from "api/room";
import { SearchParams } from "models/Room/Search";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.scss";
import "./index.scss";

const cx = classNames.bind(styles);

function Search() {
  const { Option } = Select;
  const sortOption = [
    {
      title: "Latest",
      value: "latest",
    },
    {
      title: "Price from low to high",
      value: "lowToHigh",
    },
    {
      title: "Price from high to low",
      value: "highToLow",
    },
  ];
  const [sortBy, setSortBy] = useState(sortOption[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentUrlSplit, setCurrentUrlSplit] = useState<any[]>([]);
  const [oldSearchParams, setOldSearchParams] = useState<SearchParams>(
    {} as SearchParams
  );
  const [roomCards, setRoomCards] = useState<RoomCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  let location = useAppSelector(locationSelector);
  const navigate = useNavigate();

  useEffect(() => {
    //Clear data
    setLoading(true);
    setCurrentPage(0);
    setTotalItems(0);
    setRoomCards([]);
    setSortBy(sortOption[0].value)

    setCurrentUrlSplit(
      decodeURI(window.location.pathname).split("/").slice(2).reverse()
    );
    let currentsearchLocation = decodeURI(window.location.pathname)
      .split("/")
      .slice(2)
      .reverse();

    const resRequest: SearchParams = {
      page: currentPage,
      city: currentsearchLocation[0],
      district: [currentsearchLocation[1]],
      ward: currentsearchLocation[2],
      minPrice: 0,
      maxPrice: 20000000,
      utilities_bed: false,
      utilities_wm: false,
      utilities_time: false,
      utilities_ac: false,
      utilities_refrigerator: false,
      utilities_wifi: false,
      utilities_parking: false,
      utilities_toilet: false,
      utilities_kitchen: false,
      utilities_television: false,
      dormitory: false,
      roomForRent: false,
      apartment: false,
      wholeHouse: false,
      sharedRoom: false,
      sortBy: "latest",
    };

    searchRooms(resRequest).then((res: any) => {
      setCurrentPage(res.currentPage);
      setTotalItems(res.totalItems);
      setRoomCards(res.rooms);
      setLoading(false);
    });
  }, [location, navigate]);

  const handleChange = (value: string) => {
    setLoading(true);
    setRoomCards([]);
    setSortBy(value);
    const currentsearchLocation = decodeURI(window.location.pathname)
      .split("/")
      .slice(2)
      .reverse();
    setCurrentPage(1);
    oldSearchParams.page = 1;
    oldSearchParams.city = currentsearchLocation[0];
    oldSearchParams.district = [currentsearchLocation[1]];
    oldSearchParams.ward = currentsearchLocation[2];
    oldSearchParams.sortBy = value;
    searchRooms(oldSearchParams).then((res: any) => {
      setCurrentPage(res.currentPage);
      setTotalItems(res.totalItems);
      setRoomCards(res.rooms);
      setLoading(false);
    });
  };

  const handlePaginationChange: PaginationProps["onChange"] = (current) => {
    setLoading(true);
    setRoomCards([]);
    const currentsearchLocation = decodeURI(window.location.pathname)
      .split("/")
      .slice(2)
      .reverse();
    setCurrentPage(current);
    oldSearchParams.page = current;
    oldSearchParams.city = currentsearchLocation[0];
    oldSearchParams.district = [currentsearchLocation[1]];
    oldSearchParams.ward = currentsearchLocation[2];
    searchRooms(oldSearchParams).then((res: any) => {
      setCurrentPage(res.currentPage);
      setTotalItems(res.totalItems);
      setRoomCards(res.rooms);
      setLoading(false);
    });
  };

  const handleSearch = (searchParams: SearchParams) => {
    setLoading(true);
    setRoomCards([]);
    searchParams.page = 1;
    setCurrentPage(1);
    setOldSearchParams(searchParams);
    searchRooms(searchParams).then((res: any) => {
      setCurrentPage(res.currentPage);
      setTotalItems(res.totalItems);
      setRoomCards(res.rooms);
      setLoading(false);
    });
  };

  return (
    <>
      <Row className={cx("search-screen")}>
        <Col span={24} className={cx("text")}>
          <Row>
            <Col
              span={24}
              className={`${cx("text-location", "text-location")}`}
            >
              <Breadcrumb separator=">">
                {currentUrlSplit.map((item: any, index: any) => item != "city" &&(
                  <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </Col>
          </Row>
        </Col>
        <Col span={24} className={cx("search-header")}>
          <Row>
            <Col span={24} className={cx("breadcrumb")}></Col>
            <Col span={24} className={cx("title")}>
              <Row>
                <Col span={9} className={cx("label-result")}>
                  <div>Results</div>
                </Col>
                <Col span={2} className={cx("label-sort")}>
                  Order by
                </Col>
                <Col span={5} className="select-sort">
                  <Select
                    className="input"
                    onChange={handleChange}
                    value={sortBy}
                  >
                    {sortOption.map((option, index) => (
                      <Option key={index} value={option.value}>
                        {option.title}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8} className={cx("label-filter")}>
                  Filter
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24} className={cx("search-body")}>
          <Row>
            <Col span={17} className={cx("search-data")}>
              <Spin
                spinning={loading}
                delay={0}
                size="large"
                className={cx("spin")}
              ></Spin>
              {roomCards.length > 0
                ? roomCards.map((roomCard: RoomCard, index) => (
                    <Room key={index} roomCard={roomCard}></Room>
                  ))
                : !loading && (
                    <div className={cx("no-data")}>
                      <div className="no-data"></div>
                    </div>
                  )}
            </Col>

            <Col span={7} className={cx("search-filter")}>
              <Filter
                sortBy={sortBy}
                search={(searchParams: SearchParams) =>
                  handleSearch(searchParams)
                }
              ></Filter>
            </Col>
          </Row>
        </Col>
        <Col span={24} className={cx("pagination-body")}>
          <Row>
            <Col span={16} className={cx("pagination")}>
              {totalItems > 0 && (
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  showSizeChanger={false}
                  onChange={handlePaginationChange}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Search;
