import { getInnkeeperContractList, terminateContract } from "api/contract";
import {
  CalculatorOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Col, Row, Table, Tag, Dropdown, Menu, Form, InputNumber } from "antd";
import Button from "components/Layout/components/Button";
import { useEffect, useState } from "react";
import moment from "moment";
import { CONTRACT_STATUS } from "commons/constants";
import { PAYMENT_STATUS } from "commons/constants/Payment";
import { openNotification } from "components/helper/Notification";
import { ERROR, SUCCESS } from "commons/constants/Notification";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ModalConfirm from "components/helper/ModalConfirm";
import { validateMessages } from "helpers/ValidateMessage";
import { createBillNormal } from "api/bill";

export default function RoomContracts(props: any) {
  const params = useParams<{ roomId: string }>();
  const [originDataContracts, setOriginDataContracts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateBillModalVisible, setCreateBillIsModalVisible] =
    useState(false);
  const [titleCreateBillModal, setTitleCreateBillModal] = useState("");
  const [currentContractRecord, setCurrentContractRecord] = useState<any>({});
  const [isModalConfirmVisible, setIsModaConfirmlVisible] = useState(false);
  const [createBillModalSubmit, setCreateBillModalSubmit] =
    useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const navigate = useNavigate();
  const cx = props.cx;
  const roomId: string = params.roomId + "";
  let monthLeft: number;
  const [form] = Form.useForm();

  const contractColumns: any = [
    {
      title: "TenantName",
      dataIndex: "tenantName",
      key: "tenantName",
    },
    {
      title: "RoomName",
      dataIndex: "roomDetailName",
      key: "roomDetailName",
    },
    {
      title: "RentalPrice",
      dataIndex: "rentalPrice",
      key: "rentalPrice",
      render: (text: string) => format(text) + " VND",
    },
    {
      title: "Expired Duration",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => {
        const toDay = new Date().getDate();
        const toMonth = new Date().getMonth() + 1;
        const toYear = new Date().getFullYear();
        const dayExpired = moment(Date.parse(text)).toDate().getDate();
        const monthExpired = moment(Date.parse(text)).toDate().getMonth() + 1;
        const yearExpired = moment(Date.parse(text)).toDate().getFullYear();

        monthLeft = Math.ceil(
          ((yearExpired - toYear) * 360 +
            (monthExpired - toMonth) * 30 +
            (dayExpired - toDay)) /
          30
        );
        return (
          <>
            {monthLeft} {monthLeft > 1 ? "Months" : "Month"}
          </>
        );
      },
    },
    {
      title: "Contract Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, { status }: any) => {
        return (
          <div>
            <Tag
              color={
                status === CONTRACT_STATUS.WAITING_TENANT_CONFIRM
                  ? "orange"
                  : status === CONTRACT_STATUS.IS_ACTIVE
                    ? monthLeft > 1
                      ? "green"
                      : "volcano"
                    : status === CONTRACT_STATUS.EXPIRED
                      ? "red"
                      : status === CONTRACT_STATUS.CHECKED_OUT
                        ? "geekblue"
                        : "purple"
              }
            >
              {status !== CONTRACT_STATUS.IS_ACTIVE
                ? status
                : monthLeft > 1 &&
                  status !== CONTRACT_STATUS.WAITING_TENANT_CONFIRM
                  ? CONTRACT_STATUS.IS_ACTIVE
                  : CONTRACT_STATUS.ALMOST_EXPIRED}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text: string, { status }: any) => {
        const toMonth = new Date().getMonth() + 1;
        const toYear = new Date().getFullYear();
        let paymentDate;
        if (
          status === CONTRACT_STATUS.IS_ACTIVE ||
          status === CONTRACT_STATUS.ALMOST_EXPIRED ||
          status === CONTRACT_STATUS.REQUEST_TERMINATE
        ) {
          paymentDate = moment(`${toMonth}-${text}-${toYear}`).format(
            "DD-MMM-YYYY"
          );
        }
        return <>{paymentDate}</>;
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text: string, record: any) => {
        return (
          <div>
            {(record.status === CONTRACT_STATUS.IS_ACTIVE ||
              record.status === CONTRACT_STATUS.ALMOST_EXPIRED ||
              record.status === CONTRACT_STATUS.REQUEST_TERMINATE) && (
                <Tag
                  color={
                    text === PAYMENT_STATUS.WAITING_CREATE_BILL
                      ? "orange"
                      : text === PAYMENT_STATUS.NOT_YET
                        ? "red"
                        : text === PAYMENT_STATUS.PAID
                          ? "green"
                          : "purple"
                  }
                >
                  {text === PAYMENT_STATUS.WAITING_CREATE_BILL ? "WAITING_CREATE_INVOICE" : text}
                </Tag>
              )}
          </div>
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
                    key="view"
                    icon={<FileDoneOutlined />}
                    onClick={() => contractRowClick(record)}
                  >
                    View Contract
                  </Menu.Item>
                  <Menu.Item
                    key="invoice"
                    icon={<CalculatorOutlined />}
                    disabled={
                      !(
                        record.paymentStatus ===
                        PAYMENT_STATUS.WAITING_CREATE_BILL &&
                        (record.status === CONTRACT_STATUS.IS_ACTIVE ||
                          record.status === CONTRACT_STATUS.ALMOST_EXPIRED ||
                          record.status === CONTRACT_STATUS.REQUEST_TERMINATE)
                      )
                    }
                    onClick={() => handleCreateBillOnClick(record)}
                  >
                    Create Invoice
                  </Menu.Item>
                  <Menu.Item
                    key="terminate"
                    icon={<CloseCircleOutlined />}
                    disabled={
                      record.status === CONTRACT_STATUS.EXPIRED ||
                      record.status ===
                      CONTRACT_STATUS.WAITING_TENANT_CONFIRM ||
                      record.status === CONTRACT_STATUS.TERMINATE ||
                      record.status === CONTRACT_STATUS.CHECKED_OUT
                    }
                    onClick={() => handleTerminateOnClick(record)}
                  >
                    Terminate
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
  useEffect(() => {
    getInnkeeperContractList(roomId).then((res) => {
      setOriginDataContracts(res);
      setLoading(false);
    }).catch((e) => {
      setLoading(false);
    });
  }, []);

  const handleCreateBillOnClick = (record: any) => {
    if (record.paymentStatus !== PAYMENT_STATUS.WAITING_CREATE_BILL) {
      openNotification(ERROR, "Invoice already exists!");
    } else {
      setCurrentContractRecord(record);
      setTitleCreateBillModal(
        `Create Invocie For Room ` +
        record.roomDetailName +
        " At " +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear()
      );
      setCreateBillIsModalVisible(true);
      setCreateBillModalSubmit(false);
    }
  };

  const handleTerminateOnClick = (record: any) => {
    setCurrentContractRecord(record);
    setIsModaConfirmlVisible(true);
  };

  const handleModalConfirmClick = () => {
    setDisabledButton(true)
    terminateContract(currentContractRecord.id).then((result: any) => {
      setIsModaConfirmlVisible(false)
      getInnkeeperContractList(roomId).then((res) => {
        setDisabledButton(false)
        setOriginDataContracts(res);
        openNotification(SUCCESS, result.message.message.messageDetail);
      });
    });
  };

  const format = (data: any) => {
    return data?.toLocaleString("vn-VN");
  };

  const handleCreateBillModalCancel = () => {
    setCreateBillIsModalVisible(false);
  };

  const handleCreateBillNormal = () => {
    form.submit()
  }

  const handleFormCreateBillNormal = (data: any) => {
    setDisabledButton(true)
    let createBillRequest = {
      ...data,
      payerId: currentContractRecord.accountTenantId,
      contractId: currentContractRecord.id,
      dues: currentContractRecord.paymentDate,
    };
    createBillNormal(createBillRequest).then((res) => {
      setDisabledButton(false)
      openNotification(SUCCESS, res.message);
      createBillSubmitAction()
      setCreateBillIsModalVisible(false);
    });
  }

  const createBillSubmitAction = () => {
    //Reload data table
    setLoading(true);
    props.contractStatusChangeCallBackFunc();
    getInnkeeperContractList(roomId).then((res) => {
      setOriginDataContracts(res);
      setLoading(false);
    });
  };

  const contractRowClick = (record: any) => {
    navigate(`/contract/detail/${record.id}`);
  };

  return (
    <div className="room-contract">
      <Col className={cx("tenant-info-card")} span={24}>
        <Row>
          <Col className={cx("title")} span={4}>
            <ScheduleOutlined className={cx("tenant-icon")} />
            <span className={cx("tenant-info-text")}>Contracts</span>
          </Col>
        </Row>
        <Row className={cx("tenant-info-description")}>
          <Table
            rowKey="id"
            dataSource={originDataContracts}
            columns={contractColumns}
            loading={loading}
            pagination={{
              pageSize: 5,
            }}
          />
        </Row>
      </Col>
      <ModalConfirm
        title={titleCreateBillModal}
        isModalVisible={isCreateBillModalVisible}
        zIndex={3}
        close={handleCreateBillModalCancel}
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
          <Button key={2} id={2} submit small onClick={handleCreateBillNormal} disabled={disabledButton}>
            Submit
          </Button>,
        ]}
        children={
          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            form={form}
            onFinish={handleFormCreateBillNormal}
            validateMessages={validateMessages}
          >
            <Row className={cx("form_data")}>
              <Col span={12}>
                <Form.Item
                  className={cx("col_left")}
                  label="Kw of Electricity"
                  name="kw"
                  rules={[
                    { required: true, message: "Kw of Electricity is required!" },
                    {
                      required: true,
                      type: "number",
                      min: 1,
                      max: 9999,
                      message: "Kw of Electricity must be between 1 and 9999",
                    },
                  ]}

                >
                  <InputNumber
                    className={`input-number`}
                    placeholder="Enter Kw of Electricity"
                    controls={false}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className={cx("col_right")}
                  label="Capacity"
                  name="capacity"
                  rules={[
                    { required: true, message: "Capacity is required!" },
                    { type: "number", min: 1, max: 10 },
                  ]}
                >
                  <InputNumber
                    className={`input-number`}
                    placeholder="Enter capacity"
                    controls={false}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        }
      />

      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalConfirmVisible}
        zIndex={3}
        close={() => {
          setIsModaConfirmlVisible(false);
        }}
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
              Do you want to terminate this contract?
            </p>
          </div>
        }
      />
    </div>
  );
}
