import { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import { Row, Col, Table, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import useDebounce from "app/useDebounce";
import { getAllPayments } from "api/admin";
import { getAllUserByUsername } from "api/account";

import AdminLayout from "components/Layout/AdminLayout";
import styles from "./Payment.module.scss";

interface PaymentAdmin {
  id: number;
  idPayment: string;
  payerEmailAddress: string;
  vndAmount: string;
  createdDate: string;
}

interface PaymentAdminRequest {
  page: number;
  keyword: string;
  sortBy: string;
  sortField: string;
  startDate: string;
  endDate: string;
}

interface DropdownData {
  key: number;
  valueText: string;
}

function PaymentListAdmin() {
  const cx = classNames.bind(styles);
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const [paymentListAdmin, setPaymentListAdmin] = useState<PaymentAdmin[]>([]);
  const [payerNameListDropdown, setPayerNameListDropdown] = useState<
    DropdownData[]
  >([]);
  const [searchPayerNameVal, setSearchPayerNameVal] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [dataReq, setDataReq] = useState<PaymentAdminRequest>({
    page: currentPage,
    keyword: "",
    sortBy: "",
    sortField: "",
    startDate: "",
    endDate: "",
  });

  const datePickerRef = useRef<any>(null);

  const debounced = useDebounce(searchPayerNameVal, 500);

  const columns: ColumnsType<PaymentAdmin> = [
    {
      title: "No",
      key: "index",
      width: 30,
      align: "center",
      render: (value, item, index) => (index += 1),
    },
    {
      title: "Payment ID",
      dataIndex: "idPayment",
      key: "idPayment",
      sorter: (a: any, b: any) => a.idPayment.length - b.idPayment.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Payer Email",
      dataIndex: "payerEmailAddress",
      key: "payerEmailAddress",
    },
    {
      title: "Amount",
      dataIndex: "vndAmount",
      key: "vndAmount",
      align: "right",
      sorter: (a, b) => Number(a.vndAmount) - Number(b.vndAmount),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "right",
      sorter: (a: any, b: any) =>
        moment(a.createdDate).unix() - moment(b.createdDate).unix(),
      render: (text: string) => moment(Date.parse(text)).format("MMM DD, YYYY"),
    },
  ];

  const handleChangeSearchPayerName = (payerName: string) => {
    if (payerName === undefined) {
      setPayerNameListDropdown([]);
      payerName = "";
    }
    dataReq["keyword"] = payerName;
    setDataReq(dataReq);
    loadData();
  };

  const handleInputSearchPayerName = (payerName: string) => {
    if (!payerName) {
      setPayerNameListDropdown([]);
      return;
    }
    setSearchPayerNameVal(payerName);
  };

  const handleChangeDateToSearch = (dateStrings: string[]) => {
    if (!dateStrings[0] && !dateStrings[0]) {
      dataReq["startDate"] = "";
      dataReq["endDate"] = "";
      loadData();
    } else {
      datePickerRef?.current?.blur();
      if (
        dataReq["startDate"] !== dateStrings[0] &&
        dataReq["endDate"] !== dateStrings[1]
      ) {
        dataReq["startDate"] = dateStrings[0];
        dataReq["endDate"] = dateStrings[1];
        loadData();
      }
    }
  };

  const loadData = () => {
    setLoading(true);
    getAllPayments(dataReq).then((res: any) => {
      setPaymentListAdmin(res.allPaymentVOs);
      setCurrentPage(res.currentPage);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchPayerNameVal) {
      setPayerNameListDropdown([]);
      return;
    }
    setFetching(true);
    getAllUserByUsername(debounced).then((res: any) => {
      setPayerNameListDropdown(res);
      setFetching(false);
    });
  }, [debounced]);

  return (
    <AdminLayout>
      <>
        <Row className={cx("payment-header")} gutter={16}>
          <Col className={cx("title")} span={12}>
            <h1>Payment List</h1>
          </Col>
          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            span={7}
          >
            <RangePicker
              ref={datePickerRef}
              format="MMM DD YYYY"
              size="middle"
              onChange={(_, dateStrings) =>
                handleChangeDateToSearch(dateStrings)
              }
            />
          </Col>
          <Col className={cx("keyword-search-tool")} span={5}>
            <Select
              style={{ width: "100%" }}
              placeholder="Input a payer name"
              onSearch={handleInputSearchPayerName}
              onChange={handleChangeSearchPayerName}
              showSearch
              allowClear
              loading={fetching ? true : false}
            >
              {payerNameListDropdown?.map((item: DropdownData) => (
                <Select.Option key={item?.key} value={item?.valueText}>
                  {item?.valueText}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={paymentListAdmin}
          loading={loading}
          pagination={{
            pageSize: 10,
          }}
        />
      </>
    </AdminLayout>
  );
}

export default PaymentListAdmin;
