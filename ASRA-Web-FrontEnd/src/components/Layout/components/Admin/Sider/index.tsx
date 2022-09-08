import { memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, MenuProps } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  PieChartOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import "./index.scss";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Dashboard", "1", <PieChartOutlined />),
  getItem("Room", "2", <HomeOutlined />),
  getItem("User", "3", <UserOutlined />),
  getItem("Innkeeper", "4", <UserOutlined />),
  getItem("Payment", "5", <SolutionOutlined />),
];
function SiderAdmin({ collapsed }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickMenuItem = (menuInfo: any) => {
    switch (menuInfo?.key) {
      case "1":
        navigate("/admin/dashboard");
        break;
      case "2":
        navigate("/admin/room");
        break;
      case "3":
        navigate("/admin/user");
        break;
      case "4":
        navigate("/admin/innkeeper");
        break;
      case "5":
        navigate("/admin/payment");
        break;
      default:
        break;
    }
  };

  const handleActiveMenu: any = (): any => {
    let pathname = location?.pathname;
    switch (true) {
      case pathname.includes("/admin/dashboard"):
        return "1";
      case pathname.includes("/admin/room"):
        return "2";
      case pathname.includes("/admin/user"):
        return "3";
      case pathname.includes("/admin/innkeeper"):
        return "4";
      case pathname.includes("/admin/payment"):
        return "5";
      default:
        break;
    }
  };

  return (
    <Sider width={240} trigger={null} collapsible collapsed={collapsed}>
      <Link className="logo-asra" to="/admin/dashboard">
        <div className="small-icon"></div>
      </Link>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={handleActiveMenu}
        items={items}
        onClick={handleClickMenuItem}
      />
    </Sider>
  );
}

export default memo(SiderAdmin);
