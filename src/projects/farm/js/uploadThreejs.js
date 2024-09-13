import Fetch from "./Fetch";

// let tag = "https://192.168.0.63:3335";
let tag = "https://snvtkd2005.com:3335";

export const CopyFolderBase = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/copyFolderBase`,
        data: data,
    });
}

export const RemoveFolderBase = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/removeFolderBase`,
        data: data,
    });
}

// 通过地图id查找该地图id上的场景模型或单品模型
export const RequestMetaWorld = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/metaWorld`,
        data: data,
    });
}

// 上传文件
export const UploadFile = (data,progress) => {
    return Fetch({
        method: "post",
        url: `${tag}/upload`,
        data: data,
        onUploadProgress:progress,
    });
}

export const UploadPlayerFile = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadPlayer`,
        data: data,
    });
}

export const UploadSkill = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadSkill`,
        data: data,
    });
}

export const UploadSceneFile = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadScene`,
        data: data,
    });
}
export const UploadGroupFile = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadGroup`,
        data: data,
    });
}

export const UploadHDRFile = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadHDR`,
        data: data,
    });
}

export const UploadUVAnimFile = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadUVAnim`,
        data: data,
    });
}

export const UploadAudioFile = (data) => {
    return Fetch({
        method: "post",
        url: `${tag}/uploadAudio`,
        data: data,
    });
}


// 获取单品模型数据
export const GetAllModel = () => {
    return Fetch({
        method: "get",
        url: `${tag}/getAllModel`,
        // data: data,
    });
}

export const GetAllHDR = () => {
    return Fetch({
        method: "get",
        url: `${tag}/getAllHDR`,
        // data: data,
    });
}

export const GetAllAudio = () => {
    return Fetch({
        method: "get",
        url: `${tag}/getAllAudio`,
        // data: data,
    });
}

export const GetAllUVAnim = () => {
    return Fetch({
        method: "get",
        url: `${tag}/getAllUVAnim`,
        // data: data,
    });
}

export const GetAllScene = () => {
    return Fetch({
        method: "get",
        url: `${tag}/getAllScene`,
        // data: data,
    });
}
export const GetAllGroup = () => {
    return Fetch({
        method: "get",
        url: `${tag}/getAllGroup`,
        // data: data,
    });
}