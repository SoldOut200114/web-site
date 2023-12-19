import { useContext, useEffect, useState } from "react";
import {
  Card,
  List,
  Image,
  Row,
  Space,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Divider,
  message,
} from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  PlusCircleFilled,
  LikeFilled,
  FireFilled,
} from "@ant-design/icons";
import {
  addImg,
  delImg,
  delIps,
  getImgList,
  getIp,
  likeImg as likeImgReq,
} from "@/api/sort";
import { Toast } from "antd-mobile";
import Context from "@/context";

const { Search } = Input;

interface SortIndexProps {
  isMobile?: boolean;
}

const SortIndex = (props: SortIndexProps) => {
  const [data, setData] = useState([]);

  const { isMobile } = useContext(Context);

  // 上传图片相关字段
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");

  // 搜索内容相关字段
  const [searchValue, setSearchValue] = useState("");

  // 移动站点添加字段
  const [mobileAdd, setMobileAdd] = useState(false);

  // 点赞功能相关字段
  const [currentIp, setCurrentIp] = useState("");

  const [delVisible, setDelVisible] = useState(false);

  // 上传按钮图标
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 获取图片数据
  useEffect(() => {
    const params = {};
    getImgList(params).then((res) => {
      if (res.status === 200) {
        setData(res?.data?.data);
      }
    });
  }, []);

  // 获取当前访问网站的ip地址
  useEffect(() => {
    getIp().then((res) => {
      if (res.status === 200) {
        setCurrentIp(res?.data?.data);
      }
    });
  }, []);

  // 搜索内容
  const onSearch = (value) => {
    setSearchValue(value);
  };

  // pc,移动站点通知消息统一
  const showMsg = (msg) => {
    if (isMobile) {
      Toast.show({ content: msg });
    } else {
      message.info(msg);
    }
  };

  // 上传图片方法
  const handleOk = async () => {
    console.log(file);
    if (!title || !file) {
      showMsg("请输入标题或上传图片");
      return;
    }
    const formData = new FormData();
    formData.append("img", file);
    formData.append("title", title);
    setLoading(true);
    const res = await addImg(formData);
    setLoading(false);
    if (res.status === 200) {
      const _newData = {
        ...res.data,
      };
      setData([...data, _newData]);
      if (isMobile) {
        setMobileAdd(false);
      } else {
        setVisible(false);
      }
      showMsg("上传成功");
      setImageUrl("");
      return;
    }
    showMsg("图片保存失败，请重试");
  };

  // 取消上传图片
  const handleCancel = () => {
    setVisible(false);
  };

  // 选中图片方法
  const handleChange = async ({ fileList: newFileList }) => {
    const file = newFileList[0];
    console.log(file);
    if (file) {
      if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
        showMsg("请上传图片类型文件");
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        showMsg("请上传2MB以下的图片");
        return;
      }
    }
    const imgUrl = await URL.createObjectURL(file.originFileObj);
    setImageUrl(imgUrl);
    setFile(file.originFileObj);
  };

  // 删除新增的选中图片
  const clearImg = () => {
    setImageUrl("");
  };

  // 图片点赞功能
  const likeImg = (listItem) => {
    const { url, ips, likedNum } = listItem;
    const params = { url };
    if (ips?.includes(currentIp)) {
      showMsg("你已点赞过该图片，请明天再来");
      return;
    }
    likeImgReq(params).then((res) => {
      if (res.status === 200 && res.data?.data) {
        setData((prev) => {
          return prev.map((item) => {
            if (url === item.url) {
              return {
                ...item,
                ips: item.ips ? [...item.ips, res.data.data] : [res.data.data],
                likedNum: (likedNum || 0) + 1,
              };
            }
            return item;
          });
        });
        return;
      }
      if (res.data?.error) {
        showMsg(res.data?.msg);
      }
    });
  };

  // 删除图片点赞ip地址
  const removeIps = () => {
    delIps().then((res) => {
      if (res.status === 200) {
        showMsg("删除成功");
      }
    });
  };

  const removeImg = () => {
    const parmas = {
      url: imageUrl,
    };
    setLoading(true);
    delImg(parmas).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        showMsg("删除成功");
        setImageUrl("");
        window.location.reload();
      }
    });
  };

  // pc。移动相同新增内容
  const formComp = (
    <Form>
      <Form.Item label="标题" required>
        <Input
          placeholder="请输入标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="图片" required>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          accept="image/png,image/jpg,image/jpeg"
          showUploadList={false}
          maxCount={1}
          beforeUpload={() => false}
          openFileDialogOnClick={!imageUrl}
          onChange={handleChange}
        >
          {imageUrl ? (
            <div className="add-img-upload">
              <Image width={"100%"} src={imageUrl} />
              <CloseCircleOutlined
                className="upload-clear"
                onClick={clearImg}
              />
            </div>
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
    </Form>
  );

  return (
    <div
      className={`sort-index common-layout ${isMobile ? "mobile-site" : ""}`}
    >
      <Space style={{ width: "100%" }} direction={"vertical"}>
        {isMobile ? null : (
          <>
            <Row>
              <Col span={16}>
                <Space>
                  <Button type={"primary"} onClick={() => setVisible(true)}>
                    新增图片
                  </Button>
                  <Button onClick={() => setDelVisible(true)}>删除图片</Button>
                  <Button onClick={removeIps}>删除点赞ip</Button>
                </Space>
              </Col>
              <Col span={8}>
                <Search
                  placeholder="输入标题关键字搜索"
                  onSearch={onSearch}
                  enterButton
                />
              </Col>
            </Row>
            <Divider />
          </>
        )}

        <List
          grid={{ gutter: 16, column: isMobile ? 1 : 4 }}
          dataSource={data.filter((item) => item.title?.includes(searchValue))}
          renderItem={(item) => {
            return (
              <List.Item>
                <Card
                  title={item.title}
                  extra={
                    <Space
                      className="sort-index-like"
                      onClick={() => likeImg(item)}
                    >
                      {item.isTop && <FireFilled className="sort-index-fire" />}

                      <LikeFilled
                        className={`${
                          item.ips?.includes(currentIp) ? "liked" : ""
                        }`}
                      />
                      <span>
                        {item.isTop || item.likedNum > 1000
                          ? "999+"
                          : item.likedNum}
                      </span>
                    </Space>
                  }
                >
                  <Image preview={!isMobile} width={"100%"} src={item.url} />
                </Card>
              </List.Item>
            );
          }}
        ></List>
      </Space>
      {isMobile && (
        <>
          {!mobileAdd && (
            <PlusCircleFilled
              onClick={() => setMobileAdd(true)}
              className="sort-mobile-add"
            />
          )}
          {mobileAdd && (
            <div className="sort-form-add">
              <Space style={{ width: "100%" }} direction={"vertical"}>
                <div className="form-add-title">新增黑料图</div>
                {formComp}
                <Space style={{ width: "100%", justifyContent: "center" }}>
                  <Button onClick={() => setMobileAdd(false)}>取消</Button>
                  <Button type={"primary"} onClick={handleOk} loading={loading}>
                    确定
                  </Button>
                </Space>
              </Space>
            </div>
          )}
        </>
      )}
      <Modal
        title="新增黑料图"
        open={visible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {formComp}
      </Modal>
      <Modal
        title="删除黑料图"
        open={delVisible}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        onOk={removeImg}
        onCancel={() => setDelVisible(false)}
      >
        <Input
          placeholder="请输入需要删除的图片路径"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default SortIndex;
