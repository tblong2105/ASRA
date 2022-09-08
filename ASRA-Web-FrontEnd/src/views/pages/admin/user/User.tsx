import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Row, Col, Table, Select, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import useDebounce from "app/useDebounce";
import { getAllUserAdmin } from "api/admin";
import { getAllUserByUsernameAndInnkeeperRole } from "api/account";
import {
  ROLE_INNKEEPER,
  ROLE_USER,
  ROLE_GUEST,
  ROLE_ADMIN,
} from "commons/constants/Role";

import AdminLayout from "components/Layout/AdminLayout";
import styles from "./User.module.scss";

const { Option } = Select;
const cx = classNames.bind(styles);

interface UserAdmin {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  createdDate: string;
}

interface UserAdminRequest {
  page: number;
  keyword: string;
  sortBy: string;
  sortField: string;
  role: string;
  status: boolean;
}

interface DropdownData {
  key: number;
  valueText: string;
}

function UserListAdmin() {
  const [userListAdmin, setUserListAdmin] = useState<UserAdmin[]>([]);
  const [innkeeperListDropdown, setInnkeeperListDropdown] = useState<
    DropdownData[]
  >([]);
  const [searchUsernameVal, setSearchUsernameVal] = useState<string>("");
  const [currentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [dataReq, setDataReq] = useState<UserAdminRequest>({
    page: currentPage,
    keyword: "",
    sortBy: "",
    sortField: "",
    role: "",
    status: true,
  });

  const debounced = useDebounce(searchUsernameVal, 500);

  const columns: ColumnsType<UserAdmin> = [
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "right",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string, record: UserAdmin) => (
        <Tag
          color={
            record?.role === ROLE_GUEST
              ? "blue"
              : record?.role === ROLE_USER
              ? "green"
              : record?.role === ROLE_INNKEEPER
              ? "orange"
              : ""
          }
        >
          {record?.role === ROLE_GUEST
            ? ROLE_GUEST
            : record?.role === ROLE_USER
            ? ROLE_USER
            : record?.role === ROLE_INNKEEPER && ROLE_INNKEEPER}
        </Tag>
      ),
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

  const handleSearchRole = (role: string) => {
    dataReq["role"] = role;
    setDataReq(dataReq);
    loadData();
  };

  const handleChangeSearchUsername = (username: string) => {
    if (username === undefined) {
      setInnkeeperListDropdown([]);
      username = "";
    }
    dataReq["keyword"] = username;
    setDataReq(dataReq);
    loadData();
  };

  const handleInputSearchUsername = (username: string) => {
    if (!username) {
      setInnkeeperListDropdown([]);
      return;
    }
    setSearchUsernameVal(username);
  };

  const loadData = () => {
    setLoading(true);
    getAllUserAdmin(dataReq).then((res: any) => {
      let originData = res?.users?.filter(
        (user: UserAdmin) => user?.role !== ROLE_ADMIN
      );
      setUserListAdmin(originData);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchUsernameVal) {
      setInnkeeperListDropdown([]);
      return;
    }
    setFetching(true);
    getAllUserByUsernameAndInnkeeperRole(debounced).then((res: any) => {
      setInnkeeperListDropdown(res);
      setFetching(false);
    });
  }, [debounced]);

  return (
    <AdminLayout>
      <>
        <Row className={cx("user-header")} gutter={16}>
          <Col className={cx("title")} span={14}>
            <h1>User List</h1>
          </Col>
          <Col className={cx("status-search-tool")} span={5}>
            <Select
              onChange={(role: string) => handleSearchRole(role)}
              placeholder="Role"
              style={{ width: "100%" }}
            >
              <Option value={ROLE_INNKEEPER}>Innkeeper</Option>
              <Option value={ROLE_USER}>User</Option>
              <Option value={ROLE_GUEST}>Guest</Option>
            </Select>
          </Col>
          <Col className={cx("keyword-search-tool")} span={5}>
            <Select
              style={{ width: "100%" }}
              placeholder="Input a username"
              onSearch={handleInputSearchUsername}
              onChange={handleChangeSearchUsername}
              showSearch
              allowClear
              loading={fetching ? true : false}
            >
              {innkeeperListDropdown?.map((item: DropdownData) => (
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
          dataSource={userListAdmin}
          loading={loading}
          pagination={{
            pageSize: 10,
          }}
        />
      </>
    </AdminLayout>
  );
}

export default UserListAdmin;
