import { useState } from "react";

import { Layout } from "antd";

import SiderAdmin from "components/Layout/components/Admin/Sider";
import BodyAdmin from "components/Layout/components/Admin/Body";
import HeaderAdmin from "components/Layout/components/Admin/Header";

import "./index.scss";

const AdminLayout = ({ children }: { children: JSX.Element }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout
      className="admin-layout"
      style={{ margin: 0, padding: "16px", height: "1000px" }}
    >
      <SiderAdmin collapsed={collapsed} />
      <Layout style={{ margin: 0 }} className="site-layout">
        <HeaderAdmin collapsed={collapsed} handleCollapsed={handleCollapsed} />
        <BodyAdmin>{children}</BodyAdmin>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
