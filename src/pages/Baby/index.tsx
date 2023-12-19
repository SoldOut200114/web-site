import { useContext, useState } from "react";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import Context from "@/context";

import { Menu, ShowWord } from "./components";

import styles from "./index.module.less";

const { Sider, Content } = Layout;

const Baby = (props) => {
  const { isMobile } = useContext(Context);

  const [openMenu, setOpenMenu] = useState(isMobile);
  const [key, setKey] = useState("");

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsible={isMobile}
        collapsedWidth={0}
        collapsed={openMenu}
        onCollapse={(value) => setOpenMenu(value)}
        trigger={null}
        theme={"light"}
      >
        <Menu setKey={setKey} selectKey={key} />
      </Sider>
      <Content>
        <div
          className={`${styles.menu_icon} ${
            openMenu ? "" : styles.open_menu_icon
          }`}
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <ShowWord selectKey={key} />
      </Content>
    </Layout>
  );
};

export default Baby;
