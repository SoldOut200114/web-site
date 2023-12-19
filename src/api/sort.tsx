import request from "@/utils/request";

// 获取图片列表
export const getImgList = (params) => {
  return request({
    url: "/api/listImg",
    method: "get",
    params,
  });
};

// 获取访问者ip地址
export const getIp = () => {
  return request.get("/api/getIp");
};

// 新增图片
export const addImg = (params) => {
  return request.post("/api/addImg", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 删除图片
export const delImg = (params) => {
  return request.post("/api/del/img", params);
};

// 图片点赞功能
export const likeImg = (params) => {
  return request.post("/api/likeImg", params);
};

// 移除图片点赞ip地址
export const delIps = () => {
  return request.post("/api/del/ips");
};
