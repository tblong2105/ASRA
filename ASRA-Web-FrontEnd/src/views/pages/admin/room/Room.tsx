import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Row, Col, Table, Select, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";

import { currencyViCode } from "commons/utils/mask";
import { getAllRoomAdmin } from "api/admin";
import { getAllUsersByInnkeeperRoom } from "api/account";

import AdminLayout from "components/Layout/AdminLayout";
import styles from "./Room.module.scss";
import "./Room.scss";

const { Option } = Select;
const cx = classNames.bind(styles);

interface RoomAdmin {
  id: number;
  userName: string;
  roomType: string;
  title: string;
  rentalPrice: number;
  status: boolean;
  createdDate: string;
}

interface RoomAdminRequest {
  page: number;
  keyword: string;
  sortBy: string;
  sortField: string;
  status: boolean;
}

interface DropdownData {
  key: number;
  valueText: string;
}

function RoomListAdmin() {
  const [roomListAdmin, setRoomListAdmin] = useState<RoomAdmin[]>([]);
  const [userListInnkeeperRole, setUserListInnkeeperRole] = useState<
    DropdownData[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [dataReq, setDataReq] = useState<RoomAdminRequest>({
    page: currentPage,
    keyword: "",
    sortBy: "",
    sortField: "",
    status: true,
  });

  const columns: ColumnsType<RoomAdmin> = [
    {
      title: "No",
      key: "index",
      width: 30,
      align: "center",
      render: (value, item, index) => (index += 1),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Rental Price",
      dataIndex: "rentalPrice",
      key: "rentalPrice",
      align: "right",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => a.rentalPrice - b.rentalPrice,
      render: (text: string, record: RoomAdmin, index: number) =>
        currencyViCode(record?.rentalPrice),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record: RoomAdmin) => {
        return (
          <Tag color={record?.status ? "orange" : "green"}>
            {record?.status ? "Visible" : "Invisible"}
          </Tag>
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "right",
      sorter: (a: any, b: any) =>
        moment(a.createdDate).unix() - moment(b.createdDate).unix(),
      render: (text: string) => moment(Date.parse(text)).format("MMM DD, YYYY"),
    },
  ];

  const handleSearchStatus = (status: boolean) => {
    dataReq["status"] = status;
    setDataReq(dataReq);
    loadData();
  };

  const handleChangeUsername = (username: string) => {
    dataReq["keyword"] = username;
    setDataReq(dataReq);
    loadData();
  };

  const handleClearKeywordSearch: any = (): any => {
    dataReq["keyword"] = "";
    loadData();
    return true;
  };

  const loadData = () => {
    setLoading(true);
    getAllRoomAdmin(dataReq).then((res: any) => {
      setRoomListAdmin(res.rooms);
      setCurrentPage(res.currentPage);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    getAllUsersByInnkeeperRoom().then((userListDropdown: any) => {
      setUserListInnkeeperRole(userListDropdown);
    });
  }, []);
  return (
    <AdminLayout>
      <>
        <Row className={cx("room-header")} gutter={16}>
          <Col className={cx("title")} span={14}>
            <h1>Room List</h1>
          </Col>
          <Col className={cx("status-search-tool")} span={5}>
            <Select
              defaultValue={true}
              onChange={(status: boolean) => handleSearchStatus(status)}
              placeholder="Status"
              style={{ width: "100%" }}
            >
              <Option value={true}>Visible</Option>
              <Option value={false}>Invisible</Option>
            </Select>
          </Col>
          <Col className={cx("keyword-search-tool")} span={5}>
            <Select
              className={cx("keyword-search")}
              allowClear={handleClearKeywordSearch}
              placeholder="Select a username"
              optionFilterProp="children"
              onChange={handleChangeUsername}
              filterOption={(input, option) => {
                return (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {userListInnkeeperRole?.map((item: DropdownData) => (
                <Select.Option key={item?.key} value={item?.valueText}>
                  {item?.valueText}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={roomListAdmin}
          loading={loading}
          pagination={{
            pageSize: 10,
          }}
        />
      </>
    </AdminLayout>
  );
}

export default RoomListAdmin;
