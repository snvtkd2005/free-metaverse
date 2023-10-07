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