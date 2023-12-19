import { Col, Menu, Row } from "antd";
import { useEffect, useState } from "react";

const Header = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const _items = [
      { label: "黑图排行", key: "sort" },
      // { label: "黑料论坛", key: "forum" },
    ];
    setItems(_items);
  }, []);

  return (
    <div className="common-background header">
      <Row align={"middle"}>
        <Col span={16}>
          <Menu
            className="common-background"
            mode={"horizontal"}
            items={items}
            // defaultSelectedKeys={["sort"]}
          />
        </Col>
        {/* <Col span={8}>登录</Col> */}
      </Row>
    </div>
  );
};

export default Header;
