import Fetch from "./Fetch";
// let tag = "/peopledailyhealth";
let tag = "http://vr.peopledailyhealth.com";

export const loginUser = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/api/user/login`,
    data: data,
  });
};

export const getsmsCode = (data) => {
  return Fetch({
    method: "get",
    url: `${tag}/api/user/sendsms`,
    params: data,
  });
};
