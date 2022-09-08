import { useState, useEffect } from "react";
import { Layout } from "antd";
import Header from "../components/Header";
import Footer from "../components/Footer";

function DefaultLayout({ children }: { children: JSX.Element }) {
  const [footerLoading, setFooterLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFooterLoading(true);
    }, 2000);
  }, []);
  return (
    <>
      <Header />
      <Layout>{children}</Layout>
      {/* {footerLoading && <Footer />} */}
    </>
  );
}

export default DefaultLayout;
