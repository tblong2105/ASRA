import { Form, Input, Row, Col, Image, Spin, Tag, Pagination } from "antd";
import type { PaginationProps } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./MyWaitingContract.module.scss";
import "./MyWaitingContract.scss";
import { getWaitingContract } from "api/contract";
import moment from "moment";
import { currencyViCode } from "commons/utils/mask";

const cx = classNames.bind(styles);

function MyWaitingContract(props: any) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [listWaitContract, setlistWaitContract] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handlePaginationChange: PaginationProps["onChange"] = (
    pageNumber: any
  ) => {
    setCurrentPage(pageNumber);
    setLoading(true);
    getWaitingContract(currentPage).then((res: any) => {
      setlistWaitContract(res.contractVOs);
      setTotalItems(res.totalItems);
      setLoading(false);
    });
  };

  const loadData = () => {
    setLoading(true);
    getWaitingContract(currentPage).then((res: any) => {
      setlistWaitContract(res.contractVOs);
      setCurrentPage(res.currentPage);
      setTotalItems(res.totalItems);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Spin
        spinning={loading}
        delay={0}
        size="large"
        className={cx("spin")}
      ></Spin>
      {listWaitContract.length > 0
        ? listWaitContract.map((contract) => {
            return (
              <div key={contract.id} className={`contract-component`}>
                <Row className={cx("contract-component")}>
                  <Col
                    span={24}
                    className={cx("contract-side")}
                    onClick={() =>
                      navigate(`/contract/detail/${contract.id}`, {
                        state: {
                          roomId: contract?.roomId,
                          receiverName: contract?.innkeeperUsername,
                        },
                      })
                    }
                  >
                    <Row>
                      <Col span={24}>
                        <div className={cx("contract-tilte")}>
                          <span>{contract.title}</span>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div
                          className={cx(
                            "contract-address",
                            "contract-utilities"
                          )}
                        >
                          <div
                            className={cx("home-icon", "contract-icon")}
                          ></div>
                          <span>Address: {contract.address}</span>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div
                          className={cx(
                            "contract-address",
                            "contract-utilities"
                          )}
                        >
                          <div
                            className={cx("user-icon", "contract-icon")}
                          ></div>
                          <span>
                            Innkeepers Information: {contract.innkeeperName} -{" "}
                            {contract.innkeeperPhone}
                          </span>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div
                          className={cx(
                            "contract-address",
                            "contract-utilities"
                          )}
                        >
                          <div
                            className={cx("room-no-icon", "contract-icon")}
                          ></div>
                          <span>Room no: {contract.roomNo}</span>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div
                          className={cx(
                            "contract-address",
                            "contract-utilities"
                          )}
                        >
                          <div
                            className={cx("money-icon", "contract-icon")}
                          ></div>
                          <span>
                            Rental Price: {currencyViCode(contract.rentalPrice)}
                          </span>
                        </div>
                      </Col>

                      <Col span={24}>
                        <div
                          className={cx(
                            "contract-address",
                            "contract-utilities"
                          )}
                        >
                          <div
                            className={cx("canlendar-icon", "contract-icon")}
                          ></div>
                          <span>
                            Create date contract:{" "}
                            <Tag color="green">
                              {moment(
                                Date.parse(contract.contractCreateDate)
                              ).format("MMM DD, YYYY")}
                            </Tag>
                          </span>
                        </div>
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
      <Col span={24} className={cx("pagination-contract-body")}>
        <Row>
          <Col span={24} className={cx("pagination-contract")}>
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
    </>
  );
}
export default MyWaitingContract;
