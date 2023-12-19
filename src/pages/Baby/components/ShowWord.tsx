import { useEffect, useState } from "react";
import FileViewer from "react-file-viewer";
import { Button, Empty, Space, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { Modal } from "@/components";

import { addDoc, getDoc } from "@/api/baby";

import styles from "../index.module.less";

const ShowWord = (props) => {
  const { selectKey } = props;

  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  console.log(selectKey);

  const handleOk = async () => {
    console.log(file);
    if (!file || !selectKey) {
      message.info("请先上传文档或者先创建菜单");
      return;
    }
    const formData = new FormData();
    formData.append("doc", file);
    formData.append("key", selectKey);
    setLoading(true);
    const res = await addDoc(formData);
    setLoading(false);
    if (res.status === 200) {
      setFile("");
      setVisible(false);
      setUrl(res.data?.url);
      return;
    }
    message.error("文档更新失败，请重试");
  };

  const handleCancel = () => {
    setVisible(false);
    setFile("");
  };

  // 选中文档方法
  const handleChange = async ({ fileList: newFileList }) => {
    const file = newFileList[0];
    console.log(file);
    if (file) {
      const imgUrl = await URL.createObjectURL(file.originFileObj);
      setFile(file.originFileObj);
    } else {
      setFile("");
    }
  };

  useEffect(() => {
    if (!selectKey) return;
    getDoc({ key: selectKey }).then((res) => {
      if (res.status === 200 && res.data) {
        const _url = URL.createObjectURL(
          new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        );
        setUrl(_url);
        // setUrl('./aa.docx.zip');
        // setUrl(res.data);
      }
    });
  }, [selectKey]);

  return (
    <div className={`${styles.show_word} ${styles.common_width}`}>
      <Space className={`${styles.common_width} ${styles.show_word_button}`}>
        {selectKey && (
          <Button type="primary" onClick={() => setVisible(true)}>
            更新文档
          </Button>
        )}
      </Space>
      <div className={`${styles.common_width} ${styles.file_viewer}`}>
        {url ? (
          <FileViewer fileType="docx" filePath={url} key={url} />
        ) : (
          <Empty />
        )}
      </div>

      <Modal
        title="更新文档"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{ height: "60px" }}
      >
        <Upload beforeUpload={() => false} onChange={handleChange}>
          {file ? null : (
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          )}
        </Upload>
      </Modal>
    </div>
  );
};

export default ShowWord;
