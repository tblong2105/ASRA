import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Checkbox, Col, Row, Slider } from "antd";
import Button from "components/Layout/components/Button";
import { SliderMarks } from "antd/lib/slider";
import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { getRoomType } from "../../../../api/room";
import { RoomType } from "../../../../models/Room";
import { Room_Type } from "../../../../commons/constants/MasterData";
import { currencyViCodeForPriceSlider } from "commons/utils/mask";


import { searchSelector, locationSelector } from "store/selectors";
import { useAppSelector } from "app/hooks";
import { useNavigate } from "react-router-dom";



const cx = classNames.bind(styles);
let utilities = [
  {
    id: 1,
    className: "bed-icon",
  },
  {
    id: 2,
    className: "time-icon",
  },
  {
    id: 3,
    className: "washing-machine-icon",
  },
  {
    id: 4,
    className: "toilet-icon",
  },
  {
    id: 5,
    className: "air_Condition-icon",
  },
  {
    id: 6,
    className: "television-icon",
  },
  {
    id: 7,
    className: "parking-icon",
  },
  {
    id: 8,
    className: "kitchen-icon",
  },
  {
    id: 9,
    className: "refrigerator-icon",
  },
  {
    id: 10,
    className: "wifi-icon",
  },
];

let check = [
  {
    isCheck: false,
  },
  {
    isCheck: false,
  },
  {
    isCheck: false,
  },
  {
    isCheck: false,
  },
  {
    isCheck: false,
  },
];

let countFalse = 0;
let countTrue = 0;

function Filter(props: any) {
  const refRoomType = useRef();
  let location = useAppSelector(locationSelector);
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState<RoomType[]>([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000000);

  const [bed, setBed] = useState(false);
  const [time, setTime] = useState(false);
  const [wmc, setWmc] = useState(false);
  const [ac, setAc] = useState(false);
  const [television, setTelevision] = useState(false);
  const [refrigerator, setRefrigerator] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [toilet, setToilet] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  const [dormitory, setDormitory] = useState(false);
  const [roomForRent, setRoomForRent] = useState(false);
  const [apartment, setApartment] = useState(false);
  const [wholeHouse, setWholeHouse] = useState(false);
  const [sharedRoom, setSharedRoom] = useState(false);

  const [allChecked, setAllChecked] = useState(false);

  const marks: SliderMarks = {
    0: {
      style: {
        color: "#000",
        fontSize: "16px",
        fontWeight: 400,
      },
      label: <p>0M</p>,
    },
    20000000: {
      style: {
        color: "#000",
        fontSize: "16px",
        fontWeight: 400,
      },
      label: <p>20M</p>,
    },
  };

  useEffect(() => {
    
  }, []);

  useEffect(() => {
     handleReset()
  }, [navigate]);

  //Get RoomType
  useEffect(() => {
      const lcsRoomtype: any = localStorage.getItem(Room_Type);
      if (lcsRoomtype) {
        setRoomType(JSON.parse(lcsRoomtype));
      } else {
        getRoomType().then((res: any) => {
          const lcsRoomtype: any = localStorage.getItem(Room_Type);
          setRoomType(JSON.parse(lcsRoomtype));
        });
      }
  }, []);

  useEffect(() => {
      if (dormitory && roomForRent && apartment && wholeHouse && sharedRoom) {
        setAllChecked(true);
      } else {
        setAllChecked(false);
      }
  }, [dormitory, roomForRent, apartment, wholeHouse, sharedRoom]);

  const handleSliderChange = (e: any) => {
    setMinPrice(e[0]);
    setMaxPrice(e[1]);
  };

  const handleUtilitiesClick = (e: any) => {
    switch (e) {
      case 1:
        utilities[e - 1].className = !bed ? "bed-green-icon" : "bed-icon";
        setBed(!bed);
        break;
      case 2:
        utilities[e - 1].className = !time ? "time-green-icon" : "time-icon";
        setTime(!time);
        break;
      case 3:
        utilities[e - 1].className = !wmc
          ? "washing-machine-green-icon"
          : "washing-machine-icon";
        setWmc(!wmc);
        break;
      case 4:
        utilities[e - 1].className = !toilet
          ? "toilet-green-icon"
          : "toilet-icon";
        setToilet(!toilet);
        break;
      case 5:
        utilities[e - 1].className = !ac
          ? "air_Condition-green-icon"
          : "air_Condition-icon";
        setAc(!ac);
        break;
      case 6:
        utilities[e - 1].className = !television
          ? "television-green-icon"
          : "television-icon";
        setTelevision(!television);
        break;
      case 7:
        utilities[e - 1].className = !parking
          ? "parking-green-icon"
          : "parking-icon";
        setParking(!parking);
        break;
      case 8:
        utilities[e - 1].className = !kitchen
          ? "kitchen-green-icon"
          : "kitchen-icon";
        setKitchen(!kitchen);
        break;
      case 9:
        utilities[e - 1].className = !refrigerator
          ? "refrigerator-green-icon"
          : "refrigerator-icon";
        setRefrigerator(!refrigerator);
        break;
      case 10:
        utilities[e - 1].className = !wifi ? "wifi-green-icon" : "wifi-icon";
        setWifi(!wifi);
        break;
      default:
        break;
    }
  };

  const handleRoomTypeOnChecked = (e: any, value: any, index: number) => {
    if (index === -1) {
      if (allChecked) {
        check.forEach((element) => {
          element.isCheck = false;
        });
        setRoomTypeCheckAll(false);
      } else {
        check.forEach((element) => {
          element.isCheck = true;
        });
        setRoomTypeCheckAll(true);
      }
     
    } else {
      check[index].isCheck = check[index].isCheck ? false : true;
      switch (value) {
        case roomType[0].value:
          setDormitory(!dormitory);
          break;
        case roomType[1].value:
          setRoomForRent(!roomForRent);
          break;
        case roomType[2].value:
          setApartment(!apartment);
          break;
        case roomType[3].value:
          setWholeHouse(!wholeHouse);
          break;
        case roomType[4].value:
          setSharedRoom(!sharedRoom);
          break;
        default:
          break;
      }
    }
  };

  const setRoomTypeCheckAll = (checked: boolean) => {
    setDormitory(checked);
    setRoomForRent(checked);
    setApartment(checked);
    setWholeHouse(checked);
    setSharedRoom(checked);
    setAllChecked(checked)
  };

  const handleReset = () => {
    check = [
      {
        isCheck: false,
      },
      {
        isCheck: false,
      },
      {
        isCheck: false,
      },
      {
        isCheck: false,
      },
      {
        isCheck: false,
      },
    ];
    utilities = [
      {
        id: 1,
        className: "bed-icon",
      },
      {
        id: 2,
        className: "time-icon",
      },
      {
        id: 3,
        className: "washing-machine-icon",
      },
      {
        id: 4,
        className: "toilet-icon",
      },
      {
        id: 5,
        className: "air_Condition-icon",
      },
      {
        id: 6,
        className: "television-icon",
      },
      {
        id: 7,
        className: "parking-icon",
      },
      {
        id: 8,
        className: "kitchen-icon",
      },
      {
        id: 9,
        className: "refrigerator-icon",
      },
      {
        id: 10,
        className: "wifi-icon",
      },
    ];
    setMinPrice(0);
    setMaxPrice(20000000);
    setBed(false);
    setTime(false);
    setWmc(false);
    setAc(false);
    setTelevision(false);
    setRefrigerator(false);
    setWifi(false);
    setParking(false);
    setToilet(false);
    setKitchen(false);
    setDormitory(false);
    setRoomForRent(false);
    setApartment(false);
    setWholeHouse(false);
    setSharedRoom(false);
    setAllChecked(false);
  };

  const handleSearch = () => {
    const currentsearchLocation = decodeURI(window.location.pathname).split("/").slice(2).reverse()
    const searchParams = {
      minPrice: minPrice,
      maxPrice: maxPrice,
      utilities_bed: bed,
      utilities_wm: wmc,
      utilities_time: time,
      utilities_ac: ac,
      utilities_televison: television,
      utilities_refrigerator: refrigerator,
      utilities_wifi: wifi,
      utilities_parking: parking,
      utilities_toilet: toilet,
      utilities_kitchen: kitchen,
      dormitory,
      roomForRent,
      apartment,
      wholeHouse,
      sharedRoom,
      sortBy: props.sortBy,
      city: currentsearchLocation[0] === '' ? null: currentsearchLocation[0],
      district: [currentsearchLocation[1]],
      ward: currentsearchLocation[2]
    };

    props.search(searchParams)
  };

  const formatter = (value: number | any) =>
    `${currencyViCodeForPriceSlider(value)}`;

  return (
    <>
      <Row className={cx("filter-container")}>
        <Col span={24} className={cx("common-container")}>
          <Row>
            <Col span={24}>
              <p className={cx("common-label")}>Price</p>
            </Col>
            <Col span={24} className={cx("price-silder")}>
              <Slider
                onChange={(e: any) => handleSliderChange(e)}
                range
                defaultValue={[minPrice, maxPrice]}
                marks={marks}
                min={0}
                max={20000000}
                step={1000000}
                value={[minPrice, maxPrice]}
                tipFormatter={formatter}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24} className={cx("common-container")}>
          <Row>
            <Col span={24}>
              <p className={cx("common-label")}>Utilities</p>
            </Col>
            <Col
              span={24}
              className={`${cx("utilities-choice")} utilities-choice`}
            >
              <Row>
                {utilities.map((utility: any, index: any) => (
                  <Col
                    key={index}
                    span={6}
                    className={utility.className}
                    onClick={() => handleUtilitiesClick(utility.id)}
                  ></Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>

        <Col span={24} className={cx("common-container")}>
          <Row>
            <Col span={24}>
              <p className={cx("common-label")}>Kind of room</p>
            </Col>
            <Col span={24} className={`${cx("kind-of-room-choice")}`}>
              <Row>
                <Col span={12}>
                  <Checkbox
                    onChange={(e) => handleRoomTypeOnChecked(e, -1, -1)}
                    checked={allChecked}
                  >
                    All
                  </Checkbox>
                </Col>
                {roomType?.map((roomType: any, index: any) => (
                  <Col
                    key={index}
                    span={12}
                    className={`${cx("col-kind-of-room-choice")}`}
                  >
                    <Checkbox
                      onChange={(e) =>
                        handleRoomTypeOnChecked(e, roomType.value, index)
                      }
                      checked={check[index].isCheck}
                    >
                      {roomType.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>

        {/* <Col
          span={24}
          className={`${cx("common-container")}`}
          style={{ borderBottom: "none" }}
        >
          <Row>
            <Col span={24}>
              <p className={cx("common-label")}>Sex</p>
            </Col>
            <Col span={24} className={`${cx("sex-choice")}`}>
              <Row>
                <Col span={12}>
                  <Checkbox onChange={() => handleRoomTypeOnChecked("", "")}>
                    Male
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox onChange={() => handleRoomTypeOnChecked("", "")}>
                    Female
                  </Checkbox>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col> */}

        <Col className={cx("button-container")}>
          <Row className={cx("btn-action")}>
            <Col span={12}>
              <Button
                danger
                className={cx("btn", "btn-reset")}
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            </Col>
            <Col span={12}>
              <Button
                primary
                className={cx("btn", "btn-search")}
                onClick={() => handleSearch()}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Filter;
