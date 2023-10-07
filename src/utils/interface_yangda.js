

import request from "./requestUpload";
import axios from 'axios'

let ticket = "JAQMjm4XNKcCeQNDTGQrCHfnGKxJ8MSP";
let client_id = "yzu09719d65ae1ddb66";
let client_secret = "cZcMXBpFFBRWymYXD8X6G7dCDYxpMDRd";
// let signature = md5(ticket+client_id+client_secret);
let signature = '3899bbabe4dae7cf1c6e651c8e105396';

// 获取 access_token 的接⼝
let tokenPostPath = "http://xnfzgxpt.yzu.edu.cn/index/access3/token";

/**
 * 
 * 第三⽅应⽤程序从跳转链接中获取到 ticket 和 code，特别需要注意：code 有效时间为 30s
计算 signature = md5(ticket + clientId + clientSecret) 结果是32位⼩写字⺟
 * 
Query params

ticket: 获取到的 ticket
client_id: 平台分配的 clientId
signature: 计算出的 signature

Form data

code: code
client_id: clientId（平台分配）
client_secret: clientSecret（平台分配）
grant_type: authorization_code （定值）
redirect_uri: http://xnfzgxpt.yzu.edu.cn/index/access3/code （定值）

返回值：

{
 "access_token": "693e76806b2ee6dd7646dfd6b2b90eccc441a41a",
 "expires_in": 3600,
 "token_type": "Bearer",
 "scope": null,
 "refresh_token": "f383253c52eaefe9b258e960cc6e40da9b13a26a",
 "code": 1
}

 */

//获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开
export const GetToken = () => {

    let ticket = "JAQMjm4XNKcCeQNDTGQrCHfnGKxJ8MSP";
    let client_id = "yzu09719d65ae1ddb66";
    let client_secret = "cZcMXBpFFBRWymYXD8X6G7dCDYxpMDRd";
    // let signature = md5(ticket+client_id+client_secret);
    let signature = '3899bbabe4dae7cf1c6e651c8e105396';

    let params = { ticket: ticket, client_id: client_id, signature: signature };

    let fromData = new FormData();
    // fromData.ticket = ticket;
    // fromData.client_id = client_id;
    // fromData.signature = signature;
    let code = '3168d4564bf3221e7284231e49adb1cc96247cb6';
    fromData.append("code",code);
    fromData.append("client_id",client_id);
    fromData.append("client_secret",client_secret);
    fromData.append("grant_type",'authorization_code');
    fromData.append("redirect_uri",'http://xnfzgxpt.yzu.edu.cn/index/access3/code');

    // fromData.code = code;
    // fromData.client_id = client_id;
    // fromData.client_secret = client_secret;
    // fromData.grant_type = 'authorization_code';
    // fromData.redirect_uri = 'http://xnfzgxpt.yzu.edu.cn/index/access3/code';


    // return request.post(tokenPostPath+JSON.stringify(params),fromData);

    // return request.post(tokenPostPath+'?ticket='+ticket+'&client_id='+
    // client_id + '&signature='+signature ,fromData);

    // axios({
    //     method: "post",
    //     url: tokenPostPath,
    //     // params: (params),
    //     // data: (fromData),
    //     headers: { 'Content-Type': 'application/json' },
    //     params: JSON.stringify(params),
    //     data: JSON.stringify(fromData),
    //     dataType: 'json',
    // }).then(res => {
    //     console.log(res);
    // })

     request.post(tokenPostPath+'?ticket='+ticket+'&client_id='+
    client_id + '&signature='+signature ,(fromData)).then(res => {
            console.log(res);
        });
        return;

    // request.post(tokenPostPath, JSON.stringify(fromData)).then(res => {
    //     console.log(res);
    // })
    // request.post(tokenPostPath, (fromData)).then(res => {
    //     console.log(res);
    // })
    
    request.post(tokenPostPath,{
        params:params,
        data:fromData
    } ).then(res => {
        console.log(res);
    })
}


// 获取⽤户数据的接⼝
/**
 接⼝地址(POST)
http://xnfzgxpt.yzu.edu.cn/index/access3/getAccessTokenData
Query params
access_token: access_token
返回值
{
 "username": "username",
 "realname": "realname",
 "code": 1
}

 */


// 上传考试数据的接⼝

/**
 接⼝地址(POST)
http://xnfzgxpt.yzu.edu.cn/index/resource/index
Query params
access_token: access_token
Form data
score: 55 (分数, int(11))
use_time: 361 (秒数, int(11))
start_time: 2021-7-29 16:23:53 (string)
exam_id: 第三⽅应⽤中考试业务的id（具有唯⼀性, string(64)）
steps: [{
 num:1 (实验步骤序号, int(11))
 title:"转动阀⻔" (实验步骤名称, string)
 start_time:1642408896 (实验步骤开始时间, 10位时间戳, 采⽤utc-8时区)
 end_time:1642408916 (实验步骤结束时间, 10位时间戳, 采⽤utc-8时区)
 expect_time:23 (实验步骤合理⽤时, 秒数, int(11))
 max_score:3 (实验步骤满分, 分数, int(11))
 score:2 (实验步骤实际得分, 分数, int(11))
 repeat_count:3 (实验步骤操作次数, int(11))
 evaluation:"阀⻔处于微开状态，开度不宜过⼤，控制流速..." (实验步骤评价, string)
 score_model:"如果阀⻔转动3圈以上，不得分；如果阀⻔转动1圈⾄2圈，得1分；如果阀⻔转动
1/3圈⾄1圈之间，得3分..." (实验步骤赋分模型, string)
 remarks:"⽆" (实验步骤备注, string)
}]
返回值:
{
 "code": 1,
 "msg": "success",
 "data": "",
 "url": "/index/resource/index.html",
 "wait": 3
}

 */