import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import classnames from "classnames/bind";
import {decode as atob, encode as btoa} from 'base-64'
import { CURRENCE_CONVERT } from "commons/constants/Payment";
import { NOTIFICATION_TYPE } from "commons/constants";
import { CreatePayment } from "api/payment";
import { createDepositRequest } from "api/deposit";
import { SocketContext } from "app/socket";

import styles from "./DepositHolderNativeAppPaypal.module.scss";

const cx = classnames.bind(styles);

function Paypal() {
  const { depositInfo, userInfo } = useParams();
  const socket = useContext(SocketContext);
  const depositInfoJSON = JSON.parse(depositInfo);
  const userInfoJSON = JSON.parse(userInfo);
  const paypal = useRef();
  const [currencyConvert] = useState(CURRENCE_CONVERT);
  const [paymentStatus, setPaymentStatus] = useState(false)
  const [orderId, setOrderId] = useState("")
  useEffect(() => {
    document.body.style.width = "375px !important";
    document.getElementsByClassName("App")[0].style.width = "375px !important";
    if (currencyConvert !== 0) {
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: `Deposit Holder for room at ${depositInfoJSON?.roomAddress}`,
                  amount: {
                    currency_code: "USD",
                    value: (
                      Number(depositInfoJSON?.depositAmount) / currencyConvert
                    ).toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            setOrderId(order.id)
            const dataCreatePaymentReq = mappingResData(order);
            CreatePayment(dataCreatePaymentReq).then((res) => {
              let dataCreateDepositReq = {
                roomId: depositInfoJSON?.roomId,
                username: userInfoJSON?.username,
                depositCost: Number(depositInfoJSON?.depositAmount),
                paymentId: res.paymentId
              };
              createDepositRequest(dataCreateDepositReq).then((res) => {
                setPaymentStatus(true)
                socket.emit("sendNotification", {
                  roomId: depositInfoJSON?.roomId,
                  senderId: userInfoJSON?.id,
                  contractId: null,
                  senderName: userInfoJSON?.username,
                  receiverName: depositInfoJSON?.innkeeperUserName,
                  message: `has sent a deposit request for the room at ${depositInfoJSON?.roomAddress}.`,
                  type: NOTIFICATION_TYPE.DEPOSIT,
                  thumbnail: userInfoJSON?.image && atob(userInfoJSON?.image),
                });
              });
            });
            // window.ReactNativeWebView &&
            //   window.ReactNativeWebView.postMessage(JSON.stringify(order));
            return order;
          },
          onError: (err) => {
            let errObj = {
              err: err,
              status: "FAILED",
            };
            window.ReactNativeWebView &&
              window.ReactNativeWebView.postMessage(JSON.stringify(errObj));
          },
        })
        .render(paypal.current);
    }
  }, [currencyConvert]);

  const format = (data) => {
    return data?.toLocaleString("vn-VN");
  };

  const mappingResData = (order) => {
    return {
      idPayment: order.id,
      links: order.links[0].href,
      payerId: order.payer.payer_id,
      payerGivenName: order.payer.name.given_name,
      payerSurname: order.payer.name.surname,
      payerEmailAddress: order.payer.email_address,
      payerCountryCode: order.payer.address.country_code,
      vndAmount: Number(depositInfoJSON?.depositAmount),
      paymentAmount: order.purchase_units[0].amount.value,
      currencyCode: order.purchase_units[0].amount.currency_code,
      description: order.purchase_units[0].description,
      payeeEmailAddres: order.purchase_units[0].payee.email_address,
    };
  };

  return (
    <>
      <Row
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          marginLeft: "8px",
        }}
      >
        <Col style={{ width: "100%" }} xs={6} sm={24} md={24} lg={24} xl={24}>
          <div className={cx("paypal-contaiter")}>
            <div className={cx("paypal-box")}>
              <Row>
              {!paymentStatus ? (<Col span={24} className={cx("Invoice-title")}>
                  Invoice
                </Col>) : (
                  <>
                    <Col span={8} className={cx("invoice-title")}>
                      Bill
                    </Col>
                    <Col span={16} className={cx("invoice-no")}>
                      No: {(orderId).slice(0, 6)}
                    </Col>
                    <Col span={24}>
                      <div className={`${cx("success-icon")} success-icon`}></div>

                    </Col>
                    <Col span={24} className={cx("invoice-status")}>
                      Payment Success
                    </Col></>
                )}
                <Col span={12} className={cx("from-section")}>
                  <Row>
                    <Col span={24} className={cx("title")}>
                      FROM:
                    </Col>
                    <Col span={24} className={cx("name")}>
                      {userInfoJSON?.fullname}
                    </Col>
                    <Col style={{ lineHeight: "120%" }} span={24}>
                      {userInfoJSON?.address}
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className={cx("to-section")}>
                  <Row>
                    <Col span={24} className={cx("title")}>
                      TO:
                    </Col>
                    <Col span={24} className={cx("name")}>
                      {depositInfoJSON?.innkeeperFullName}
                    </Col>
                    <Col style={{ lineHeight: "120%" }} span={24}>
                      {depositInfoJSON?.innkeeperAddress}
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("detail-section")}>
                  <Row>
                    <Col span={24} className={cx("subject-section")}>
                      Subject: <b>Deposit Holder {!paymentStatus ? "Invoice" : "Bill"}</b>
                    </Col>
                    <Col span={24} className={cx("describe-section")}>
                      Describe:{" "}
                      {`Deposit Holder for room at ${depositInfoJSON?.roomAddress}`}
                    </Col>
                    <Col span={24} className={cx("header-section")}>
                      <Row>
                        <Col span={8} className={cx("header")}>
                          DESCRIPTION
                        </Col>
                        <Col span={4} className={cx("header", "alg-r")}>
                          QTY
                        </Col>
                        <Col span={6} className={cx("header", "alg-r")}>
                          RATE
                        </Col>
                        <Col span={6} className={cx("header", "alg-r")}>
                          AMOUNT
                        </Col>
                      </Row>
                    </Col>

                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col span={8} className={cx("title")}>
                          Deposit Holder
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}>
                          1
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(Number(depositInfoJSON?.depositAmount))}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(Number(depositInfoJSON?.depositAmount))}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("line-big")}></Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col
                          span={8}
                          className={cx("title", "sub-total-title")}
                        >
                          Sub Total
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}></Col>
                        <Col span={6} className={cx("alg-r", "detail")}></Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(Number(depositInfoJSON?.depositAmount))}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col
                          span={8}
                          className={cx("title", "sub-total-title")}
                        >
                          GST(0%)
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}></Col>
                        <Col span={6} className={cx("alg-r", "detail")}></Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          0
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("line-small")}></Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col span={8} className={cx("title", "total-title")}>
                          Total
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}></Col>
                        <Col span={12} className={cx("alg-r", "total-price")}>
                          {format(Number(depositInfoJSON?.depositAmount))}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col
                          span={8}
                          className={cx("title", "total-title")}
                        ></Col>
                        <Col span={4} className={cx("alg-r", "detail")}></Col>
                        <Col span={12} className={cx("alg-r", "total-price")}>
                          $
                          {format(
                            (
                              Number(depositInfoJSON?.depositAmount) /
                              currencyConvert
                            ).toFixed(2)
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("footer-section")}>
                    {
                        !paymentStatus && <div className={cx("paypal-button")} ref={paypal}></div>
                      }
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("line-small")}></Col>
                <Col span={24} className={cx("footer")}>
                  <span style={{ fontSize: "16px" }}>asra.coporation@gmail.com</span>
                </Col>
                <Col span={24} className={cx("footer")}>
                  +84 783 546 885
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Paypal;
