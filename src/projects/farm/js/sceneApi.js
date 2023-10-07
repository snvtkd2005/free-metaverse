import Fetch from "./Fetch";
// let tag = "http://43.138.163.92:9090";
let tag = "";
// let tag = "/worldActivity";
export const getSceneData = (data) => {
  return Fetch({
    method: "post",
    url: `${tag}/world/activity/get`,
    data: data,
  });
};