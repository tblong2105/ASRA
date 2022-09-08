import { useState, useEffect, memo } from "react";
import { Col, Form, Input, Row, Select } from "antd";
import { getCityList, getDistrictList, getWardList } from "api/location";
import {
  getCities,
  getDistricts,
  getWards,
} from "commons/utils/location-ultis";
/**
 * [Innkeeper Module] As ASRA innkeeper, i can create room
 * Address Tab
 */
function Address({ cx, form }: any) {
  const { Option } = Select;
  const [city, setCity] = useState<any[]>();
  const [district, setDistrict] = useState<any[]>();
  const [ward, setWards] = useState<any[]>();
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    setCity(getCities());

    if(form.getFieldValue("district")){
      setDistrict(getDistricts(form.getFieldValue("city")));
    }

    if(form.getFieldValue("ward")){
      setWards(getWards(form.getFieldValue("city"), form.getFieldValue("district")));
    }
  }, []);

  // Get all districts by city id
  const getCity = (cityName: any) => {
    setCityName(cityName);
    form.setFieldsValue({
      district: null,
      ward: null
    })
    setDistrict([]);
    setWards([]);
    setDistrict(getDistricts(cityName));
  };

  // Get all wards by district id
  const getDistrict = (districtName: any) => {
    form.setFieldsValue({
      ward: null
    })
    setWards([]);
    setWards(getWards(cityName, districtName));
  };
 
  // UI Address Tab
  return (
    <>
      <div className={cx("address_container")}>
        <p className={cx("title")}>Address</p>
        <div className={cx("form_data")}>
          <Row className={cx("address-row")}>
            {/* Select Box City*/}
            <Col span={12}>
              <Form.Item
                className={cx("col_left")}
                label="City"
                name="city"
                rules={[
                  { required: true, message: "Please select your City!" },
                ]}
              >
                <Select
                  onChange={(e: any) => getCity(e)}
                  className={cx("input")}
                  placeholder="Select City"
                >
                  {city?.map((type: any, index: number) => (
                    <Option key={index} value={type.name}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Select Box District*/}
            <Col span={12}>
              <Form.Item
                className={cx("col_right")}
                label="District"
                name="district"
                rules={[
                  { required: true, message: "Please select your District!" },
                ]}
              >
                <Select
                  onChange={(e: any) => getDistrict(e)}
                  className={cx("input")}
                  placeholder="Select District"
                >
                  {district?.map((type: any, index: number) => (
                    <Option key={index} value={type.name}>
                      <p
                        className={cx("district-name")}
                        style={{ margin: "0" }}
                      >
                        {type.name}
                      </p>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row className={cx("address-row")}>
            {/* Select Box Ward*/}
            <Col span={12}>
              <Form.Item
                className={cx("col_left")}
                label="Ward"
                name="ward"
                rules={[
                  { required: true, message: "Please select your Ward!" },
                ]}
              >
                <Select className={cx("input")} placeholder="Select Ward">
                  {ward?.map((type: any, index: number) => (
                    <Option key={index} value={type.name}>
                      <p className={cx("ward-name")} style={{ margin: "0" }}>
                        {type.name}
                      </p>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Input Field Street Name*/}
            <Col span={12}>
              <Form.Item
                className={cx("col_right")}
                label="Street Name"
                name="streetName"
                rules={[
                  { required: true, message: "Please input Street Name!" },
                ]}
              >
                <Input className={cx("input")}  placeholder="Street Name" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default memo(Address);
