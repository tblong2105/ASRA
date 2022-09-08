import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./paypal.module.scss";
import { convertCurrence, getCurrenceConvert } from "api/currenceConver";
import { Col, Row } from "antd";
import { CreatePayment } from "api/payment";
import { ERROR, SUCCESS } from "commons/constants/Notification";
import { openNotification } from "components/helper/Notification";
import { createDepositRequest } from "api/deposit";
import { CURRENCE_CONVERT, PAYMENT_DEPOSIT } from "commons/constants/Payment";
import { NOTIFICATION_TYPE } from "commons/constants";
import moment from "moment";
import { SocketContext } from "app/socket";
const cx = classnames.bind(styles);

export default function PayPal() {
  const navigate = useNavigate();
  const paypal = useRef();
  const socket = useContext(SocketContext);
  const { state } = useLocation();
  const depositAmount = state.depositAmount;
  const billInformation = state.billInformation;
  const [currenceConvert, setCurrenceConvert] = useState(CURRENCE_CONVERT);
  const userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  var currentDate = new Date();
  useEffect(() => {
    if (depositAmount) {
      if (currenceConvert !== 0) {
        window.paypal
          .Buttons({
            createOrder: (data, actions, err) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: state?.billInformation.description,
                    amount: {
                      currency_code: "USD",
                      value: (depositAmount / currenceConvert).toFixed(2),
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              const resRequestBody = mappingResData(order);
              CreatePayment(resRequestBody).then((res) => {
                if (state.type === PAYMENT_DEPOSIT) {
                  let dataReq = {
                    roomId: state.billInformation.roomId,
                    username: userInfor.username,
                    depositCost: depositAmount,
                    paymentId: res.paymentId
                  };
                  createDepositRequest(dataReq).then((res) => {
                    socket.emit("sendNotification", {
                      roomId: state.billInformation.roomId,
                      senderId: userInfor?.id,
                      contractId: null,
                      senderName: userInfor?.username,
                      receiverName: state?.billInformation?.innkeeperUserName,
                      message: `has sent a deposit request for the room at ${state?.billInformation?.roomAddress}.`,
                      type: NOTIFICATION_TYPE.DEPOSIT,
                      thumbnail: userInfor?.image && userInfor?.image,
                    });
                  });
                }
                openNotification(
                  SUCCESS,
                  `${res.message.message.messageDetail}`
                );
                navigate(`/depositholder/information`, {
                  state: {
                    orderId: order.id,
                    billInformation: state?.billInformation,
                  },
                });
              });
            },
            onError: (err) => {
              openNotification(ERROR, err);
            },
          })
          .render(paypal.current);
      }
    }
  }, [currenceConvert]);

  const mappingResData = (order) => {
    return {
      idPayment: order.id,
      links: order.links[0].href,
      payerId: order.payer.payer_id,
      payerGivenName: order.payer.name.given_name,
      payerSurname: order.payer.name.surname,
      payerEmailAddress: order.payer.email_address,
      payerCountryCode: order.payer.address.country_code,
      vndAmount: depositAmount,
      paymentAmount: order.purchase_units[0].amount.value,
      currencyCode: order.purchase_units[0].amount.currency_code,
      description: order.purchase_units[0].description,
      payeeEmailAddres: order.purchase_units[0].payee.email_address,
    };
  };
  const format = (data) => {
    return data.toLocaleString("vn-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <div className={cx("paypal-contaiter")}>
        <div className={cx("paypal-box")}>
          <Row>
            <Col span={24} className={cx("Invoice-title")}>
              Invoice
            </Col>
            <Col span={8} className={cx("from-section")}>
              <Row>
                <Col span={24} className={cx("title")}>
                  FROM:
                </Col>
                <Col span={24} className={cx("name")}>
                  {billInformation?.billPayerName}
                </Col>
                <Col span={24}>{billInformation?.billPayerAddesss}</Col>
              </Row>
            </Col>
            <Col span={8} className={cx("to-section")}>
              <Row>
                <Col span={24} className={cx("title")}>
                  TO:
                </Col>
                <Col span={24} className={cx("name")}>
                  {billInformation?.billPayeeName}
                </Col>
                <Col span={24}>{billInformation?.billPayeeAddress}</Col>
              </Row>
            </Col>
            <Col span={8} className={cx("info-section")}>
              <Row>
                <Col span={24} className={cx("title")}>
                  INFO:
                </Col>
                <Col span={24} className={cx("name")}>
                  Amount: $
                  {(billInformation?.totalBill / currenceConvert).toFixed(2)}
                </Col>
                <Col span={24} className={cx("mb-2")}>
                  Date:{" "}
                  {moment(
                    `${currentDate.getDate()}/${
                      currentDate.getMonth() + 1
                    }/${currentDate.getFullYear()}`,
                    "DDMMYYYY"
                  ).format("DD/MM/YYYY")}
                </Col>
                <Col span={24} className={cx("mb-2")}>
                  RED: INV-057
                </Col>
                <Col span={24} className={cx("mb-2")}>
                  Dues:{" "}
                  {moment(
                    `${currentDate.getDate()}/${
                      currentDate.getMonth() + 1
                    }/${currentDate.getFullYear()}`,
                    "DDMMYYYY"
                  ).format("DD/MM/YYYY")}
                </Col>
              </Row>
            </Col>
            <Col span={8}></Col>
            <Col span={16} className={cx("detail-section")}>
              <Row>
                <Col span={24} className={cx("subject-section")}>
                  Subject: <b>Deposit Holder Invoice</b>
                </Col>
                <Col span={24} className={cx("describe-section")}>
                  Describe: {billInformation?.describe}
                </Col>
                <Col span={24} className={cx("header-section")}>
                  <Row>
                    <Col span={8} className={cx("header")}>
                      ITEM DESCRIPTION
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
                      {format(billInformation?.totalBill)}
                    </Col>
                    <Col span={6} className={cx("alg-r", "detail")}>
                      {format(billInformation?.totalBill)}
                    </Col>
                  </Row>
                </Col>

                <Col span={24} className={cx("line-big")}></Col>
                <Col span={24} className={cx("body-section")}>
                  <Row>
                    <Col span={8} className={cx("title", "sub-total-title")}>
                      Sub Total
                    </Col>
                    <Col span={4} className={cx("alg-r", "detail")}></Col>
                    <Col span={6} className={cx("alg-r", "detail")}></Col>
                    <Col span={6} className={cx("alg-r", "detail")}>
                      {format(billInformation?.totalBill)}
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("body-section")}>
                  <Row>
                    <Col span={8} className={cx("title", "sub-total-title")}>
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
                    <Col span={6} className={cx("alg-r", "detail")}></Col>
                    <Col span={6} className={cx("alg-r", "total-price")}>
                      {format(billInformation?.totalBill)}
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("body-section")}>
                  <Row>
                    <Col span={8} className={cx("title", "total-title")}></Col>
                    <Col span={4} className={cx("alg-r", "detail")}></Col>
                    <Col span={6} className={cx("alg-r", "detail")}></Col>
                    <Col span={6} className={cx("alg-r", "total-price")}>
                      $
                      {format(
                        (billInformation?.totalBill / currenceConvert).toFixed(
                          2
                        )
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("footer-section")}>
                  <div className={cx("paypal-button")} ref={paypal}></div>
                </Col>
              </Row>
            </Col>
            <Col span={24} className={cx("line-small")}></Col>
            <Col span={3}>
              <div className="small-icon"></div>
            </Col>
            <Col span={7} className={cx("footer")}>
              http://asra-accommodation.online/
            </Col>
            <Col span={7} className={cx("footer")}>
              asra.coporation@gmail.com
            </Col>
            <Col span={7} className={cx("footer")}>
              +84 783 546 885
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
