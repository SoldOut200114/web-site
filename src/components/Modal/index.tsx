import { useMemo } from "react";
import { Button, Modal as ModalAntd, Space } from "antd";

import { isMobileFunc } from "@/utils/common";

import "./index.less";

const Modal = (props) => {
  const { children } = props;
  const isMobile = useMemo(() => isMobileFunc(), [isMobileFunc]);

  return (
    <>
      {isMobile ? (
        props.open && (
          <div className="modal_self">
            <Space style={{ width: "100%" }} direction={"vertical"}>
              <div className="modal_title">{props.title}</div>
              <div style={props.bodyStyle}>{children}</div>
              <Space className="modal_footer">
                <Button onClick={() => props.onCancel()}>取消</Button>
                <Button type={"primary"} onClick={() => props.onOk()}>
                  确定
                </Button>
              </Space>
            </Space>
          </div>
        )
      ) : (
        <ModalAntd {...props} cancelText="取消" okText="确定" />
      )}
    </>
  );
};

export default Modal;
