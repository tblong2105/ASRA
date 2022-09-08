import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import { Row, Col, Table, Select, Spin, Tag, Image } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import useDebounce from "app/useDebounce";
import { openNotification } from "components/helper/Notification";
import { ERROR, SUCCESS } from "commons/constants/Notification";
import { BECOME_INNKEEPER, NOTIFICATION_TYPE } from "commons/constants";
import { SocketContext } from "app/socket";

import {
  getAllInnkeepers,
  getDetailsInnkeeper,
  updateStatusInnkeeper,
} from "api/admin";
import { getAllUserByUsernameAndInnkeeperRole } from "api/account";

import Button from "components/Layout/components/Button";
import AdminLayout from "components/Layout/AdminLayout";
import LoadingIcon from "components/Layout/components/Loading";
import ModalConfirm from "components/helper/ModalConfirm";
import styles from "./Innkeeper.module.scss";
import "./Innkeeper.scss";

interface InnkeeperAdmin {
  id: number;
  userName: string;
  fullName: string;
  icId: string;
  createdDate: string;
  status: string;
}

interface InnkeeperAdminRequest {
  page: number;
  keyword: string;
  sortBy: string;
  sortField: string;
  status: string;
}

interface DropdownData {
  key: number;
  valueText: string;
}

interface InnkeeperDetailAdmin {
  id: number;
  userName: string;
  fullName: string;
  frontImage: string;
  backImage: string;
  icId: string;
  icName: string;
  icBirthdate: string;
  icAddress: string;
  icIssueDate: string;
  icIssueLoc: string;
  gmailPaypal: string;
  createdDate: string;
  status: string;
}

function InnkeeperListAdmin() {
  const location: any = useLocation();
  const cx = classNames.bind(styles);
  const { Option } = Select;
  const socket = useContext(SocketContext);
  const userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");

  const [innkeeperListAdmin, setInnkeeperListAdmin] = useState<
    InnkeeperAdmin[]
  >([]);
  const [innkeeperNameListDropdown, setInnkeeperNameListDropdown] = useState<
    DropdownData[]
  >([]);
  const [searchUsernameVal, setSearchUsernameVal] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [dataReq, setDataReq] = useState<InnkeeperAdminRequest>({
    page: currentPage,
    keyword: "",
    sortBy: "",
    sortField: "",
    status: "1",
  });

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [updateInnkeeperStatusLoading, setUpdateInnkeeperStatusLoading] =
    useState<boolean>(false);
  const [
    updateInnkeeperRejectStatusLoading,
    setUpdateInnkeeperRejectStatusLoading,
  ] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("1");
  const [innkeeperDetailLoading, setInnkeeperDetailLoading] =
    useState<boolean>(false);
  const [innkeeperDetailData, setInnkeeperDetailData] =
    useState<InnkeeperDetailAdmin>({
      id: 0,
      userName: "",
      fullName: "",
      frontImage: "",
      backImage: "",
      icId: "",
      icName: "",
      icBirthdate: "",
      icAddress: "",
      icIssueDate: "",
      icIssueLoc: "",
      gmailPaypal: "",
      createdDate: "",
      status: "",
    });

  const [isAcceptModal, setIsAcceptModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);

  const debounced = useDebounce(searchUsernameVal, 500);

  const columns: ColumnsType<InnkeeperAdmin> = [
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
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "ID card",
      dataIndex: "icId",
      key: "icId",
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record: InnkeeperAdmin) => (
        <Tag color={record?.status === "1" ? "orange" : "green"}>
          {record?.status === "1"
            ? BECOME_INNKEEPER.PENDING_APPROVAL
            : BECOME_INNKEEPER.APPROVED}
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
    {
      title: "",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record: any) => (
        <span
          onClick={() => handleShowRequestBecomeInnkeeperModal(record?.id)}
          className="innkeeper-detail"
        >
          Detail
        </span>
      ),
    },
  ];

  const handleSearchStatus = (status: string) => {
    setSelectedStatus(status);
    dataReq["status"] = status;
    setDataReq(dataReq);
    loadData();
  };

  const handleChangeSearchUsername = (username: string) => {
    if (username === undefined) {
      setInnkeeperNameListDropdown([]);
      dataReq["keyword"] = "";
      setSearchUsernameVal(null);
      setDataReq(dataReq);
      loadData();
    } else {
      dataReq["keyword"] = username;
      setSearchUsernameVal(username);
      setDataReq(dataReq);
      loadData();
    }
  };

  const handleInputSearchUsername = (username: string) => {
    if (!username) {
      setInnkeeperNameListDropdown([]);
      return;
    }
    setSearchUsernameVal(username);
  };

  const handleUpdateInnkeeperStatus = (isAccept: boolean) => {
    let dataUpdateStatusInnkeeperReq = {
      id: innkeeperDetailData?.id,
      status: isAccept ? "OK" : "NG",
      isAccept,
    };
    isAccept
      ? setUpdateInnkeeperStatusLoading(true)
      : setUpdateInnkeeperRejectStatusLoading(true);
    updateStatusInnkeeper(dataUpdateStatusInnkeeperReq)
      .then((res: any) => {
        if (isAccept) {
          setIsAcceptModal(false);
          openNotification(
            SUCCESS,
            `${innkeeperDetailData?.icName} has become an innkeeper of the system`
          );
        } else {
          setIsRejectModal(false);
          openNotification(
            ERROR,
            `${innkeeperDetailData?.icName} hasn't become an innkeeper of the system`
          );
        }

        if (isAccept) {
          setSelectedStatus("2");
          setUpdateInnkeeperStatusLoading(false);
        } else {
          setUpdateInnkeeperRejectStatusLoading(false);
        }
        setIsModalVisible(false);
        let message = isAccept
          ? "Congratulations on becoming an innkeeper. You can post a new room now!"
          : "Requests to become an innkeeper are not accepted, please contact admin for more details.";
        socket.emit("sendNotification", {
          roomId: null,
          senderId: userInfor?.id,
          contractId: null,
          senderName: userInfor?.username,
          receiverName: innkeeperDetailData?.userName,
          message: message,
          type: NOTIFICATION_TYPE.ACCEPT_OR_REJECT,
          thumbnail: userInfor?.image && userInfor?.image,
        });
        dataReq["status"] = "2";
        loadData();
      })
      .catch((err) => {});
  };

  const handleShowRequestBecomeInnkeeperModal = (innkeeperId: string) => {
    setIsModalVisible(true);
    setInnkeeperDetailLoading(true);
    getDetailsInnkeeper(innkeeperId)
      .then((res: InnkeeperDetailAdmin | any) => {
        setInnkeeperDetailData(res);
        setInnkeeperDetailLoading(false);
      })
      .catch((err) => {});
  };

  const loadData = () => {
    setLoading(true);
    getAllInnkeepers(dataReq).then((res: any) => {
      setInnkeeperListAdmin(res.innkeepers.reverse());
      setCurrentPage(res.currentPage);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (location?.state?.sender) {
      dataReq["keyword"] = location?.state?.sender;
      setSearchUsernameVal(location?.state?.sender);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!searchUsernameVal) {
      setInnkeeperNameListDropdown([]);
      return;
    }
    setFetching(true);
    getAllUserByUsernameAndInnkeeperRole(debounced).then((res: any) => {
      setInnkeeperNameListDropdown(res);
      setFetching(false);
    });
  }, [debounced]);

  return (
    <AdminLayout>
      <>
        <Row className={cx("innkeeper-header")} gutter={16}>
          <Col className={cx("title")} span={14}>
            <h1>Innkeeper List</h1>
          </Col>
          <Col className={cx("status-search-tool")} span={5}>
            <Select
              value={selectedStatus}
              defaultValue="1"
              allowClear={true}
              onChange={(status: string) => handleSearchStatus(status)}
              placeholder="Status"
              style={{ width: "100%" }}
            >
              <Option value="1">Pending approval</Option>
              <Option value="2">Approved</Option>
            </Select>
          </Col>
          <Col className={cx("keyword-search-tool")} span={5}>
            <Select
              onSearch={handleInputSearchUsername}
              onChange={handleChangeSearchUsername}
              value={searchUsernameVal}
              loading={fetching ? true : false}
              style={{ width: "100%" }}
              placeholder="Input a innkeeper name"
              showSearch
              allowClear
            >
              {innkeeperNameListDropdown?.map((item: DropdownData) => (
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
          dataSource={innkeeperListAdmin}
          loading={loading}
          pagination={{
            pageSize: 10,
          }}
        />
        <ModalConfirm
          title="Become an innkeeper"
          isModalVisible={isModalVisible}
          close={() => setIsModalVisible(false)}
          width={600}
          zIndex={3}
          marginTop="10px"
          footer={[
            <>
              {innkeeperDetailData?.status === "1" ? (
                <Button
                  key={1}
                  id={1}
                  reject
                  small
                  onClick={() => setIsRejectModal(true)}
                >
                  Reject
                </Button>
              ) : (
                ""
              )}
            </>,
            <>
              {innkeeperDetailData?.status === "1" && (
                <Button
                  key={2}
                  id={2}
                  primary
                  small
                  onClick={() => setIsAcceptModal(true)}
                >
                  Accept
                </Button>
              )}
            </>,
          ]}
          children={
            <>
              {innkeeperDetailLoading ? (
                <div className="spin">
                  <Spin size="large" />
                </div>
              ) : (
                <div className={cx("innkeeper-request-wrapper")}>
                  <p className={cx("innkeeper-request-title")}>
                    <b>{innkeeperDetailData?.userName}</b>{" "}
                    {innkeeperDetailData?.status === "1"
                      ? "sent a request to become an innkeeper"
                      : "was 1 Innkeeper of the system"}
                  </p>
                  <div className={cx("image-identity-card")}>
                    <div style={{ marginRight: "20px" }}>
                      <div className={cx("image-border")}>
                        <Image
                          src={innkeeperDetailData?.frontImage}
                          alt="front-image"
                        />
                      </div>
                        <span>Front</span>
                    </div>
                    <div>
                      <div className={cx("image-border")}>
                        <Image
                          src={innkeeperDetailData?.backImage}
                          alt="back-image"
                        />
                      </div>
                       <span>Backside</span>
                    </div>
                  </div>
                  <Row className={cx("innkeeper-info-detail")}>
                    <Col className={cx("label-title")} span={24}>
                      <label>Full name:</label>
                      <p>{innkeeperDetailData?.icName}</p>
                    </Col>
                    <Col className={cx("label-title")} span={24}>
                      <label>Code:</label>
                      <p>{innkeeperDetailData?.icId}</p>
                    </Col>
                    <Col className={cx("label-title")} span={24}>
                      <label>Birthday:</label>
                      <p>{innkeeperDetailData?.icBirthdate}</p>
                    </Col>
                    <Col className={cx("label-title")} span={24}>
                      <label>Address:</label>
                      <p>{innkeeperDetailData?.icAddress}</p>
                    </Col>
                    <Col className={cx("label-title")} span={24}>
                      <label>Issue date:</label>
                      <p>{innkeeperDetailData?.icIssueDate}</p>
                    </Col>
                    <Col className={cx("label-title")} span={24}>
                      <label>Issue by:</label>
                      <p>{innkeeperDetailData?.icIssueLoc}</p>
                    </Col>
                  </Row>
                </div>
              )}
            </>
          }
        />
        <ModalConfirm
          title="Confirmation"
          isModalVisible={isAcceptModal}
          close={() => setIsAcceptModal(false)}
          zIndex={3}
          footer={[
            <Button
              key={1}
              id={1}
              cancel
              small
              onClick={() => setIsAcceptModal(false)}
            >
              Cancel
            </Button>,
            <Button
              key={2}
              id={2}
              submit
              small
              onClick={() => handleUpdateInnkeeperStatus(true)}
            >
              {updateInnkeeperStatusLoading && (
                <>
                  <LoadingIcon customStyles={{ fontSize: 14, color: "#fff" }} />
                  &nbsp;
                </>
              )}
              OK
            </Button>,
          ]}
          children={
            <div style={{ display: "flex", paddingLeft: "16px" }}>
              <ExclamationCircleOutlined
                style={{ fontSize: "22px", color: "#faad14" }}
              />
              <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
                {`Do you want to ${innkeeperDetailData?.icName} become an innkeeper of the system?`}
              </p>
            </div>
          }
        />
        <ModalConfirm
          title="Confirmation"
          isModalVisible={isRejectModal}
          close={() => setIsRejectModal(false)}
          zIndex={3}
          footer={[
            <Button
              key={1}
              id={1}
              cancel
              small
              onClick={() => setIsRejectModal(false)}
            >
              Cancel
            </Button>,
            <Button
              key={2}
              id={2}
              submit
              small
              onClick={() => handleUpdateInnkeeperStatus(false)}
            >
              {updateInnkeeperRejectStatusLoading && (
                <>
                  <LoadingIcon customStyles={{ fontSize: 14, color: "#fff" }} />
                  &nbsp;
                </>
              )}
              OK
            </Button>,
          ]}
          children={
            <div style={{ display: "flex", paddingLeft: "16px" }}>
              <ExclamationCircleOutlined
                style={{ fontSize: "22px", color: "#faad14" }}
              />
              <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
                Do you want to reject this request?
              </p>
            </div>
          }
        />
      </>
    </AdminLayout>
  );
}

export default InnkeeperListAdmin;
