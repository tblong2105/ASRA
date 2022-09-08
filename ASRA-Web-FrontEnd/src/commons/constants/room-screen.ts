import { Tenant, Deposit } from "models/Room";
import { currencyViCode } from "commons/utils/mask";
import moment from "moment";
export const utilities: any = [
  {
    id: 1,
    className: "bed-utility-icon",
    border: "utility-default",
  },
  {
    id: 2,
    className: "time-utility-icon",
    border: "utility-default",
  },
  {
    id: 3,
    className: "washing-machine-utility-icon",
    border: "utility-default",
  },
  {
    id: 4,
    className: "toilet-utility-icon",
    border: "utility-default",
  },
  {
    id: 5,
    className: "air-condition-utility-icon",
    border: "utility-default",
  },
  {
    id: 6,
    className: "television-utility-icon",
    border: "utility-default",
  },
  {
    id: 7,
    className: "parking-utility-icon",
    border: "utility-default",
  },
  {
    id: 8,
    className: "kitchen-utility-icon",
    border: "utility-default",
  },
  {
    id: 9,
    className: "refrigerator-utility-icon",
    border: "utility-default",
  },
  {
    id: 10,
    className: "wifi-utility-icon",
    border: "utility-default",
  },
];

export const tenantCols: any = [
  {
    title: "Tenant Name",
    dataIndex: "tenantName",
    key: "tenantName",
    editable: true,
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    editable: true,
  },
  {
    title: "Amount Deposit",
    dataIndex: "amountDeposit",
    key: "amountDeposit",
    editable: true,
  },
  {
    title: "Rent Expense / Month",
    dataIndex: "rentExpenseMonth",
    key: "rentExpenseMonth",
    editable: true,
  },
  {
    title: "Contract Start Date",
    dataIndex: "contractStartDate",
    key: "contractStartDate",
    editable: true,
  },
  {
    title: "Contract End Date",
    dataIndex: "contractEndDate",
    key: "contractEndDate",
    editable: true,
  },
];

export const tenantList: Tenant[] = [
  {
    key: "1",
    tenantName: "Le Duc Son",
    phoneNumber: "0349769684",
    amountDeposit: "2.800.000 VND",
    rentExpenseMonth: "1.400.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: false,
  },
  {
    key: "2",
    tenantName: "Nguyen Nhan",
    phoneNumber: "0349769684",
    amountDeposit: "3.000.000 VND",
    rentExpenseMonth: "1.500.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: true,
  },
  {
    key: "3",
    tenantName: "Nguyen Go",
    phoneNumber: "0349769684",
    amountDeposit: "3.000.000 VND",
    rentExpenseMonth: "3.000.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: false,
  },
  {
    key: "4",
    tenantName: "Phuc Hell",
    phoneNumber: "0349769684",
    amountDeposit: "2.000.000 VND",
    rentExpenseMonth: "3.000.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: true,
  },
  {
    key: "5",
    tenantName: "Nguyen Nhan",
    phoneNumber: "0349769684",
    amountDeposit: "3.000.000 VND",
    rentExpenseMonth: "1.500.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: true,
  },
  {
    key: "6",
    tenantName: "Nguyen Go",
    phoneNumber: "0349769684",
    amountDeposit: "3.000.000 VND",
    rentExpenseMonth: "3.000.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: false,
  },
  {
    key: "7",
    tenantName: "Phuc Hell",
    phoneNumber: "0349769684",
    amountDeposit: "2.000.000 VND",
    rentExpenseMonth: "3.000.000 VND",
    contractStartDate: "2021/01/01",
    contractEndDate: "2022/01/01",
    rentStatus: true,
  },
];

export const depositCols: any = [
  {
    title: "Username",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Amount Deposit",
    dataIndex: "depositCost",
    key: "depositCost",
    render: (text: string) => currencyViCode(Number(text)),
  },
  {
    title: "Date",
    dataIndex: "dateRequest",
    key: "dateRequest",
    sorter: (a: any, b: any) =>
      moment(a.dateRequest).unix() - moment(b.dateRequest).unix(),
    render: (text: string) =>
      moment(Date.parse(text)).format("HH:mm MMM DD, YYYY"),
  },
];
