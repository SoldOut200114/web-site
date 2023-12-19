import { useEffect, useState } from "react";
import { Button, Empty, Form, Input, Space, message } from "antd";

import styles from "../index.module.less";
import { addDocMenu, getDocMenus } from "@/api/baby";
import { Menus, Modal } from "@/components";

const Menu = (props) => {
  const { setKey, selectKey } = props;

  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [menuName, setMenuName] = useState("");

  const addMenu = async () => {
    if (!menuName) {
      message.info("请输入菜单名称");
      return;
    }
    const params = {
      label: menuName,
      key: Date.now(),
    };
    const res = await addDocMenu(params);
    if (res.status === 200) {
      setVisible(false);
      setItems([...items, params]);
      if (!selectKey) {
        setKey(params.key);
      }
    }
  };

  const getDocs = () => {
    const params = {};
    getDocMenus(params).then((res) => {
      if (res.status === 200 && res.data?.data) {
        if (res.data.data?.length) {
          const { data } = res.data;
          setItems(data);
          setKey(data[0].key);
        }
      }
    });
  };

  useEffect(() => {
    getDocs();
  }, []);

  return (
    <>
      <Space
        className={`${styles.menus} ${styles.common_width}`}
        direction={"vertical"}
      >
        <Button
          className={styles.add_button}
          type="primary"
          onClick={() => setVisible(true)}
        >
          新增菜单
        </Button>
        {items.length ? (
          <Menus items={items} onClick={(key) => setKey(key)} />
        ) : (
          <Empty />
        )}
      </Space>
      <Modal
        title="新增菜单"
        open={visible}
        onOk={addMenu}
        onCancel={() => setVisible(false)}
      >
        <Form>
          <Form.Item label="菜单名称" required>
            <Input
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Menu;
