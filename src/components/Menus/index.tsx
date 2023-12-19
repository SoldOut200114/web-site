import { useEffect, useMemo, useState } from "react";
import { Menu } from "antd";

import { isMobileFunc } from "@/utils/common";

import "./index.less";

interface MenusProps {
  items: Array<{ label: string; key: string }>;
  onClick?: Function;
}

const Menus = (props: MenusProps) => {
  const { items } = props;

  const isMobile = useMemo(() => isMobileFunc(), [isMobileFunc]);
  const [selectKey, setSelectKey] = useState("");

  useEffect(() => {
    selectKey && props.onClick?.(selectKey);
  }, [selectKey]);

  return (
    <>
      {isMobile ? (
        <div className="menus_self">
          {items.map((item) => (
            <div
              className={`menus_item ${
                selectKey === item.key ? "selected" : ""
              }`}
              key={item.key}
              onClick={() => setSelectKey(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>
      ) : (
        <Menu items={items} onClick={(item) => props.onClick(item.key)} />
      )}
    </>
  );
};

export default Menus;
