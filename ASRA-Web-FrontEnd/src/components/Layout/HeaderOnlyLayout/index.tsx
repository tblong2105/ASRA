import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from "../components/Header"

function HeaderOnlyLayout({ children }: { children: JSX.Element }) {
    const [footerLoading, setFooterLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFooterLoading(true);
    }, 1000)
  }, [])
    return <div>
        <Header />
        <Layout className=''>{children}</Layout>
        <div style={{ zIndex: 3 }}>
        {/* {footerLoading && <Footer />} */}
      </div>
    </div>;
}

export default HeaderOnlyLayout;
