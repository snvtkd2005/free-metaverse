import {
    SaveImgGetFileName,
    SaveTxtGetFileName,
    SaveFileOSSAPI,
    SaveFileByNameOSSAPI,
    DelFileAPI, DeleteFileOSS
} from "./api.js";


//获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开
export const UploadImg = (file, inOSS, filePath, callback) => {

    if (inOSS) {
        let fromData = new FormData();
        fromData.append("filePath", filePath);
        // fromData.append("fileName", "test");
        fromData.append("file", file);
        SaveFileOSSAPI(fromData).then((response) => {
            callback(response);
        });

    } else {

        let fromData = new FormData();
        //服务器中的本地地址
        fromData.append("filePath", "D:/VueLX/secondvue/src/assets/images/pics/");
        // fromData.append("filePath", filePath);
        fromData.append("fileName", "test");
        fromData.append("file", file);
        SaveImgGetFileName(fromData).then((response) => {
            callback("images/pics/" + response);
        });

    }
}

export const UploadFile = (file, filePath,fileName, callback) => {

    let fromData = new FormData();
    fromData.append("filePath", filePath);
    // fromData.append("file", file);
    // SaveFileByNameOSSAPI(fromData).then((response) => {
    //     callback(response);
    // });
    fromData.append("fileName", fileName);
    fromData.append("file", file);
    SaveTxtGetFileName(fromData).then((response) => {
        callback(response);
    });
}


export const DelFile = (filePath, fileName , callback) => {
    let fromData = new FormData();
    fromData.append("filePath",filePath);
    fromData.append("fileName", fileName);
    DelFileAPI(fromData).then((response) => {
        callback(response);
    });
}

export const DelFileOSS = (fileName, inOSS, filePath, callback) => {
    if (fileName == null || fileName == undefined ||
        fileName == "" || fileName == "images/pics/0000.png") {
        callback("null");
        return false;
    }

    if (inOSS) {
        let fromData = new FormData();

        fromData.append("filePath", fileName);
        // fromData.append("filePath", "D:/VueLX/secondvue/src/assets/");
        // fromData.append("fileName", fileName);
        DeleteFileOSS(fromData).then((response) => {
            callback(response);
        });

    } else {

        let fromData = new FormData();
        fromData.append("filePath", "D:/VueLX/secondvue/src/assets/");
        fromData.append("fileName", fileName);
        DelFileAPI(fromData).then((response) => {
            callback(response);
        });

    }
}
// const response = await this.$axios.post("/api/news/getNewscontentById",fromData);

export const UploadTxt = (file, filePath, callback) => {
    let fromData = new FormData();
    fromData.append("filePath", filePath);
    fromData.append("fileName", "test");
    fromData.append("file", file);
    SaveTxtGetFileName(fromData).then((response) => {
        callback(response);
    });
}

export const UploadFileOSS = (file, filePath, callback) => {
    let fromData = new FormData();
    fromData.append("filePath", filePath);
    // fromData.append("fileName", "test");
    fromData.append("file", file);
    SaveFileOSSAPI(fromData).then((response) => {
        callback(response);
    });
} 
