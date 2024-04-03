import { SaveImgGetFileName, SaveTxtGetFileName, SaveFileOSSAPI, DelFileAPI } from "./api.js";


export const RandomInt = (min, max) => {
  if(min == max){return min;}
  return min + Math.floor(Math.random() * (max - min + 1));
}

export const SetSettingItemByPropertyAll = (setting, settingData) => {
  let names = Object.getOwnPropertyNames(settingData);
  for (let i = 0; i < names.length; i++) {
    const element = names[i];
    let names2 = Object.getOwnPropertyNames(settingData[element]);
    if (typeof settingData[element] === 'object') {
      for (let j = 0; j < names2.length; j++) {
        const element2 = names2[j];
        SetSettingItemByProperty(setting, element + '-' + element2, settingData[element][element2]);
      }
      continue;
    }
    SetSettingItemByProperty(setting, element, settingData[element]);
  }
}

export const SetSettingItemByProperty = (object, property, value) => {
  for (let i = 0; i < object.length; i++) {
    const element = object[i];
    if (element.property == property) {
      element.value = value;
    }
  }
}
export const GetSettingItemValueByProperty = (object, property) => {
  for (let i = 0; i < object.length; i++) {
    const element = object[i];
    if (element.property == property) {
      return element.value;
    }
  }
  return null;
}
export const GetSettingItemByProperty = (object, property) => {
  for (let i = 0; i < object.length; i++) {
    const element = object[i];
    if (element.property == property) {
      return element;
    }
  }
  return null;
}

/**
 * 
 * @param {*} object 
 * @param {*} property 
 * @param {*} property2 
 * @param {*} value 
 * @returns 
 */
export const SetSettingItemPropertyValueByProperty = (object, property, property2, value) => {
  for (let i = 0; i < object.length; i++) {
    const element = object[i];
    if (element.property == property) {
      element[property2] = value;
      return;
    }
  }
}

//获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开
export const FormatDate = () => {
  var g = new Date().getTime(); //1637120820767
  var now = new Date(g); //创建一个指定的日期对象
  var year = now.getFullYear(); //取得4位数的年份
  var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
  var date = now.getDate(); //返回日期月份中的天数（1到31）
  var hour = now.getHours(); //返回日期中的小时数（0到23）
  var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
  var second = now.getSeconds(); //返回日期中的秒数（0到59）
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hour +
    ":" +
    minute
    // +  ":" +  second
  );
}

//获取当前小时
export const GetDateH = () => {
  var g = new Date().getTime(); //1637120820767
  var now = new Date(g); //创建一个指定的日期对象 
  var hour = now.getHours(); //返回日期中的小时数（0到23） 
  return (hour
  );
}

//获取年月，转为文件夹路径
export const GetDateYM = () => {
  var g = new Date().getTime(); //1637120820767
  var now = new Date(g); //创建一个指定的日期对象
  var year = now.getFullYear(); //取得4位数的年份
  var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
  return (
    year +
    "/" +
    month
  );
}

export const ContentReplace = (content, f, e) => {
  //吧f替换成e
  var reg = new RegExp(f, "g"); //创建正则RegExp对象
  return content.replace(reg, e);
}

// 处理导入Excel中日期问题
export const FormatDateExcel = (numb, format) => {
  const time = new Date((numb - 1) * 24 * 3600000 + 1);
  time.setYear(time.getFullYear() - 70);
  const year = time.getFullYear() + "";
  const month = time.getMonth() + 1 + "";
  const date = time.getDate() - 1 + "";
  if (format && format.length === 1) {
    return year + format + month + format + date;
  }
  return (
    year +
    (month < 10 ? "0" + month : month) +
    (date < 10 ? "0" + date : date)
  );
}

export const readFile = (file) => {
  return new Promise(resolve => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = ev => {
      resolve(ev.target.result)
    }
  })
}

// 图片转blob，用于保存
export const dataURLtoBlob = (dataurl, name) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, {
    type: mime,
  });
}

// json字符串转blob,用于保存txt
export const stringtoBlob = (content, name) => {
  let str = new Blob([content], { type: "application/json" });
  return new File([str], name, {
    type: "application/json",
  });
}


/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj = null;
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
function getObjType(obj) {
  if (obj === null) {
    return String(obj)
  }
  const toType = (obj) => {
    // '[object RealType]' => realtype
    return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase()
  }
  return typeof obj === 'object' ?
    toType(obj) :
    typeof obj;
}