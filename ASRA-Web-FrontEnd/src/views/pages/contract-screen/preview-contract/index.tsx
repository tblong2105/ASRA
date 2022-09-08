import classnames from "classnames/bind";
import styles from "./index.module.scss";
import { Form, Row, Col } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Button from "components/Layout/components/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { CreateContractRequestBody } from "models/Contract";
import { createContract, requestTerminateContract } from "api/contract";
import moment from "moment";
import { openNotification } from "components/helper/Notification";
import { ERROR, SUCCESS } from "commons/constants/Notification";
import { CONTRACT_STATUS, NOTIFICATION_TYPE } from "commons/constants";
import { useReactToPrint } from "react-to-print";
import SignaturePad from "react-signature-canvas";
import "./index.scss";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "commons/utils/firebase";
import { v4 } from "uuid";
import ModalConfirm from "components/helper/ModalConfirm";
import { Link } from "react-router-dom";
import { SocketContext } from "app/socket";

const cx = classnames.bind(styles);

export default function PreviewContract({
  currentViewDetailDataContract,
}: any) {
  const parse = require("html-react-parser");
  const navigate = useNavigate();
  const params = useParams();
  const { state }: any = useLocation();
  const [dataContract, setDataContract] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalSignVisible, setIsModalSignVisible] = useState(false);
  const [isModalConfirmVisible, setIsModaConfirmlVisible] = useState(false);
  const [isModalConfirmTerminateVisible, setIsModaConfirmTerminateVisible] =
    useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const dateFormat = "MMM DD, YYYY";
  const userInforId: any = JSON.parse(
    localStorage.getItem("userInfor") || ""
  ).id;
  const contractContentPDFRef = useRef<any>();
  let sigPad: any = {};
  const socket = useContext(SocketContext);
  const userInfoForSocket = JSON.parse(localStorage.getItem("userInfor") || "");

  const convertToDate = (dateString: string) => {
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d = dateString.split("-");
    let dat = new Date(d[2] + "-" + d[1] + "-" + d[0]);
    return dat;
  };

  //View detail data contract
  useEffect(() => {
    if (currentViewDetailDataContract) {
      setDataContract(currentViewDetailDataContract);
    }
  }, [currentViewDetailDataContract]);

  useEffect(() => {
    if (state) {
      if (state.dataContract) {
        setDataContract(state.dataContract);
      }
    }
  }, [state]);

  const handleCreateContract = (innkeeperSignature: string) => {
    let createContractRequestBody: CreateContractRequestBody;
    createContractRequestBody = {
      ...dataContract,
      contractCreateDate: moment(
        dataContract.contractCreateDate,
        dateFormat
      ).toDate(),
      endDate: moment(dataContract.endDate, dateFormat).toDate(),
      innkeeperBirthdate: moment(
        dataContract.innkeeperBirthdate,
        dateFormat
      ).toDate(),
      innkeeperDateOfIssuanceOfIdentityCard: moment(
        dataContract.innkeeperDateOfIssuanceOfIdentityCard,
        dateFormat
      ).toDate(),
      startDate: moment(dataContract.startDate, dateFormat).toDate(),
      tenantBirthday: moment(dataContract.tenantBirthday, dateFormat).toDate(),
      tenantIcIssueDate: moment(
        dataContract.tenantIcIssueDate,
        dateFormat
      ).toDate(),
      accountTenantId: state.accountTenantId,
      roomId: +state.roomId,
      innkeeperSignature: innkeeperSignature,
    };

    createContract(createContractRequestBody)
      .then((res) => {
        setDisabledButton(false);
        openNotification(SUCCESS, res.message.message.messageDetail);
        setIsModalVisible(false);
        
        socket.emit("sendNotification", {
          roomId: +state?.roomId,
          senderId: userInfoForSocket?.id,
          contractId: res.id ? Number(res.id) : null,
          senderName: userInfoForSocket?.username,
          receiverName: state?.receiver,
          message: `has created a contract for the room at ${dataContract?.contractCreateAddress}.`,
          type: NOTIFICATION_TYPE.CREATE_CONTRACT,
          thumbnail: userInfoForSocket?.image && userInfoForSocket?.image,
        });
        navigate(`/contract/detail/${res.id}`);
      })
      .catch((res) => {
        setDisabledButton(false);
      });
  };

  const handleBackClick = () => {
    navigate("/contract/new", {
      state: state,
    });
  };

  const createContractSubmit = () => {
    setIsModalSignVisible(true);
  };

  const printPDF = (e: any) => {
    e.preventDefault();
    handlePrint();
  };

  const requestTerminate = () => {
    setIsModaConfirmTerminateVisible(true);
  };

  const handleModalConfirmTerminateClick = () => {
    requestTerminateContract(currentViewDetailDataContract.contractId).then(
      (res: any) => {
        setIsModaConfirmTerminateVisible(false)
        openNotification(SUCCESS, res.message.message.messageDetail);
      }
    );
  };

  const handlePrint = useReactToPrint({
    content: () => contractContentPDFRef.current,
  });

  const handleSignOk = () => {
    if (sigPad.isEmpty()) {
      openNotification(ERROR, "Please signature contract before submitting.");
    } else {
      setIsModaConfirmlVisible(true);
    }
  };

  const handleModalConfirmClick = () => {
    setDisabledButton(true);
    const signatureImage = sigPad.getTrimmedCanvas().toDataURL("image/png");
    urlToBlob(signatureImage).then((blob) => {
      handleUploadFileFirebase(blob).then((res: any) => {        
        if (!currentViewDetailDataContract) {
          handleCreateContract(res);
        } else {
          const notificationData = {
            roomId: +state?.roomId,
            senderId: userInfoForSocket?.id,
            contractId: res.id ? Number(res.id) : null,
            senderName: userInfoForSocket?.username,
            receiverName: state?.receiverName,
            message: `signed a contract for the room at ${dataContract?.contractCreateAddress}.`,
            type: NOTIFICATION_TYPE.SIGN_CONTRACT,
            thumbnail: userInfoForSocket?.image && userInfoForSocket?.image,
          };
          navigate(`/contract/detail/${res.id}`);
          navigate(`/payment/bill/${dataContract.billId}`, {
            state: {
              tenantSignature: res,
              notificationData: notificationData,
            },
          });
        }
      });
    });
  };

  const handleUploadFileFirebase = (imageUpload: any) => {
    let metadata = {
      contentType: ["image/jpeg", "image/png"],
    };
    let imageRef = ref(storage, `signature/signature_${v4()}`);
    let uploadTask = uploadBytesResumable(imageRef, imageUpload);
    if (Object.getPrototypeOf(imageUpload) === Object.prototype) {
      return Promise.resolve(null);
    }
    // Listen for state changes, errors, and completion of the upload.
    let imageUploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        async () => {
          // Get images uploaded from firebase
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
              return downloadURL;
            })
            .catch((err) => reject(err))
            .finally(() => {});
        }
      );
    });

    return imageUploadPromise;
  };

  function urlToBlob(url: string) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  }

  const handleSignCancel = () => {
    setIsModalSignVisible(false);
  };

  const handleSignClear = () => {
    sigPad.clear();
  };

  const handleSignature = (e: any) => {
    e.preventDefault();
    setIsModalSignVisible(true);
  };

  const format = (data: any) => {
    return data?.toLocaleString("vn-VN");
  };

  return (
    <>
      <div className={cx("contract_screen")} ref={contractContentPDFRef}>
        <Form
          name="basic"
          autoComplete="off"
          layout="vertical"
          onFinish={createContractSubmit}
        >
          <div className={cx("contract_container")}>
            <div className={cx("contract_box")}>
              <Row>
                <Col span={24}>
                  <div className={cx("contract_national_name")}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_crest")}>
                    Độc lập – Tự do – Hạnh phúc
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_title")}>
                    HỢP ĐỒNG THUÊ PHÒNG TRỌ
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_first_text")}>
                    {!dataContract
                      ? "Hôm nay: ngày ... tháng ... năm ... ."
                      : `Hôm nay: ngày ${
                          new Date(
                            convertToDate(dataContract?.contractCreateDate)
                          ).getDate()
                        } tháng ${
                          new Date(
                            convertToDate(dataContract?.contractCreateDate)
                          ).getMonth() + 1
                        } năm ${new Date(
                          convertToDate(dataContract?.contractCreateDate)
                        ).getFullYear()}`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")} style={{wordBreak:"break-all"}}>
                    {!dataContract
                      ? "Tại địa chỉ: .................... ."
                      : `Tại địa chỉ: ${dataContract.contractCreateAddress} .`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_first_text")}>
                    Chúng tôi gồm:
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    1. Đại diện bên cho thuê phòng trọ (Innkeeper):
                  </div>
                </Col>
                <Col span={6}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Ông/bà: .................... .`
                      : `Ông/bà: ${dataContract.innkeeperName}`}
                  </div>
                </Col>
                <Col span={6}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Sinh ngày: .................... .`
                      : `Sinh ngày: ${dataContract.innkeeperBirthdate}`}
                  </div>
                </Col>
                <Col span={12}>
                  <div className={cx("contract_text")} style={{wordBreak:"break-all"}}>
                    {!dataContract
                      ? `Nơi đăng ký HK: .................... .`
                      : `Nơi đăng ký HK: ${dataContract.innkeeperPermanentResidence}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? ` CMND/CCCD số: ...................., Cấp ngày: .../.../...`
                      : ` CMND/CCCD số: ${dataContract.innkeeperIdentityCardNo}, Cấp ngày: ${dataContract.innkeeperDateOfIssuanceOfIdentityCard}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")} style={{wordBreak:"break-all"}}>
                    {!dataContract
                      ? ` Tại: ...................................................... .`
                      : ` Tại: ${dataContract.innkeeperThePlaceIdentityCard}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Số điện thoại: .................... .`
                      : `Số điện thoại: ${dataContract.innkeeperPhoneNumber}`}
                  </div>
                </Col>
                <Col span={24}>
                  <br></br>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    2. Bên thuê phòng trọ (Tenant):
                  </div>
                </Col>
                <Col span={6}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Ông/bà: .................... .`
                      : `Ông/bà: ${dataContract.tenantName.toUpperCase()}`}
                  </div>
                </Col>
                <Col span={6}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Sinh ngày: .................... .`
                      : `Sinh ngày: ${dataContract.tenantBirthday}`}
                  </div>
                </Col>
                <Col span={12}>
                  <div className={cx("contract_text")} style={{wordBreak:"break-all"}}>
                    {!dataContract
                      ? `Nơi đăng ký HK: .................... .`
                      : `Nơi đăng ký HK: ${dataContract.tenantPermanentResidence.toUpperCase()}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? ` CMND/CCCD số: ...................., Cấp ngày: .../.../...`
                      : ` CMND/CCCD số: ${dataContract.tenantIcNo}, Cấp ngày: ${dataContract.tenantIcIssueDate}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")} style={{wordBreak:"break-all"}}>
                    {!dataContract
                      ? ` Tại: ...................................................... .`
                      : ` Tại: ${dataContract.tenantIcIssueLoc.toUpperCase()}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Số điện thoại: .................... .`
                      : `Số điện thoại: ${dataContract.tenantPhoneNumber}`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_first_text")}>
                    Sau khi bàn bạc trên tinh thần dân chủ, hai bên cùng có lợi,
                    cùng thống nhất như sau:
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    Bên cho thuê phòng trọ đồng ý cho bên thuê phòng trọ thuê 01
                    phòng ở tại địa chỉ:
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")} style={{wordBreak:"break-all"}}>
                    {!dataContract
                      ? `......................................................................`
                      : `${dataContract.contractCreateAddress}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Giá thuê: .................... đồng/tháng .`
                      : `Giá thuê: ${format(
                          dataContract.rentalPrice
                        )} đồng/tháng.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Hình thức thanh toán: .................... .`
                      : `Hình thức thanh toán: Thanh toán qua ${dataContract.paymentType}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Tiền điện .................... đồng/kwh tính theo chỉ số
                    công tơ, thanh toán vào cuối các tháng.`
                      : `Tiền điện ${format(
                          dataContract.electronicPrice
                        )} đồng/kwh tính theo chỉ số
                    công tơ, thanh toán vào cuối các tháng.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Tiền nước: ................... đồng/người thanh toán vào đầu
                    các tháng.`
                      : `Tiền nước: ${format(
                          dataContract.waterPrice
                        )} đồng/người thanh toán vào đầu
                    các tháng.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? `Tiền đặt cọc: .................... đồng.`
                      : `Tiền đặt cọc: ${format(dataContract.deposit)} đồng.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    {!dataContract
                      ? ` Hợp đồng có giá trị kể từ ngày ... tháng ... năm ... đến
                    ngày ... tháng ... năm ... .`
                      : ` Hợp đồng có giá trị kể từ ${dataContract.startDate} đến
                    ${dataContract.endDate}.`}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_first_text")}>
                    Trách nhiệm của các bên:
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    1. Trách nhiệm của bên cho thuê phòng trọ (Innkeeper):
                  </div>
                </Col>
                <Col span={24}>
                  <div
                    className={cx("contract_text")}
                    style={{ marginLeft: 20 }}
                  >
                    {!dataContract?.innkeeperResponsibility ? (
                      <div>
                        - Tạo mọi điều kiện thuận lợi để bên B thực hiện theo
                        hợp đồng.
                        <br></br>- Cung cấp nguồn điện, nước, wifi cho bên B sử
                        dụng.
                      </div>
                    ) : (
                      <div style={{wordBreak:"break-all"}}>
                        {parse(
                          `${dataContract?.innkeeperResponsibility?.replaceAll(
                            "\n",
                            "<br>"
                          )}`
                        )}
                      </div>
                    )}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_text")}>
                    2. Trách nhiệm của bên thuê phòng trọ (Tenant):
                  </div>
                </Col>
                <Col span={24}>
                  <div
                    className={cx("contract_text")}
                    style={{ marginLeft: 20 }}
                  >
                    {!dataContract?.tenantResponsibility ? (
                      <div>
                        - Thanh toán đầy đủ các khoản tiền theo đúng thỏa thuận.
                        <br></br>- Bảo quản các trang thiết bị và cơ sở vật chất
                        của bên A trang bị cho ban đầu làm hỏng phải sửa, mất
                        phải đền.
                        <br></br>- Không được tự ý sửa chữa, cải tạo cơ sở vật
                        chất khi chưa được sự đồng ý của bên A.
                        <br></br>- Giữ gìn vệ sinh trong và ngoài khuôn viên của
                        phòng trọ. - Bên B phải chấp hành mọi quy định của pháp
                        luật Nhà nước và quy định của địa phương.
                        <br></br>- Nếu bên B cho khách ở qua đêm thì phải báo và
                        được sự đồng ý của chủ nhà đồng thời phải chịu trách
                        nhiệm về các hành vi vi phạm pháp luật của khách trong
                        thời gian ở lại.
                      </div>
                    ) : (
                      <div style={{wordBreak:"break-all"}}>
                        {parse(
                          `${dataContract?.tenantResponsibility?.replaceAll(
                            "\n",
                            "<br>"
                          )}`
                        )}
                      </div>
                    )}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("contract_first_text")}>
                    Trách nhiệm chung:
                  </div>
                </Col>
                <Col span={24}>
                  <div
                    className={cx("contract_text")}
                    style={{ marginLeft: 20 }}
                  >
                    {!dataContract?.commonResponsibility ? (
                      <div>
                        - Hai bên phải tạo điều kiện cho nhau thực hiện hợp
                        đồng.
                        <br></br>- Trong thời gian hợp đồng còn hiệu lực nếu bên
                        nào vi phạm các điều khoản đã thỏa thuận thì bên còn lại
                        có quyền đơn phương chấm dứt hợp đồng; nếu sự vi phạm
                        hợp đồng đó gây tổn thất cho bên bị vi phạm hợp đồng thì
                        bên vi phạm hợp đồng phải bồi thường thiệt hại.
                        <br></br>- Một trong hai bên muốn chấm dứt hợp đồng
                        trước thời hạn thì phải báo trước cho bên kia ít nhất 30
                        ngày và hai bên phải có sự thống nhất.
                        <br></br>- Bên A phải trả lại tiền đặt cọc cho bên B.
                        <br></br>- Bên nào vi phạm điều khoản chung thì phải
                        chịu trách nhiệm trước pháp luật.
                        <br></br>- Hợp đồng được lập thành 02 bản có giá trị
                        pháp lý như nhau, mỗi bên giữ một bản.
                      </div>
                    ) : (
                      <div style={{wordBreak:"break-all"}}>
                        {parse(
                          `${dataContract?.commonResponsibility?.replaceAll(
                            "\n",
                            "<br>"
                          )}`
                        )}
                      </div>
                    )}

                    {/* TODO ngắt dòng */}
                  </div>
                </Col>
                <Col span={24}>
                  <Row className={cx("contract-row")}>
                    <Col span={12}>
                      <div className={cx("col_left")}>
                        <p>Đại diện bên thuê phòng trọ</p>
                        <img
                          style={{ width: "40%" }}
                          src={currentViewDetailDataContract?.tenantSignature}
                        ></img>
                        <p>
                          {currentViewDetailDataContract &&
                          currentViewDetailDataContract?.status !==
                            CONTRACT_STATUS.WAITING_TENANT_CONFIRM
                            ? currentViewDetailDataContract.tenantName.toUpperCase()
                            : ""}
                        </p>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={cx("col_right")}>
                        <p>Đại diện bên cho thuê phòng trọ</p>
                        <img
                          style={{ width: "40%" }}
                          src={
                            currentViewDetailDataContract?.innkeeperSignature
                          }
                        ></img>
                        <p>
                          {currentViewDetailDataContract
                            ? currentViewDetailDataContract.innkeeperName.toUpperCase()
                            : ""}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          {currentViewDetailDataContract?.status ===
            CONTRACT_STATUS.WAITING_TENANT_CONFIRM &&
            currentViewDetailDataContract?.tenantId === userInforId && (
              <>
                <Form.Item
                  className={styles.form_buton}
                  wrapperCol={{ span: 24 }}
                >
                  {/* Button Create Contract */}
                  {/* <Button
                    primary
                    className={styles.btn_create_contract}
                    onClick={(e: any) => handleSign(e)}
                  >
                    Sign
                  </Button> */}
                  <Button
                    primary
                    className={styles.btn_create_contract}
                    onClick={(e: any) => handleSignature(e)}
                  >
                    Sign
                  </Button>
                </Form.Item>
              </>
            )}

          {!currentViewDetailDataContract && state && (
            <Form.Item className={styles.form_buton} wrapperCol={{ span: 24 }}>
              {/* Button Cancel */}
              <Button
                primary
                className={styles.btn_cancel}
                onClick={() => handleBackClick()}
              >
                Back
              </Button>

              {/* Button Create Contract */}
              <Button
                type="submit"
                primary
                className={styles.btn_create_contract}
              >
                Create Contract
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
      {currentViewDetailDataContract &&
        currentViewDetailDataContract?.status !==
          CONTRACT_STATUS.WAITING_TENANT_CONFIRM && (
          <Row className={cx("btn-print-section")}>
            <Col span={24}>
              <Button
                primary
                className={styles.btn_create_contract}
                onClick={(e: any) => printPDF(e)}
              >
                Print PDF
              </Button>
              {currentViewDetailDataContract?.status !==
                CONTRACT_STATUS.EXPIRED &&
                +currentViewDetailDataContract.tenantId ===
                  +JSON.parse(localStorage.getItem("userInfor") || "").id && (
                  <Button
                    style={{ marginLeft: "8px", backgroundColor: "#e03c31" }}
                    primary
                    className={styles.btn_create_contract}
                    onClick={(e: any) => requestTerminate()}
                  >
                    Terminate
                  </Button>
                )}
            </Col>
          </Row>
        )}
      <Link
        to={"/manage"}
        state={{
          tabkey: 1,
        }}
      >
        {`<< Back to management page`}
      </Link>
      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalVisible}
        zIndex={3}
        close={() => setIsModalVisible(false)}
        footer={[
          <Button
            key={1}
            id={1}
            cancel
            small
            onClick={() => setIsModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button key={2} id={2} submit small onClick={handleCreateContract}>
            OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              Do you want to create a contract?
            </p>
          </div>
        }
      />

      <ModalConfirm
        title="Signpad"
        className="modal-sign-create-contract"
        width={700}
        zIndex={3}
        marginTop="70px"
        isModalVisible={isModalSignVisible}
        close={handleSignCancel}
        footer={[
          <Button
            key={1}
            id={1}
            disabled={disabledButton}
            danger
            small
            className={styles.modalSignBtn}
            onClick={handleSignClear}
          >
            Clear
          </Button>,
          <Button
            key={2}
            id={2}
            disabled={disabledButton}
            primary
            small
            className={styles.modalSignBtn}
            onClick={handleSignOk}
          >
            Sign
          </Button>,
        ]}
        children={
          <SignaturePad
            canvasProps={{ width: 700, height: 500, className: styles.sigPad }}
            minWidth={1}
            maxWidth={1}
            backgroundColor={"#fff"}
            ref={(ref: any) => {
              sigPad = ref;
            }}
          />
        }
      />
      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalConfirmVisible}
        zIndex={3}
        close={() => setIsModaConfirmlVisible(false)}
        footer={[
          <Button
            key={1}
            id={1}
            disabled={disabledButton}
            cancel
            small
            onClick={() => setIsModaConfirmlVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key={2}
            id={2}
            disabled={disabledButton}
            submit
            small
            onClick={() => handleModalConfirmClick()}
          >
            OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              {`Do you want to ${
                currentViewDetailDataContract?.tenantId === userInforId
                  ? "sign"
                  : "create"
              } this contract?`}
            </p>
          </div>
        }
      />
      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalConfirmTerminateVisible}
        zIndex={3}
        close={() => setIsModaConfirmTerminateVisible(false)}
        footer={[
          <Button
            key={1}
            id={1}
            disabled={disabledButton}
            cancel
            small
            onClick={() => setIsModaConfirmTerminateVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key={2}
            id={2}
            disabled={disabledButton}
            submit
            small
            onClick={() => handleModalConfirmTerminateClick()}
          >
            OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              Do you want to request termination of this contract?
            </p>
          </div>
        }
      />
    </>
  );
}
