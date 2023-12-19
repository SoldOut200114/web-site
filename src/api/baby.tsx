import request from "@/utils/request";

// 获取文档菜单数据
export const getDocMenus = (params) => {
  return request({
    url: "/api/getDocMenus",
    method: "get",
    params,
  });
};

// 获取文档数据
export const getDoc = (params) => {
  return request({
    url: "/api/getDoc",
    method: "get",
    params,
    responseType: "blob",
  });
};

// 新增文档菜单
export const addDocMenu = (params) => {
  return request.post("/api/addDocMenu", params);
};

// 新增文档
export const addDoc = (params) => {
  return request.post("/api/addDoc", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
