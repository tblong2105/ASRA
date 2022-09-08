import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./payment-paypal.module.scss";
import { convertCurrence, getCurrenceConvert } from "api/currenceConver";
import { Col, Row } from "antd";
import { CreatePayment } from "api/payment";
import { ERROR, SUCCESS } from "commons/constants/Notification";
import { openNotification } from "components/helper/Notification";
import { CURRENCE_CONVERT, PAYMENT_DEPOSIT } from "commons/constants/Payment";
import { getBilltDetail, paymentBillForRoom } from "api/bill";
import moment from "moment";
import { CONTRACT_STATUS } from "commons/constants";
const cx = classnames.bind(styles);

export default function PaymentPayPal(props) {
  const { billId } = useParams();
  const navigate = useNavigate();
  const paypal = useRef();
  const { state } = useLocation();
  let depositAmount;
  const [currenceConvert, setCurrenceConvert] = useState(CURRENCE_CONVERT);
  const [billInformation, setBillInformation] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const tenantSignatureUrl =
    searchParams
      ?.get("tenantSignUrl")
      ?.replace("signature/signature", "signature%2Fsignature") +
    "&token=" +
    searchParams.get("token");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [stepChange, setStepChange] = useState(false);
  useEffect(() => {
    if (billId) {
      getBilltDetail(billId).then((res) => {
        setBillInformation(res);
        depositAmount = res.totalBill;
      });
    }
  }, []);

  useEffect(() => {
    document.body.style.width = "375px !important";
    document.getElementsByClassName("App")[0].style.width = "375px !important";
    document.getElementsByClassName("header-user-wrapper")[0].style.display =
      "none";
    if (currenceConvert !== 0) {
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "Invoice",
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
            setOrderId(order.id);
            const resRequestBody = mappingResData(order);
            CreatePayment(resRequestBody).then((res) => {
              const resData = {
                billId: billId,
                paymentId: res.paymentId,
                tenantSignature: tenantSignatureUrl,
              };
              paymentBillForRoom(resData).then((res) => {
                setPaymentStatus(true);
              });
            });
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
  }, [currenceConvert]);

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
      vndAmount: depositAmount,
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
                {!paymentStatus ? (
                  <Col span={24} className={cx("Invoice-title")}>
                    Invoice
                  </Col>
                ) : (
                  <>
                    <Col span={8} className={cx("invoice-title")}>
                      Bill
                    </Col>
                    <Col span={16} className={cx("invoice-no")}>
                      No: {orderId.slice(0, 6)}
                    </Col>
                    <Col span={24}>
                      <div
                        className={`${cx("success-icon")} success-icon`}
                      ></div>
                    </Col>
                    <Col span={24} className={cx("invoice-status")}>
                      Payment Success
                    </Col>
                  </>
                )}

                <Col span={12} className={cx("from-section")}>
                  <Row>
                    <Col span={24} className={cx("title")}>
                      FROM:
                    </Col>
                    <Col span={24} className={cx("name")}>
                      {billInformation?.billPayerName}
                    </Col>
                    <Col style={{ lineHeight: "120%" }} span={24}>
                      {billInformation?.billPayerAddesss}
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className={cx("to-section")}>
                  <Row>
                    <Col span={24} className={cx("title")}>
                      TO:
                    </Col>
                    <Col span={24} className={cx("name")}>
                      {billInformation?.billPayeeName}
                    </Col>
                    <Col style={{ lineHeight: "120%" }} span={24}>
                      {billInformation?.billPayeeAddress}
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("detail-section")}>
                  <Row>
                    <Col span={24} className={cx("subject-section")}>
                      Subject: <b>Rental {!paymentStatus ? "Invoice" : "Bill"}</b>
                    </Col>
                    <Col span={24} className={cx("describe-section")}>
                      Describe: {billInformation?.describe.split("at")[0]}
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
                          Rental Price
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}>
                          1
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.rentalPrice)}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.rentalPrice)}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col span={8} className={cx("title")}>
                          Deposit
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}>
                          1
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.deposit)}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.deposit)}
                        </Col>
                      </Row>
                    </Col>
                    {billInformation?.type === "BILL_CONTRACT" && (
                      <Col span={24} className={cx("body-section")}>
                        <Row>
                          <Col span={8} className={cx("title")}>
                            Deposit Holder
                          </Col>
                          <Col span={4} className={cx("alg-r", "detail")}>
                            {billInformation?.depositHolder === 0 ? "0" : "1"}
                          </Col>
                          <Col span={6} className={cx("alg-r", "detail")}>
                            {billInformation?.depositHolder === 0
                              ? "0"
                              : "-" + format(billInformation?.depositHolder)}
                          </Col>
                          <Col span={6} className={cx("alg-r", "detail")}>
                            {billInformation?.depositHolder === 0
                              ? "0"
                              : "-" + format(billInformation?.depositHolder)}
                          </Col>
                        </Row>
                      </Col>
                    )}
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col span={8} className={cx("title")}>
                          Electronic Cost
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}>
                          {billInformation?.kw}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.electronicPrice)}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(
                            billInformation?.electronicPrice *
                              billInformation?.kw
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col span={8} className={cx("title")}>
                          Water Cost
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}>
                          {billInformation?.capacity}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.waterPrice)}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(
                            billInformation?.waterPrice *
                              billInformation?.capacity
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("body-section")}>
                      <Row>
                        <Col span={8} className={cx("title")}>
                          Internet Cost
                        </Col>
                        <Col span={4} className={cx("alg-r", "detail")}>
                          {billInformation?.type === "BILL_CONTRACT" ? 0 : 1}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.internetPrice)}
                        </Col>
                        <Col span={6} className={cx("alg-r", "detail")}>
                          {format(billInformation?.internetPrice)}
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
                          {format(billInformation?.totalBill)}
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
                          {format(billInformation?.totalBill)}
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
                              billInformation?.totalBill / currenceConvert
                            ).toFixed(2)
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className={cx("footer-section")}>
                      {!paymentStatus && (
                        <div className={cx("paypal-button")} ref={paypal}></div>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={cx("line-small")}></Col>
                <Col span={24} className={cx("footer")}>
                  <span style={{ fontSize: "16px" }}>
                    asra.coporation@gmail.com
                  </span>
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
