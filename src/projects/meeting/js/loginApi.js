import Fetch from "./Fetch";
// let tag = "/worldActivity";
let tag = "http://43.138.163.92:9090";
// let tag2 = "http://43.138.163.92:8080";

// 
// let tag = "https://zmeta.cztv.com/api";
// let tag2 = "https://zmeta.cztv.com/api";
let tag2 = "https://zavatar.cztv.com/api";

export const GetArcId = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/world/activity/getonlineid`,
    data: data,
  });
};

export const GetSceneData = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/world/activity/get`,
    data: data,
  });
};

export const CheckUserInvaild = (data) => {
  return Fetch({
    method: "post",
    url: `${tag2}/user/whitephonenum/check`,
    data: data,
  });
};
