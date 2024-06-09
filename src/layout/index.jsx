import { useLocation } from "react-router-dom";
import { useOutlet } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { routes, key2Path } from "@/router/router.jsx";
import { useState } from "react";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
const { Sider, Content } = Layout;

const APP = () => {
  // react-group-transition
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { nodeRef } =
    routes.find((route) => route.path === location.pathname) ?? {};

  // menu
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  useEffect(() => {
    const selectedKey = sessionStorage.getItem("selectedKey");
    if (selectedKey != null) {
      setSelectedKeys([selectedKey]);
    } else {
      setSelectedKeys(["1"]);
    }
  }, []);

  const navigate = useNavigate();

  const menuItem = routes.map((r) => ({
    key: r.key,
    label: r.name,
    icon: r.icon,
  }));

  return (
    <Layout className="h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={({ key }) => {
            setSelectedKeys([key]);
            sessionStorage.setItem("selectedKey", key);
            if (key === "4") setCollapsed(true);
            navigate(key2Path[key]);
          }}
          items={menuItem}
        />
      </Sider>
      <Layout className="bg-white">
        <Scrollbars>
          <Content
            style={{
              minHeight: 280,
              overflow: "hidden",
            }}
          >
            <SwitchTransition>
              <CSSTransition
                key={location.pathname}
                nodeRef={nodeRef}
                timeout={300}
                unmountOnExit
                classNames="my-node"
              >
                {() => <div ref={nodeRef}>{currentOutlet}</div>}
              </CSSTransition>
            </SwitchTransition>
          </Content>
        </Scrollbars>
      </Layout>
    </Layout>
  );
};

export default APP;
