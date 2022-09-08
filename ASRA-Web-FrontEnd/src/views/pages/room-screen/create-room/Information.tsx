import { useEffect, useState, memo } from "react";
import {
  Col,
  Form,
  Row,
  Select,
  Input,
  InputNumber,
  Tag,
  Modal,
  Table,
  Typography,
  Popconfirm,
} from "antd";
import Button from "components/Layout/components/Button";

import { CONTRACT_STATUS } from "commons/constants";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import { editRoomDetail } from "api/room-detail";

import ModalConfirm from "components/helper/ModalConfirm";

interface RoomDetailDropdown {
  key: string;
  valueText: string;
  status: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: RoomDetailDropdown;
  index: number;
  children: React.ReactNode;
}

function Information({
  params,
  roomNoDropdownData,
  handleSetRoomNameDropdownData,
  cx,
}: any) {
  const { Option } = Select;
  const [roomType, setRoomType] = useState<any[]>();
  const [isModalEditRoomName, setIsModalEditRoomName] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [originalRoomDetailDropdownData, setOriginalRoomDetailDropdownData] =
    useState<RoomDetailDropdown[]>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const [roomNameDup, setRoomNameDup] = useState<any>();
  const [isChangeRoomName, setIsChangeRoomName] = useState<any>();

  let roomNoDropdownNewData = roomNoDropdownData?.filter(
    (roomName: string, index: number) => {
      if (index < 8) {
        return roomName;
      }
    }
  );

  const showModalEditRoom = () => {
    setIsModalEditRoomName(true);
    setOriginalRoomDetailDropdownData(roomNoDropdownData);
  };

  const hiddenModalEditRoom = () => {
    setIsModalEditRoomName(false);
  };

  const validRoomNameDuplicate = (
    _: any,
    value: string[],
    callbạck: Function
  ) => {
    try {
      let roomNameList = roomNoDropdownData?.map(
        (roomDetail: any) => roomDetail?.valueText
      );
      let roomNameDuplicate = value?.filter((val) =>
        roomNameList?.includes(val)
      );
      if (!roomNameDuplicate || roomNameDuplicate?.length <= 0) {
        return Promise.resolve();
      } else {
        return Promise.reject(
          new Error(
            `Room Name ${roomNameDuplicate?.sort().toString()} already exists`
          )
        );
      }
    } catch (error) {
      callbạck(error);
    }
  };

  const validRoomNameDuplicateOnTable = (
    _: any,
    value: string,
    callbạck: Function
  ) => {
    try {
      let roomNameList = roomNoDropdownData?.map(
        (roomDetail: any) => roomDetail?.valueText
      );
      if (!roomNameList.includes(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(`Room Name ${value} already exists`));
      }
    } catch (error) {
      callbạck(error);
    }
  };

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please input ${title}!`,
              },
              { validator: validRoomNameDuplicateOnTable },
            ]}
          >
            <Input
              size="small"
              onChange={handleCheckChangeRoomName}
              onBlur={handleCheckChangeRoomName}
            />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleCheckChangeRoomName: any = (event: any) => {
    let roomName = event.target.value;
    if (roomNameDup && roomNameDup !== roomName) {
      setIsChangeRoomName(true);
    }
  };

  const isEditingRoomDetailDropdownData = (record: RoomDetailDropdown) =>
    record.key === editingKey;

  const editRoomDetailDropdownData = (
    record: Partial<RoomDetailDropdown> & { key: React.Key }
  ) => {
    form.setFieldsValue({ valueText: "", status: "", ...record });
    setEditingKey(record.key);
    setRoomNameDup(record?.valueText);
  };

  const cancelRoomDetailDropdownData = () => {
    setEditingKey("");
    setIsChangeRoomName(false);
    setRoomNameDup("");
  };

  const saveRoomDetailDropdownData = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RoomDetailDropdown;

      const newData = [...originalRoomDetailDropdownData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        let dataReq = {
          roomDetailId: key,
          roomNo: row.valueText,
        };
        editRoomDetail(dataReq).then((res: any) => {
          openNotification(SUCCESS, res.message.messageDetail);
        });
        setOriginalRoomDetailDropdownData(newData);
        setEditingKey("");
        handleSetRoomNameDropdownData(newData);
      } else {
        newData.push(row);
        setOriginalRoomDetailDropdownData(newData);
        setEditingKey("");
      }
    } catch (err) {}
  };

  const columns = [
    {
      title: "Room Name",
      key: "valueText",
      dataIndex: "valueText",
      defaultSortOrder: "ascend",
      sorter: (a: any, b: any) => a.valueText - b.valueText,
      editable: true,
    },
    {
      title: "Room Status",
      key: "status",
      dataIndex: "status",
      filters: [
        {
          text: CONTRACT_STATUS.ROOM_RENTED,
          value: CONTRACT_STATUS.ROOM_RENTED,
        },
        {
          text: CONTRACT_STATUS.ROOM_EMPTY,
          value: CONTRACT_STATUS.ROOM_EMPTY,
        },
      ],
      onFilter: (value: string, record: any) =>
        record?.status
          ? CONTRACT_STATUS.ROOM_RENTED.indexOf(value) === 0
          : CONTRACT_STATUS.ROOM_EMPTY.indexOf(value) === 0,
      render: (_: any, { status }: any) => {
        return (
          <>
            <Tag color={status ? "green" : "blue"}>
              {status
                ? CONTRACT_STATUS.ROOM_RENTED
                : CONTRACT_STATUS.ROOM_EMPTY}
            </Tag>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: RoomDetailDropdown) => {
        const editable = isEditingRoomDetailDropdownData(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => saveRoomDetailDropdownData(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            {isChangeRoomName ? (
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={cancelRoomDetailDropdownData}
              >
                <a>Cancel</a>
              </Popconfirm>
            ) : (
              <a onClick={cancelRoomDetailDropdownData}>Cancel</a>
            )}
          </span>
        ) : (
          <>
            {!record?.status ? (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => editRoomDetailDropdownData(record)}
              >
                Edit
              </Typography.Link>
            ) : (
              <span style={{ cursor: "no-drop" }}>Edit</span>
            )}
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: RoomDetailDropdown) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingRoomDetailDropdownData(record),
      }),
    };
  });

  //Get RoomType
  useEffect(() => {
    let roomTypeFromLocalStorage = JSON.parse(
      localStorage.getItem("Room_Type") || "{}"
    );
    setRoomType(roomTypeFromLocalStorage);
  }, []);
  return (
    <>
      <>
        <div className={cx("infomation_container")}>
          <p className={cx("title")}>Room Information</p>
          <Row className={cx("form_data")}>
            <Col span={24}>
              <Row className={`information-row`}>
                <Col span={24}>
                  <Form.Item
                    label="Room Type"
                    name="roomType"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select room type"
                      className={cx("input")}
                      allowClear
                    >
                      {roomType?.map((type: any, index: number) => (
                        <Option key={type.value} value={type.value}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row className={`information-row`}>
                <Col span={12}>
                  {params?.roomId ? (
                    <>
                      <label className={cx("room-name-label")}>
                        Room Name List
                      </label>
                      <div style={{ display: "flex", paddingLeft: "2px" }}>
                        {roomNoDropdownNewData?.map(
                          (roomDetail: RoomDetailDropdown, index: any) => (
                            <Tag
                              key={index}
                              color={roomDetail?.status ? "green" : "blue"}
                              style={{ width: "50px" }}
                            >
                              {roomDetail?.valueText}
                            </Tag>
                          )
                        )}
                        <span
                          onClick={showModalEditRoom}
                          style={{ color: "#1890ff", cursor: "pointer" }}
                        >
                          See more
                        </span>
                        <ModalConfirm
                          title="Rooms Name List"
                          isModalVisible={isModalEditRoomName}
                          zIndex={3}
                          close={hiddenModalEditRoom}
                          footer={null}
                          children={
                            <>
                              <label className={cx("room-name-label")}>
                                Room Name List
                              </label>
                              <Form.Item
                                style={{ paddingTop: "10px" }}
                                name="roomsName"
                                rules={[
                                  {
                                    required: false,
                                  },
                                  { validator: validRoomNameDuplicate },
                                ]}
                              >
                                <Select
                                  maxTagTextLength={5}
                                  maxTagCount={5}
                                  allowClear
                                  mode="tags"
                                  size={"middle"}
                                  placeholder="Input room name"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                              <p
                                style={{
                                  position: "absolute",
                                  top: "120px",
                                  right: "32px",
                                  fontWeight: "600",
                                }}
                              >
                                room(s)
                              </p>
                              <></>
                              <Form form={form} component={false}>
                                <Table
                                  components={{
                                    body: {
                                      cell: EditableCell,
                                    },
                                  }}
                                  bordered
                                  dataSource={originalRoomDetailDropdownData}
                                  columns={mergedColumns}
                                  rowClassName="editable-row"
                                  pagination={{
                                    pageSize: 5,
                                    onChange: cancelRoomDetailDropdownData,
                                  }}
                                  style={{ padding: "16px" }}
                                />
                              </Form>
                            </>
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <Form.Item
                      className={`room_names ${cx(
                        "col_left",
                        "number_of_rooms"
                      )}`}
                      label="Room Detail Name"
                      name="roomsName"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select
                        filterOption={false}
                        maxTagTextLength={5}
                        maxTagCount={5}
                        allowClear
                        mode="tags"
                        size={"middle"}
                        placeholder="Please enter rooms name"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                        }}
                      />
                    </Form.Item>
                  )}

                  {!params?.roomId && (
                    <p className={cx("unit", "unit_room")}>room(s)</p>
                  )}
                </Col>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_right")}
                    label="Capacity"
                    name="capacity"
                    rules={[
                      { required: true },
                      { type: "number", min: 1, max: 10 },
                    ]}
                  >
                    <InputNumber
                      className={`input-number`}
                      placeholder="Enter capacity"
                      controls={false}
                      style={{ paddingRight: "110px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit")}>person(s) / room</p>
                </Col>
              </Row>

              <Row className={`information-row`}>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_left")}
                    label="Gender"
                    name="gender"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select gender"
                      className={cx("input")}
                      allowClear
                    >
                      <Option value="0">Other</Option>
                      <Option value="1">Male</Option>
                      <Option value="2">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_right")}
                    label="Room Area"
                    name="roomArea"
                    rules={[
                      { required: true },
                      { type: "number", min: 1, max: 1000 },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter the room area"
                      className={cx(`input-number`)}
                      controls={false}
                      style={{ paddingRight: "30px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit")}>m²</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div className={cx("infomation_container")}>
          <p className={cx("title")}>Expenses</p>
          <Row className={cx("form_data")}>
            <Col span={24}>
              <Row className={`information-row`}>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_left", "number_of_rooms")}
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
                        min: 100000,
                      },
                    ]}
                  >
                    <InputNumber
                      className={`input-number`}
                      placeholder="Enter the rental price"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                      controls={false}
                      style={{ paddingRight: "88px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit", "unit_room")}>VND / room</p>
                </Col>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_right", "number_of_rooms")}
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
                        message: "Deposit cannot be less than 100,000 VND",
                      },
                    ]}
                  >
                    <InputNumber
                      className={`input-number`}
                      placeholder="Enter money"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                      controls={false}
                      style={{ paddingRight: "48px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit")}>VND</p>
                </Col>
              </Row>

              <Row className={`information-row`}>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_left", "number_of_rooms")}
                    label="Electricity Cost"
                    name="electricityCost"
                    rules={[
                      // {
                      //   pattern: /^[\d]{0,5}$/,
                      //   message: "Electricity Cost must be at most 5 number",
                      // },
                      {
                        required: true,
                      },
                      {
                        type: "number",
                        min: 0,
                        max: 999999,
                      },
                    ]}
                  >
                    <InputNumber
                      className={`input-number`}
                      placeholder="The amount of money per kwh"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                      controls={false}
                      style={{ paddingRight: "80px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit", "unit_room")}>VND / kwh</p>
                </Col>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_right")}
                    label="Water Cost"
                    name="waterCost"
                    rules={[
                      // {
                      //   pattern: /^[\d]{0,5}$/,
                      //   message: "Water Cost must be at most 5 number",
                      // },
                      {
                        required: true,
                      },
                      {
                        type: "number",
                        min: 0,
                        max: 999999,
                      },
                    ]}
                  >
                    <InputNumber
                      className={`input-number`}
                      placeholder="The amount of money per people"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                      controls={false}
                      style={{ paddingRight: "100px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit")}>VND / person</p>
                </Col>
              </Row>

              <Row className={`information-row`}>
                <Col span={12}>
                  <Form.Item
                    className={cx("col_left")}
                    label="Internet Cost"
                    name="internetCost"
                    rules={[
                      {
                        pattern: /^[\d]{0,6}$/,
                        message: "Internet Cost must be at most 6 number",
                      },
                      {
                        required: true,
                      },
                      {
                        type: "number",
                        min: 0,
                      },
                    ]}
                  >
                    <InputNumber
                      className={`input-number`}
                      placeholder="The amount of money per month"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                      controls={false}
                      style={{ paddingRight: "96px" }}
                    />
                  </Form.Item>
                  <p className={cx("unit", "unit_room")}>VND / month</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
}

export default memo(Information);
