import { createRef, useState, memo, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Select, Form, FormInstance } from "antd";
import ModalConfirm from "components/helper/ModalConfirm";
import Button from "components/Layout/components/Button";
import { checkDepositExist, createDepositRequest } from "api/deposit";
import { ROOM_PATH, NOTIFICATION_TYPE } from "commons/constants";
import { PAYMENT_DEPOSIT } from "commons/constants/Payment";
import { getRentalPrice } from "api/room";
import { getToken } from "commons/utils/js-cookie";
import { currencyViCode } from "commons/utils/mask";
import { SocketContext } from "app/socket";
import { validateMessages } from "helpers/ValidateMessage";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import LoadingIcon from "components/Layout/components/Loading";

function RoomDetailHeader({
  totalRoomEmpty,
  title,
  innkeeperRoom,
  userInfor,
  pathName,
  roomDetailProp,
  cx,
}: any) {
  const { Option } = Select;
  const params = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const socket = useContext(SocketContext);
  const [visible, setVisible] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositAmountSelected, setDepositAmountSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = createRef<FormInstance>();
  const roomId: string = params.roomId + "";
  const handleSubmit = () => {
    formRef.current?.submit();
  };
  let token = Boolean(getToken());

  useEffect(() => {
    getRentalPrice(+roomId).then((res: any) => {
      setDepositAmount(+res / 2);
    });
  }, []);
  const saveData = (data: any) => {
    //Check deposit exist
    checkDepositExist(+roomId).then((res) => {
      if (res === false) {
        const billInformation = {
          billPayerName: userInfor.fullname,
          billPayerAddesss: userInfor.address,
          billPayeeName: roomDetailProp.innkeeperFullName,
          billPayeeAddress: roomDetailProp.innkeeperAddress,
          totalBill: data.depositAmount,
          describe: `Deposit Holder for room at ${roomDetailProp.address}`,
          depositHolder: data.depositAmount,
          description: `Deposit Holder for room at ${roomDetailProp.address}`,
          roomId: params.roomId,
          innkeeperUserName: roomDetailProp?.innkeeperUserName,
          roomAddress: roomDetailProp.address,
        };
        if (data?.depositAmount === 0) {
          let dataReq = {
            roomId: params?.roomId,
            username: userInfor.username,
            depositCost: data?.depositAmount,
          };
          setLoading(true);
          createDepositRequest(dataReq).then((res) => {
            socket.emit("sendNotification", {
              roomId: params?.roomId,
              senderId: userInfor?.id,
              contractId: null,
              senderName: userInfor?.username,
              receiverName: roomDetailProp.innkeeperUserName,
              message: `has sent a deposit request for the room at ${roomDetailProp.address}.`,
              type: NOTIFICATION_TYPE.DEPOSIT,
              thumbnail: userInfor?.image && userInfor?.image,
            });
            setLoading(false);
            openNotification(SUCCESS, "Request deposit holder successfully");
            setVisible(false);
          });
        } else {
          navigate("/paypal", {
            state: {
              type: PAYMENT_DEPOSIT,
              depositAmount: data.depositAmount,
              billInformation: billInformation,
            },
          });
        }
      }
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const format = (data: any) => {
    return data?.toLocaleString("vn-VN");
  };

  return (
    <>
      {/*ROOM DETAIL HEADER */}
      <Row>
        <Col className={cx("title-wrapper")} span={15}>
          <div className={cx("title")}>
            <h1>{title}</h1>
          </div>
        </Col>
        {pathName.includes(ROOM_PATH.FROM_HOME) && (
          <Col
            style={
              pathName.includes(ROOM_PATH.FROM_HOME) && {
                paddingRight: "12px",
              }
            }
            className={cx("btn-deposit")}
            span={9}
          >
            {token && !innkeeperRoom && (
              <Button
                onClick={showModal}
                disabled={totalRoomEmpty === 0}
                primary
              >
                Deposit Holder
              </Button>
            )}
            <ModalConfirm
              title="Deposit Holder"
              isModalVisible={visible}
              zIndex={3}
              close={() => {
                setDepositAmountSelected(null);
                setVisible(false);
              }}
              footer={[
                <Button
                  key={1}
                  cancel
                  small
                  onClick={() => {
                    setDepositAmountSelected(null);
                    setVisible(false);
                  }}
                >
                  Cancel
                </Button>,
                <Button key={2} submit small onClick={handleSubmit}>
                  {loading && (
                    <>
                      <LoadingIcon
                        customStyles={{ fontSize: 14, color: "#fff" }}
                      />
                      &nbsp;{" "}
                    </>
                  )}
                  Submit
                </Button>,
              ]}
              children={
                <Form
                  ref={formRef}
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={saveData}
                  validateMessages={validateMessages}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      margin: "-8px 0 20px 4px",
                      color: "#5f6367",
                    }}
                  >
                    If you choose the 50% deposit amount option, your request
                    will be more attentive to the innkeeper. That amount will be
                    kept by our system and will be used to pay in case you
                    create a contract or return it if you cancel.
                  </div>
                  <Form.Item
                    label="Deposit Holder Amount"
                    name="depositAmount"
                    style={{ width: "100%", fontSize: "16px" }}
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select a option"
                      size="large"
                      allowClear
                      value={depositAmountSelected}
                    >
                      <Option key={1} value={depositAmount}>
                        {currencyViCode(depositAmount)} (50% deposit amount)
                      </Option>
                      <Option key={2} value={0}>
                        0 VND
                      </Option>
                    </Select>
                  </Form.Item>
                </Form>
              }
            />
          </Col>
        )}
        {pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) && (
          <Col className={cx("edit-room")} span={9}>
            <Row>
              <Col span={24}>
                <Button
                  primary
                  onClick={() =>
                    navigate(`/manage/room-for-rent/${params?.roomId}/edit`)
                  }
                >
                  Edit Room
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </>
  );
}

export default memo(RoomDetailHeader);
