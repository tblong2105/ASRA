import classnames from "classnames/bind";

import "./index.scss";
import styles from "./index.module.scss";
import {
  Checkbox,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { InnkeeperInformation } from "models/User";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Button from "components/Layout/components/Button";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoomDetailName } from "api/room-detail";
import { RoomDetailName } from "models/Room";
import { getInnkeeperInformation } from "api/innkeeper";
import { RangePickerProps } from "antd/lib/date-picker";
import { paymentTypes } from "commons/masterData/PaymentType";
import { validateMessages } from "helpers/ValidateMessage";

const cx = classnames.bind(styles);

export default function CreateContract() {
  const { Option } = Select;
  const { TextArea } = Input;
  const dateFormat = "MMM DD, YYYY";
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [innkeeperInformation, setInnkeeperInformation] =
    useState<InnkeeperInformation>({} as InnkeeperInformation);
  const [innkeeperResponsibilityFlag, setInnkeeperResponsibilityFlag] =
    useState<boolean>(true);
  const [tenantResponsibilityFlag, setTenantResponsibilityFlag] =
    useState<boolean>(true);
  const [commonResponsibilityFlag, setCommonResponsibilityFlag] =
    useState<boolean>(true);
  const [roomDetailName, setRoomDetailName] = useState<RoomDetailName[]>([]);
  const { state }: any = useLocation();
  let {
    roomId,
    depositRecord,
    address,
    innkeeperId,
    electronicPrice,
    waterPrice,
    internetPrice,
    rentalPrice,
    deposit,
  } = state;
  const [dataCreateContract, setDataContract] = useState<any>({});
  const [createContractStartDate, setcreateContractStartDate] = useState<any>();
  const [createContractEndDate, setcreateContractEndDate] = useState<any>();

  const commonCheckboxRef = useRef<any>();
  const innkeeperCheckboxRef = useRef<any>();
  const tenantCheckboxRef = useRef<any>();
  const [paymentDates, setpaymentDates] = useState<any>([]);

  const bindingCheckedBack = (currentDataContract: any) => {
    if (currentDataContract.commonResponsibility) {
      setCommonResponsibilityFlag(false);
      commonCheckboxRef.current.state.checked = true;
    }

    if (currentDataContract.tenantResponsibility) {
      setTenantResponsibilityFlag(false);
      tenantCheckboxRef.current.state.checked = true;
    }

    if (currentDataContract.innkeeperResponsibility) {
      setInnkeeperResponsibilityFlag(false);
      innkeeperCheckboxRef.current.state.checked = true;
    }
  };

  useEffect(() => {
    let date = [];
    for (let index = 1; index <= 31; index++) {
      date.push(index);
    }
    setpaymentDates(date);
  }, []);

  useEffect(() => {
    if (state.dataContract) {
      const currentDataContract = state.dataContract;

      bindingCheckedBack(currentDataContract);
      setcreateContractStartDate(
        moment(currentDataContract.startDate, dateFormat)
      );
      setcreateContractEndDate(moment(currentDataContract.endDate, dateFormat));

      form.setFieldsValue({
        commonResponsibility: currentDataContract?.commonResponsibility,
        contractCreateAddress: currentDataContract.contractCreateAddress,
        contractCreateDate: moment(
          currentDataContract.contractCreateDate,
          dateFormat
        ),
        deposit: currentDataContract.deposit,
        electronicPrice: currentDataContract.electronicPrice,
        endDate: moment(currentDataContract.endDate, dateFormat),
        innkeeperBirthdate: moment(
          currentDataContract.innkeeperBirthdate,
          dateFormat
        ),
        innkeeperDateOfIssuanceOfIdentityCard: moment(
          currentDataContract.innkeeperDateOfIssuanceOfIdentityCard,
          dateFormat
        ),
        innkeeperIdentityCardNo: currentDataContract.innkeeperIdentityCardNo,
        innkeeperName: currentDataContract.innkeeperName,
        innkeeperPermanentResidence:
          currentDataContract.innkeeperPermanentResidence,
        innkeeperPhoneNumber: currentDataContract.innkeeperPhoneNumber,
        innkeeperResponsibility: currentDataContract?.innkeeperResponsibility,
        innkeeperThePlaceIdentityCard:
          currentDataContract.innkeeperThePlaceIdentityCard,
        internetPrice: currentDataContract.internetPrice,
        paymentType: currentDataContract.paymentType,
        rentalPrice: currentDataContract.rentalPrice,
        roomDetailId: currentDataContract.roomDetailId,
        startDate: moment(currentDataContract.startDate, dateFormat),
        tenantBirthday: moment(currentDataContract.tenantBirthday, dateFormat),
        tenantIcIssueDate: moment(
          currentDataContract.tenantIcIssueDate,
          dateFormat
        ),
        tenantIcIssueLoc: currentDataContract.tenantIcIssueLoc,
        tenantIcNo: currentDataContract.tenantIcNo,
        tenantName: currentDataContract.tenantName,
        tenantPermanentResidence: currentDataContract.tenantPermanentResidence,
        tenantPhoneNumber: currentDataContract.tenantPhoneNumber,
        tenantResponsibility: currentDataContract?.tenantResponsibility,
        waterPrice: currentDataContract.waterPrice,
        paymentDate: currentDataContract.paymentDate,
      });
      bindingDataInnkeeper();
    }
  }, [state]);

  useEffect(() => {
    if (roomId || state.dataContract.roomId) {
      getRoomDetailName(roomId || state.dataContract.roomId).then(
        (res: RoomDetailName[]) => {
          setRoomDetailName(res);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (roomId && !state.dataContract) {
      form.setFieldsValue({
        tenantName: depositRecord.fullName ? depositRecord.fullName : null,
        tenantPhoneNumber: depositRecord.phoneNumber
          ? depositRecord.phoneNumber
          : null,
        contractCreateAddress: address ? address : null,
        contractCreateDate: moment(new Date(), dateFormat),
        electronicPrice: electronicPrice ? electronicPrice : null,
        waterPrice: waterPrice ? waterPrice : null,
        internetPrice: internetPrice ? internetPrice : null,
        rentalPrice: rentalPrice ? rentalPrice : null,
        deposit: deposit ? deposit : null,
      });
    }
  }, []);

  // get anf set value for Innkeeper Information
  useEffect(() => {
    getInnkeeperInformation(innkeeperId).then((res: any) => {
      setInnkeeperInformation(res);
    });
  }, []);

  // set value for Innkeeper Information Container
  useEffect(() => {
    if (innkeeperInformation) {
      bindingDataInnkeeper();
    }
  }, [innkeeperInformation]);

  const bindingDataInnkeeper = () => {
    form.setFieldsValue({
      ...innkeeperInformation,
      innkeeperName: innkeeperInformation.icName
        ? innkeeperInformation.icName
        : null,
      innkeeperBirthdate: innkeeperInformation.icBirthdate
        ? moment(innkeeperInformation.icBirthdate, dateFormat)
        : null,
      innkeeperPermanentResidence: innkeeperInformation.icAddress
        ? innkeeperInformation.icAddress
        : null,
      innkeeperIdentityCardNo: innkeeperInformation.icId
        ? innkeeperInformation.icId
        : null,
      innkeeperDateOfIssuanceOfIdentityCard: innkeeperInformation.icIssueDate
        ? moment(innkeeperInformation.icIssueDate, dateFormat)
        : null,
      innkeeperThePlaceIdentityCard: innkeeperInformation.icIssueLoc
        ? innkeeperInformation.icIssueLoc
        : null,
      innkeeperPhoneNumber: innkeeperInformation.phoneNumber
        ? innkeeperInformation.phoneNumber
        : null,
    });
  };

  // function onChange of datepicker
  const onChange: DatePickerProps["onChange"] = (date, dateString) => { };

  // function onChange Start Date of datepicker
  const onChangeStartDate: DatePickerProps["onChange"] = (date, dateString) => {
    setcreateContractStartDate(date);
    form.setFieldsValue({
      contractEndDate: null,
    });
  };

  // function onChange End Date of datepicker
  const onChangeEndDate: DatePickerProps["onChange"] = (date, dateString) => {
    setcreateContractEndDate(date);
  };

  // disable select days before today
  const disabledStartDate: RangePickerProps["disabledDate"] = (current) => {
    // can not select days before today
    return current && current <= moment().subtract(1, "days").endOf("day");
  };

  // disable select days before start date
  const disabledEndDate: RangePickerProps["disabledDate"] = (current) => {
    // can not select days before start date
    return (
      current &&
      current <=
      moment(moment(createContractStartDate, dateFormat)).add(1, "days")
    );
  };

  // function onChange of checkbox innkeeper responsibility
  const onChangeCheckboxInnkeeper = (e: CheckboxChangeEvent) => {
    setInnkeeperResponsibilityFlag(!e.target.checked);
    if (!e.target.checked) {
      form.setFieldsValue({
        innkeeperResponsibility: null,
      });
    }
  };

  // function onChange of checkbox tenant responsibility
  const onChangeCheckboxTenant = (e: CheckboxChangeEvent) => {
    setTenantResponsibilityFlag(!e.target.checked);
    if (!e.target.checked) {
      form.setFieldsValue({
        tenantResponsibility: null,
      });
    }
  };

  // function onChange of checkbox common responsibility
  const onChangeCheckboxCommon = (e: CheckboxChangeEvent) => {
    setCommonResponsibilityFlag(!e.target.checked);
    if (!e.target.checked) {
      form.setFieldsValue({
        commonResponsibility: null,
      });
    }
  };

  const handleCreateContract = (data: any) => {
    const dataTemp = {
      ...data,
      //Contract Information
      contractCreateDate: moment(data.contractCreateDate).format(dateFormat),
      startDate: moment(data.startDate).format(dateFormat),
      endDate: moment(data.endDate).format(dateFormat),

      //Innkeeper Information
      innkeeperBirthdate: moment(data.innkeeperBirthdate).format(dateFormat),
      innkeeperDateOfIssuanceOfIdentityCard: moment(
        data.innkeeperDateOfIssuanceOfIdentityCard
      ).format(dateFormat),

      tenantBirthday: moment(data.tenantBirthday).format(dateFormat),
      tenantIcIssueDate: moment(data.tenantIcIssueDate).format(dateFormat),
    };
    navigate("/contract/preview", {
      state: {
        dataContract: dataTemp,
        roomId,
        accountTenantId:
          state.depositRecord?.accountId || state.accountTenantId,
        innkeeperId,
        receiver: state?.receiver,
      },
    });
  };

  return (
    <>
      <div className="contract-wrapper">
        <div className={cx("contract_screen")}>
          <Form
            name="basic"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            form={form}
            validateMessages={validateMessages}
            onFinish={handleCreateContract}
          >
            {/* Contract Information */}
            <div className={cx("contract_infomation_container")}>
              <p className={cx("title")}>Contract Information</p>
              <Row className={cx("form_data")}>
                <Col span={24}>
                  {/* Contract Creation Date and Contract Creation Address */}
                  <Row className={`information-row`}>
                    {/* Contract Creation Date */}
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Contract Creation Date"
                        name="contractCreateDate"
                        rules={[
                          {
                            required: true,
                            message: "Please select contract creation date",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChange}
                          placeholder="Select contract creation date"
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    {/* Contract Creation Address */}
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Contract Creation Address"
                        name="contractCreateAddress"
                        rules={[
                          {
                            required: true,
                            message: "Please input contract creation address",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the contract creation address"
                          className={cx("input", "address")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={`information-row`}></Row>

                  {/* Rental Price and Deposit */}
                  <Row className={`information-row`}>
                    {/* Rental Price */}
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Rental Price"
                        name="rentalPrice"
                        rules={[
                          {
                            pattern: /^[\d]{0,8}$/,
                            message: "Rental Price must be at most 8 number",
                          },
                          {
                            required: true,
                          },
                          {
                            type: "number",
                            min: 1,
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter the Rental Price"
                          className={`input-number`}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value: any) =>
                            value.replace(/\$\s?|(,*)/g, "")
                          }
                          controls={false}
                        />
                      </Form.Item>
                      <p className={cx("unit-left")}>VND</p>
                    </Col>

                    {/* Deposit */}
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Deposit"
                        name="deposit"
                        rules={[
                          {
                            pattern: /^[\d]{0,8}$/,
                            message: "Deposit must be at most 8 number",
                          },
                          {
                            required: true,
                          },
                          {
                            type: "number",
                            min: 100000,
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter the deposit"
                          className={`input-number`}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value: any) =>
                            value.replace(/\$\s?|(,*)/g, "")
                          }
                          controls={false}
                          disabled
                        />
                      </Form.Item>
                      <p className={cx("unit-right")}>VND</p>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Electronic Cost"
                        name="electronicPrice"
                        rules={[
                          {
                            pattern: /^[\d]{0,7}$/,
                            message:
                              "Electricity Cost must be at most 7 number",
                          },
                          {
                            required: true,
                          },
                          {
                            type: "number",
                            min: 1,
                          },
                        ]}
                      >
                        <InputNumber
                          className={`input-number`}
                          placeholder="The amount of money per kwh"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value: any) =>
                            value.replace(/\$\s?|(,*)/g, "")
                          }
                          controls={false}
                        />
                      </Form.Item>
                      <p className={cx("unit-left")}>VND / kwh</p>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Water Cost"
                        name="waterPrice"
                        rules={[
                          {
                            pattern: /^[\d]{0,7}$/,
                            message: "Water Cost must be at most 7 number",
                          },
                          {
                            required: true,
                          },
                          {
                            type: "number",
                            min: 1,
                          },
                        ]}
                      >
                        <InputNumber
                          className={`input-number`}
                          placeholder="The amount of money per person"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value: any) =>
                            value.replace(/\$\s?|(,*)/g, "")
                          }
                          controls={false}
                        />
                      </Form.Item>
                      <p className={cx("unit-right")}>VND / person</p>
                    </Col>
                  </Row>
                  <Row className={`information-row`}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Internet Cost"
                        name="internetPrice"
                        rules={[
                          {
                            pattern: /^[\d]{0,7}$/,
                            message: "Internet Cost must be at most 7 number",
                          },
                          {
                            required: true,
                          },
                          {
                            type: "number",
                            min: 1,
                          },
                        ]}
                      >
                        <InputNumber
                          className={`input-number`}
                          placeholder="The amount of money per month"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value: any) =>
                            value.replace(/\$\s?|(,*)/g, "")
                          }
                          controls={false}
                        />
                      </Form.Item>
                      <p className={cx("unit-left")}>VND / month</p>
                    </Col>

                    {/* Room Detail Name */}
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Room Detail Name"
                        name="roomDetailId"
                        rules={[
                          {
                            required: true,
                            message: "Please select Room Detail Name",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Room Detail Name"
                          className={cx("input")}
                          allowClear
                        >
                          {roomDetailName.map(
                            (item: RoomDetailName, index: number) => (
                              <Option value={item.id} key={index}>
                                {item.roomNo}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={cx("information-row")}>
                    {/* Payment Date*/}
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Monthly Payment Date"
                        name="paymentDate"
                        rules={[
                          {
                            required: true,
                            message: "Please input Monthly Payment Date",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Payment Date"
                          className={cx("input")}
                        >
                          {paymentDates.map((res: number, index: number) => (
                            <Option value={res} key={index}>
                              {res}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Payment Type"
                        name="paymentType"
                        rules={[
                          {
                            required: true,
                            message: "Please select Payment Type",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Payment Type"
                          className={cx("input")}
                          allowClear
                        >
                          {paymentTypes.map((item, index) => (
                            <Option key={index} value={item.value}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={`information-row`}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Contract Start Date"
                        name="startDate"
                        rules={[
                          {
                            required: true,
                            message: "Please select Contract Start Date",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChangeStartDate}
                          placeholder="Select Contract Start Date"
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                          disabledDate={disabledStartDate}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Contract End Date"
                        name="endDate"
                        rules={[
                          {
                            required: true,
                            message: "Please select Contract End Date",
                          },
                          {
                            validator: async (_, endDatetime) => {
                              if (!createContractStartDate) {
                                return Promise.reject(
                                  "Please select Start Date first"
                                );
                              } else if (
                                createContractEndDate < createContractStartDate
                              ) {
                                return Promise.reject(
                                  "End Date must be greater than Start Date"
                                );
                              }
                            },
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChangeEndDate}
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                          disabledDate={disabledEndDate}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            {/* Innkeeper Information */}
            <div className={cx("contract_infomation_container")}>
              <p className={cx("title")}>Innkeeper Information</p>
              <Row className={cx("form_data")}>
                <Col span={24}>
                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Innkeeper Name"
                        name="innkeeperName"
                        rules={[
                          {
                            required: true,
                            message: "Please input Innkeeper name",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the innkeeper name"
                          className={cx("input", "address")}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Innkeeper Birthday"
                        name="innkeeperBirthdate"
                        rules={[
                          {
                            required: true,
                            message: "Please select innkeeper birthday",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChange}
                          placeholder="Select innkeeper birthday"
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={24}>
                      <Form.Item
                        label="Permanent Residence"
                        name="innkeeperPermanentResidence"
                        rules={[
                          {
                            required: true,
                            message: "Please input permanent residence",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the permanent residence"
                          className={cx("input", "permanent_residence")}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Identity Card No"
                        name="innkeeperIdentityCardNo"
                        rules={[
                          {
                            required: true,
                            message: "Please input identity card no",
                          },
                        ]}
                      >
                        <InputNumber
                          type="text"
                          placeholder="Enter the identity card no"
                          className={"input-number"}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Date of issuance of identity card"
                        name="innkeeperDateOfIssuanceOfIdentityCard"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please select date of issuance of identity card",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChange}
                          placeholder="Select date of issuance of identity card"
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="The place where the people's identity card is issued"
                        name="innkeeperThePlaceIdentityCard"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please input the place where the people's identity card is issued",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the the place where the people's identity card is issued"
                          className={cx("input", "the_place_identity_card")}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Phone Number"
                        name="innkeeperPhoneNumber"
                        rules={[
                          {
                            required: true,
                            pattern: /^((0)[3|5|7|8|9])+([0-9]{8})$\b/,
                            message: "Phone Number incorrect format!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter the phone number"
                          className={cx("input")}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            {/* Tenant Information */}
            <div className={cx("contract_infomation_container")}>
              <p className={cx("title")}>Tenant Information</p>
              <Row className={cx("form_data")}>
                <Col span={24}>
                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Tenant Name"
                        name="tenantName"
                        rules={[
                          {
                            required: true,
                            message: "Please input tenant name",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the tenant name"
                          className={cx("input", "tenant_name")}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Tenant Birthday"
                        name="tenantBirthday"
                        rules={[
                          {
                            required: true,
                            message: "Please select tenant birthday",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChange}
                          placeholder="Select tenant birthday"
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={24}>
                      <Form.Item
                        label="Permanent Residence"
                        name="tenantPermanentResidence"
                        rules={[
                          {
                            required: true,
                            message: "Please input permanent residence",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the permanent residence"
                          className={cx("input", "permanent_residence")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="Identity Card No"
                        name="tenantIcNo"
                        rules={[
                          {
                            required: true,
                            message: "Please input identity card no",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter the identity card no"
                          className={`input-number`}
                          controls={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Date of issuance of identity card"
                        name="tenantIcIssueDate"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please select date of issuance of identity card",
                          },
                        ]}
                      >
                        <DatePicker
                          onChange={onChange}
                          placeholder="Select date of issuance of identity card"
                          className={cx("input", "date_picker")}
                          format={dateFormat}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className={cx("information-row")}>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_left")}
                        label="The place where the people's identity card is issued"
                        name="tenantIcIssueLoc"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please input the place where the people's identity card is issued",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Enter the the place where the people's identity card is issued"
                          className={cx("input", "the_place_identity_card")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={cx("col_right")}
                        label="Phone Number"
                        name="tenantPhoneNumber"
                        rules={[
                          {
                            required: true,
                            pattern: /^((0)[3|5|7|8|9])+([0-9]{8})$\b/,
                            message: "Phone Number incorrect format!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter the phone number"
                          className={cx("input")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            {/* Responsibility */}
            <div className={cx("contract_infomation_container")}>
              <p className={cx("title")}>Responsibility</p>
              <Row className={cx("form_data")}>
                <Col span={24}>
                  {/* Innkeeper's Responsibility */}
                  <Row className={cx("information-row")}>
                    <Col span={24}>
                      <Checkbox
                        ref={innkeeperCheckboxRef}
                        onChange={onChangeCheckboxInnkeeper}
                        className={cx("checkboxCustom")}
                      >
                        Click here to custom the responsibility
                      </Checkbox>
                      <Form.Item
                        className={"required-no-icon"}
                        label="Innkeeper's Responsibility"
                        name="innkeeperResponsibility"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Enter the Innkeeper's Responsibility"
                          className={cx(
                            "innkeeperResponsibility",
                            "innkeeper_responsibility"
                          )}
                          disabled={innkeeperResponsibilityFlag}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Tenant's Responsibility */}
                  <Row className={cx("information-row")}>
                    <Col span={24}>
                      <Checkbox
                        ref={tenantCheckboxRef}
                        onChange={onChangeCheckboxTenant}
                        className={cx("checkboxCustom")}
                      >
                        Click here to custom the responsibility
                      </Checkbox>
                      <Form.Item
                        className={"required-no-icon"}
                        label="Tenant's Responsibility"
                        name="tenantResponsibility"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Enter the Tenant's Responsibility"
                          className={cx(
                            "tenantResponsibility",
                            "tenant_responsibility"
                          )}
                          disabled={tenantResponsibilityFlag}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Common Responsibility */}
                  <Row className={cx("information-row")}>
                    <Col span={24}>
                      <Checkbox
                        ref={commonCheckboxRef}
                        onChange={onChangeCheckboxCommon}
                        className={cx("checkboxCustom")}
                      >
                        Click here to custom the responsibility
                      </Checkbox>
                      <Form.Item
                        className={"required-no-icon"}
                        label="Common Responsibility"
                        name="commonResponsibility"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Enter the Common Responsibility"
                          className={cx(
                            "commonResponsibility",
                            "common_responsibility"
                          )}
                          disabled={commonResponsibilityFlag}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            {/* Button Cancel and Button Create Contract */}
            <Form.Item className={styles.form_buton} wrapperCol={{ span: 24 }}>
              {/* Button Cancel */}
              <Button
                primary
                className={styles.btn_cancel}
                onClick={() =>
                  navigate(
                    `/manage/room-for-rent/${roomId || state.dataContract.roomId
                    }`, {
                    state: {
                      contractCancel: true
                    },
                  }
                  )
                }
              >
                Cancel
              </Button>

              {/* Button Create Contract */}
              <Button
                type="submit"
                primary
                className={styles.btn_create_contract}
              >
                Preview
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
