import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function LoadingIcon({ customStyles }: any) {
  return <Spin indicator={<LoadingOutlined style={customStyles} spin />} />;
}

export default LoadingIcon;
