import { AppDispatch } from "@/store";
import { AutoComplete, Col } from "antd";
import { useAppSelector } from "app/hooks";
import classNames from "classnames/bind";
import { LOCALTION } from "commons/constants/LocalstorageConstant";
import { useEffect, useState, memo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { citySearchSelector, searchSelector } from "store/selectors";
import {
  citySearch,
  dataLocation,
  dataSearch,
} from "../../../../store/feature/search/searchSlice";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "./index.scss";
import styles from "./Search.module.scss";

const { Option } = AutoComplete;

const cx = classNames.bind(styles);

function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [valueSearch, setValueSearch] = useState<string>("");
  let search = useAppSelector(searchSelector);
  let citySearchValue = useAppSelector(citySearchSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const location = useLocation();
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleClickLoupe();
    }
  };

  useEffect(()=> {
    if(location.pathname.split("/").length === 3 && citySearchValue){
      setValueSearch("")
      dispatch(dataSearch(""))
    }
  },[citySearchValue])

  const handleClickLoupe = () => {
    dispatch(dataLocation(search));
    dispatch(citySearch(false))
    let searchSplit: any[] = search.split(", ");
    switch (searchSplit.length) {
      case 1:
        navigate(`/search/${searchSplit[0]}`);
        break;
      case 2:
        navigate(`/search/${searchSplit[0]}/${searchSplit[1]}`);
        break;
      case 3:
        navigate(
          `/search/${searchSplit[0]}/${searchSplit[1]}/${searchSplit[2]}`
        );
        break;
      default:
        break;
      }
  };

  //===========================
  const [result, setResult] = useState<string[]>([]);

  const locationFile = JSON.parse(localStorage.getItem(LOCALTION) || "[]");

  function removeAccents(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  const handleClear = () => {
    setValueSearch("");
    setResult([]);
    dispatch(dataSearch(""))
    inputRef.current.focus();
  };

  useEffect(() => {
    setValueSearch(search)
    if (!valueSearch.trim()) {
      setResult([]);
      return;
    }
    setLoading(true);
    let timer1 = setTimeout(() => {
      let res: string[] = [];
      if (!valueSearch) {
        res = [];
      } else {
        let tempValue = removeAccents(valueSearch.toLowerCase()).trim();
        locationFile.map((item: any, index: number) => {
          let originItem = item;
          originItem = originItem.replace(/,/g, "");
          originItem = removeAccents(originItem.toLowerCase()).trim();

          let tempItem = item;
          tempItem = tempItem.replace(/,/g, "");
          tempItem = tempItem.replace(/Thành phố /g, "");
          tempItem = tempItem.replace(/Quận /g, "");
          tempItem = tempItem.replace(/Huyện /g, "");
          tempItem = removeAccents(tempItem.toLowerCase()).trim();

          if (tempItem.includes(tempValue) || originItem.includes(tempValue)) {
            if (!res.includes(item)) {
              res.push(item);
            }
          } else {
            return [];
          }
        });
      }

      dispatch(dataSearch(valueSearch));
      setResult(res);
      setLoading(false);
    }, 250);
    return () => {
      clearTimeout(timer1);
    };
  }, [valueSearch]);

  const handleSearch = (value: string) => {
    setValueSearch(value);
    dispatch(dataSearch(value));
  };

  const onSelect = (data: string) => {
    setValueSearch(data);
    dispatch(dataSearch(data));
  };

  return (
    <>
      <Col className={`${cx("search")} search-component`} span={7}>
        <AutoComplete
          ref={inputRef}
          className={cx("input-search")}
          onSearch={handleSearch}
          onSelect={onSelect}
          placeholder="Enter a location"
          onKeyDown={handleKeyPress}
          value={valueSearch}
        >
          {result.map((email: string) => (
            <Option key={email} value={email}>
              {email}
            </Option>
          ))}
        </AutoComplete>
        {!!valueSearch && !loading && (
          <CloseCircleOutlined onClick={handleClear} className={cx("clear")} />
        )}
        {/* {loading && <LoadingOutlined className={cx("loading")} />} */}
        <span className={cx("spliter")}></span>
        <div
          className={`${cx("loupe-icon")} loupe-icon`}
          onClick={() => handleClickLoupe()}
        />
      </Col>
    </>
  );
}

export default memo(Search);
