import { memo } from "react";
import { Layout } from "antd";

const { Content } = Layout;

function BodyAdmin({ children }: { children: JSX.Element }) {
  return (
    <Content
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
      }}
    >
      {children}
    </Content>
  );
}

export default memo(BodyAdmin);
