import { useState, useEffect, memo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Table, Tag, Row, Col, Select, Dropdown, Menu } from "antd";
import Button from "components/Layout/components/Button";

import {
  EllipsisOutlined,
  ImportOutlined,
  SolutionOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { UserSwitchOutlined } from "@ant-design/icons";
import { Deposit } from "models/Room";
import { depositCols } from "commons/constants/room-screen";
import { getDepositList, refundDeposit } from "api/deposit";
import { getAllUserDepositedRoom } from "api/account";
import { DEPOSIT_REQUEST_STATUS } from "commons/constants";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import ModalConfirm from "components/helper/ModalConfirm";

const { Option } = Select;

interface DropdownData {
  key: number;
  valueText: string;
}

interface DepositRequest {
  page: number;
  roomId: string | any;
  keyword: string;
  sortBy: string;
  sortField: string;
  status: string;
}

function DepositRequests(props: any) {
  const params = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location: any = useLocation();

  const [originDataDeposit, setOriginDataDeposit] = useState<Deposit[]>([]);
  const [userDropdownData, setUserDropdownData] = useState<DropdownData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<number | string | any>(null);
  const [isModalConfirmVisible, setIsModaConfirmlVisible] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [dataReq, setDataReq] = useState<DepositRequest>({
    page: currentPage,
    roomId: params?.roomId,
    keyword: "",
    sortBy: "",
    sortField: "",
    status: DEPOSIT_REQUEST_STATUS.PENDING_APPROVAL,
  });

  const cx = props.cx;
  const address = props.address;
  const innkeeperId = props.innkeeperId;
  const dataDetailForDeposit = props.dataDetailForDeposit;

  const depositColumn: any = [
    ...depositCols,
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_: any, { status }: any) => {
        return (
          <>
            <Tag
              color={
                status === DEPOSIT_REQUEST_STATUS.APPROVED
                  ? "green"
                  : status === DEPOSIT_REQUEST_STATUS.CANCEL
                  ? "blue"
                  : status === DEPOSIT_REQUEST_STATUS.REFUND
                  ? "blue"
                  : "volcano"
              }
            >
              {status === DEPOSIT_REQUEST_STATUS.APPROVED
                ? DEPOSIT_REQUEST_STATUS.APPROVED
                : status === DEPOSIT_REQUEST_STATUS.CANCEL
                ? DEPOSIT_REQUEST_STATUS.CANCEL
                : status === DEPOSIT_REQUEST_STATUS.REFUND
                ? DEPOSIT_REQUEST_STATUS.REFUND
                : DEPOSIT_REQUEST_STATUS.PENDING_APPROVAL}
            </Tag>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return (
          <div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="create-contract"
                    icon={<SolutionOutlined />}
                    disabled={
                      record.status == DEPOSIT_REQUEST_STATUS.APPROVED ||
                      record.status == DEPOSIT_REQUEST_STATUS.CANCEL ||
                      record.status == DEPOSIT_REQUEST_STATUS.REFUND
                    }
                    onClick={() => handleCreateContractOnClick(record)}
                  >
                    Create Contract
                  </Menu.Item>
                  <Menu.Item
                    key="refurn-deposit-holder"
                    icon={<ImportOutlined />}
                    disabled={
                      record.status == DEPOSIT_REQUEST_STATUS.APPROVED ||
                      record.status == DEPOSIT_REQUEST_STATUS.CANCEL ||
                      record.status == DEPOSIT_REQUEST_STATUS.REFUND
                    }
                    onClick={() => handleRefundDepositOnClick(record)}
                  >
                    Refund
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <EllipsisOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleRefundDepositOnClick = (record: any) => {
    setRecord(record);
    setIsModaConfirmlVisible(true);
  };

  const handleModalConfirmClick = () => {
    setDisabledButton(true)
    refundDeposit(record.id).then((result: any) => {
      getDepositList(dataReq)
        .then((res: any) => {
          setDisabledButton(false)
          setOriginDataDeposit(res?.deposits);
          setCurrentPage(res?.currentPage);
          props.depositStatusChangeCallBackFunc();
          openNotification(SUCCESS, result.message.messageDetail);
          setIsModaConfirmlVisible(false);
        })
        .catch((err) => {});
    });
  };

  const handleCreateContractOnClick = (record: any) => {
    navigate(`/contract/new`, {
      state: {
        roomId: params?.roomId,
        depositRecord: record,
        address: address,
        innkeeperId: innkeeperId,
        rentalPrice: dataDetailForDeposit.rentalPrice,
        electronicPrice: dataDetailForDeposit.electricityCost,
        waterPrice: dataDetailForDeposit.waterCost,
        internetPrice: dataDetailForDeposit.internetCost,
        deposit: dataDetailForDeposit.deposit,
        receiver: location?.state?.sender,
      },
    });
  };

  const loadDataDepositListTab = () => {
    setLoading(true);
    getDepositList(dataReq)
      .then((res: any) => {
        setOriginDataDeposit(res?.deposits);
        setCurrentPage(res?.currentPage);
        setLoading(false);
      })
      .catch((err) => {});
  };

  const initDepositListTab = () => {
    setLoading(true);
    dataReq["status"] = DEPOSIT_REQUEST_STATUS.PENDING_APPROVAL;
    getDepositList(dataReq)
      .then((res: any) => {
        setOriginDataDeposit(res?.deposits);
        setCurrentPage(res?.currentPage);
        setLoading(false);
      })
      .catch((err) => {});
  };

  const handleChangeDepositStatusDropdown = (depositStatus: string) => {
    if (!depositStatus) {
      depositStatus = "";
    }
    dataReq["status"] = depositStatus;
    loadDataDepositListTab();
  };

  const handleChangeSearchUsername = (username: string) => {
    setSearchText(username);
    dataReq["keyword"] = username;
    loadDataDepositListTab();
  };

  const loadUsernameDropdownData = () => {
    getAllUserDepositedRoom(Number(params?.roomId)).then((res: any) => {
      setUserDropdownData(res);
    });
  };

  useEffect(() => {
    loadUsernameDropdownData();
    if (location?.state?.sender) {
      handleChangeSearchUsername(location?.state?.sender);
      setSearchText(location?.state?.sender);
    } else {
      initDepositListTab();
    }
  }, []);

  return (
    <>
      <Col className={cx("tenant-info-card")} span={24}>
        <Row gutter={16}>
          <Col className={cx("title")} span={6}>
            <UserSwitchOutlined className={cx("tenant-icon")} />
            <span className={cx("tenant-info-text")}>Deposit Requests</span>
          </Col>
          <Col span={6} />
          <Col className={`${cx("deposit-status")} deposit-status`} span={6}>
            <Select
              onChange={handleChangeDepositStatusDropdown}
              allowClear
              defaultValue={DEPOSIT_REQUEST_STATUS.PENDING_APPROVAL}
              placeholder="Select deposit status"
              style={{ width: "100%" }}
            >
              <Option value={DEPOSIT_REQUEST_STATUS.PENDING_APPROVAL}>
                Pending approval
              </Option>
              <Option value={DEPOSIT_REQUEST_STATUS.APPROVED}>Approved</Option>
              <Option value={DEPOSIT_REQUEST_STATUS.REFUND}>Refurn</Option>
              <Option value={DEPOSIT_REQUEST_STATUS.CANCEL}>Cancel</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              onChange={handleChangeSearchUsername}
              value={searchText}
              showSearch
              allowClear
              placeholder="Input a user"
              style={{ width: "100%" }}
            >
              {userDropdownData?.map((item: DropdownData) => (
                <Select.Option key={item?.key} value={item?.valueText}>
                  {item?.valueText}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row className={cx("tenant-info-description")}>
          <Table
            rowKey="id"
            dataSource={originDataDeposit}
            columns={depositColumn}
            loading={loading}
            pagination={{
              pageSize: 5,
            }}
          />
        </Row>
      </Col>
      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalConfirmVisible}
        zIndex={3}
        close={() => setIsModaConfirmlVisible(false)}
        footer={[
          <Button
            key={1}
            id={1}
            cancel
            small
            onClick={() => setIsModaConfirmlVisible(false)}
            disabled={disabledButton}
          >
            Cancel
          </Button>,
          <Button key={2} id={2} submit small onClick={handleModalConfirmClick} disabled={disabledButton}>
            OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              Do you want to refund the deposit request?
            </p>
          </div>
        }
      />
    </>
  );
}

export default memo(DepositRequests);
