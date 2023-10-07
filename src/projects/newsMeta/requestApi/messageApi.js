import Fetch from "./Fetch";
// let tag = "/peopledailyhealth";
let tag = "http://vr.peopledailyhealth.com";
let token = localStorage.getItem("apiToken");

export const getMessage = (data) => {
  return Fetch({
    method: "get",
    url: `${tag}/api/user/msgboard/list`,
    params: data,
    headers: {
      "api-token": token || "",
    },
  });
};

export const writeMessage = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/api/user/msgboard/write`,
    data,
    headers: {
      "api-token": token || "",
    },
  });
};

export const setCharacterApi = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/api/user/setchar`,
    data,
    headers: {
      "api-token": token || "",
    },
  });
};

// 获取配置api
export const getConfigList = (data) => {
  return Fetch({
    method: "get",
    url: `${tag}/api/config/list`,
    params: data,
    headers: {
      "api-token": token || "",
    },
  })
}
// 获取预置留言
export const getPreMsgList = (data) => {
  return Fetch({
    method: "get",
    url: `${tag}/api/user/msgboard/mocks`,
    params: data,
    headers: {
      "api-token": token || "",
    },
  })
}

// 增加预置配置
export const addConfigList = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/api/config/add`,
    data,
    headers: {
      "api-token": token || "",
    },
  })
}