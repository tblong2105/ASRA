import { Row, Col, Image, Spin, Tag, Pagination } from "antd";
import type { PaginationProps } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import { currencyViCode } from "commons/utils/mask";
import classNames from "classnames/bind";
import { cancelDeposit, getDepositedRoom } from "api/deposit";
import { useNavigate } from "react-router-dom";
import styles from "./MyDepositedRoom.module.scss";
import "./MyDepositedRoom.scss";
import { DEPOSIT_REQUEST_STATUS } from "commons/constants";
import Button from "components/Layout/components/Button";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import ModalConfirm from "components/helper/ModalConfirm";

const cx = classNames.bind(styles);

function MyDepositedRoom(props: any) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [depositedList, setDepositedList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentDepositId, setCurrentDepositId] = useState<number>(0);
  const [isModalConfirmVisible, setIsModaConfirmlVisible] = useState(false);

  const handlePaginationChange: PaginationProps["onChange"] = (
    pageNumber: any
  ) => {
    setCurrentPage(pageNumber);
    setLoading(true);
    getDepositedRoom(currentPage).then((res: any) => {
      setDepositedList(res.deposits);
      setTotalItems(res.totalItems);
      setLoading(false);
    });
  };

  const loadData = () => {
    setLoading(true);
    getDepositedRoom(currentPage).then((res: any) => {
      setDepositedList(res.deposits);
      setCurrentPage(res.currentPage);
      setTotalItems(res.totalItems);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleRecordClick = (e: any, roomId: any, depositId: any) => {
    if (e.target.type + "" == "submit" || e.target.innerHTML == "Cancel") {
      setCurrentDepositId(depositId);
      setIsModaConfirmlVisible(true);
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  const handleModalConfirmClick = () => {
    cancelDeposit(currentDepositId).then((result: any) => {
      setIsModaConfirmlVisible(false);
      getDepositedRoom(currentPage).then((res: any) => {
        setDepositedList(res.deposits);
        setCurrentPage(res.currentPage);
        setTotalItems(res.totalItems);
        openNotification(SUCCESS, result.message.messageDetail);
      });
    });
  };

  return (
    <>
      <Spin
        spinning={loading}
        delay={0}
        size="large"
        className={cx("spin")}
      ></Spin>
      {depositedList.length > 0
        ? depositedList.map((deposit) => {
            return (
              <div key={deposit.id} className={`deposit-room-component`}>
                <Row className={cx("deposit-room-component")}>
                  <Col span={24}>
                    <Row>
                      <Col
                        span={5}
                        className={cx("thumbnail-deposit-room-side")}
                      >
                        <Image
                          className={cx("thumbnail-deposit-image")}
                          src={deposit.thubnailImage}
                        />
                      </Col>
                      <Col
                        span={19}
                        className={cx("information-deposit-room-side")}
                        onClick={(e) =>
                          handleRecordClick(e, deposit.roomId, deposit.id)
                        }
                      >
                        <Row>
                          <Col span={24}>
                            <div
                              className={cx(
                                "deposit-room-address",
                                "deposit-room-utilities"
                              )}
                            >
                              <div
                                className={cx("home-icon", "deposit-icon")}
                              ></div>
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                  color: "#000",
                                }}
                              >
                                {deposit.address}
                              </span>
                            </div>
                          </Col>

                          <Col span={24}>
                            <div
                              className={cx(
                                "deposit-room-address",
                                "deposit-room-utilities"
                              )}
                            >
                              <div
                                className={cx("user-icon", "deposit-icon")}
                              ></div>
                              <span>
                                Innkeeper information: {deposit.innkeeperName} -
                                {" " + deposit.innkeeperPhone}
                              </span>
                            </div>
                          </Col>

                          <Col span={24}>
                            <div
                              className={cx(
                                "deposit-room-address",
                                "deposit-room-utilities"
                              )}
                            >
                              <div
                                className={cx("money-icon", "deposit-icon")}
                              ></div>
                              <span>
                                Deposit cost:{" "}
                                {currencyViCode(deposit.depositCost)}
                              </span>
                            </div>
                          </Col>

                          <Col span={24}>
                            <div
                              className={cx(
                                "deposit-room-address",
                                "deposit-room-utilities"
                              )}
                            >
                              <div
                                className={cx("canlendar-icon", "deposit-icon")}
                              ></div>
                              <span>
                                Deposit date:{" "}
                                {moment(Date.parse(deposit.createdDate)).format(
                                  "HH:mm MMM DD, YYYY"
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col
                            className={cx(
                              "deposit-room-address",
                              "deposit-room-utilities"
                            )}
                            span={24}
                          >
                            <span className={cx("status")}>
                              Status:{" "}
                              <Tag
                                color={
                                  deposit.status ===
                                  DEPOSIT_REQUEST_STATUS.APPROVED
                                    ? "green"
                                    : deposit.status ===
                                      DEPOSIT_REQUEST_STATUS.CANCEL
                                    ? "blue"
                                    : "orange"
                                }
                              >
                                {deposit.status}
                              </Tag>
                            </span>
                          </Col>
                          {deposit.status ===
                            DEPOSIT_REQUEST_STATUS.PENDING_APPROVAL && (
                            <Button primary className={cx("btn-hide")}>
                              Cancel
                            </Button>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })
        : !loading && (
            <div className={cx("no-data")}>
              <div className="no-data"></div>
            </div>
          )}
      <Col span={24} className={cx("pagination-deposited-body")}>
        <Row>
          <Col span={24} className={cx("pagination-deposited")}>
            {totalItems > 0 && (
              <Pagination
                current={currentPage}
                total={totalItems}
                showSizeChanger={false}
                onChange={handlePaginationChange}
              />
            )}
          </Col>
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
          >
            Cancel
          </Button>,
          <Button
            key={2}
            id={2}
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
              Do you want to cancel this deposit holder?
            </p>
          </div>
        }
      />
    </>
  );
}
export default MyDepositedRoom;
