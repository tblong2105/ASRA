import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./payment-information.module.scss";
import { Col, Row } from "antd";
import { CreatePayment } from "api/payment";
import { ERROR, SUCCESS } from "commons/constants/Notification";
import { openNotification } from "components/helper/Notification";
import { PAYMENT_DEPOSIT } from "commons/constants/Payment";
import { getBilltDetail, paymentBillForRoom } from "api/bill";
import moment from "moment";
import { Link } from "react-router-dom";
const cx = classnames.bind(styles);

export default function PaymentInformation() {
  const { billId } = useParams();
  const navigate = useNavigate();
  const paypal = useRef();
  const { state } = useLocation();
  let depositAmount;
  const [currenceConvert, setCurrenceConvert] = useState(23350);

  const [billInformation, setBillInformation] = useState();
  var currentDate = new Date();

  useEffect(() => {
    if (billId) {
      getBilltDetail(billId).then((res) => {
        setBillInformation(res);
        depositAmount = res.totalBill;
      });
    }
  }, [billId]);

  const format = (data) => {
    return data?.toLocaleString("vn-VN");
  };

  return (
    <>
      <div className={cx("paypal-contaiter")}>
        <div className={cx("paypal-box")}>
          <Row>
            <Col span={16} className={cx("invoice-title")}>
              Bill
            </Col>
            <Col span={8} className={cx("invoice-no")}>
              No: {(state.orderId).slice(0,7)}
            </Col>
            <Col span={24}>
              <div className={`${cx("success-icon")} success-icon`}></div>
              
            </Col>
            <Col span={24} className={cx("invoice-status")}>
              Payment Success
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
                    `${billInformation?.dues}/${billInformation?.month}/${billInformation?.year}`,
                    "DDMMYYYY"
                  ).format("DD/MM/YYYY")}
                </Col>
              </Row>
            </Col>
            <Col span={8}></Col>
            <Col span={16} className={cx("detail-section")}>
              <Row>
                <Col span={24} className={cx("subject-section")}>
                  Subject: <b>Rental Bill</b>
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
                    {billInformation?.deposit === 0 ? "0" : "1"}
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
                      {billInformation?.depositHolder === 0 ? "0": "1"}
                      </Col>
                      <Col span={6} className={cx("alg-r", "detail")}>
                        {billInformation?.depositHolder === 0 ? "0": "-"+format(billInformation?.depositHolder)}
                      </Col>
                      <Col span={6} className={cx("alg-r", "detail")}>
                      {billInformation?.depositHolder === 0 ? "0": "-"+format(billInformation?.depositHolder)}
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
                        billInformation?.electronicPrice * billInformation?.kw
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
                        billInformation?.waterPrice * billInformation?.capacity
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
      <Link to={"/manage"}
        state={{
          tabkey: 1
        }}>
        {`<< Back to management page`}
        </Link>
    </>
  );
}
