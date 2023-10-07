// # 创建水印功能网上一大把，随便搜一下
'use strict'

const watermark = {}

const setWatermark = (str) => {
    // console.log("初始化水印");
    const id = '7.432756475.689573874'

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    const can = document.createElement('canvas')
    can.width = 150
    can.height = 120

    const cans = can.getContext('2d')
    cans.rotate(-20 * Math.PI / 180)
    cans.font = '20px Vedana'
    cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 3, can.height / 2)

    const div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '70px'
    div.style.left = '0px'
    div.style.position = 'fixed'
    div.style.zIndex = '-1'
    div.style.width = document.documentElement.clientWidth - 100 + 'px'
    div.style.height = document.documentElement.clientHeight - 100 + 'px'
    // div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    div.style.background = 'url(/vue/shjkg/mask.jpg) left top repeat'
    // div.style.background = 'url(https://hyjkg.oss-cn-beijing.aliyuncs.com/images/mask.jpg) left top repeat'
    div.style.display = 'none'
    document.body.appendChild(div)
    return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
    let id = setWatermark(str)
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(str)
        }
    }, 500)
    window.onresize = () => {
        setWatermark(str)
    }
}
// 在watermark.js文件中
const outWatermark = (id) => {
    if (document.getElementById(id) !== null) {
        const div = document.getElementById(id)
        div.style.display = 'none'
    }
}

const setActiveFn = (id, display) => {
    if (document.getElementById(id) !== null) {
        const div = document.getElementById(id)
        div.style.display = display
        // console.log("设置水印2" + display);
    }
}


watermark.out = () => {
    const str = '7.432756475.689573874'
    outWatermark(str)
}
watermark.setActive = (b) => {
    // console.log("设置水印" + b);
    const str = '7.432756475.689573874'
    setActiveFn(str, b ? '' : 'none');
}
export default watermark
