


import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 表情管理
class FaceBone {
    constructor(mesh) {
        let scope = this;

        let faceData = [
            {
                name: "眉毛位置上", mmd: "上",
                value: 0, //value为0时居中，为1时最上
                duration: 0,//表示value从上一个值变为目标值的持续时间，单位秒
            },
            {
                name: "眉毛位置下", mmd: "下",
                value: 0,  //value 为0时居中，为1时最下 
                duration: 0,
            },
            {
                name: "眉毛生气", mmd: "怒り",
                value: 0,  //value 为0时正常，为1时生气
                duration: 0,
            },
            {
                name: "眉毛委屈", mmd: "恥ずかしい",
                value: 0,  //value 为0时正常，为1时委屈
                duration: 0,
            },

            {
                name: "闭眼", mmd: "まばたき",
                value: 0, //value 0为睁眼，1为闭眼
                duration: 0,
            },
            {
                name: "闭眼笑", mmd: "笑い",
                value: 0, //value 0为睁眼，1为微笑状态的闭眼
                duration: 0,
            },


            {
                name: "眼惊吓", mmd: "びっくり",
                value: 0, //value 0为正常，1为睁眼状态惊吓
                duration: 0,
            },
            {
                name: "睁眼生气", mmd: "怒り目",
                value: 0, //value 0为正常，1为睁眼状态生气
                duration: 0,
            },
            {
                name: "睁眼委屈", mmd: "悲しむ",
                value: 0, //value 0为正常，1为睁眼状态委屈
                duration: 0,
            },
            {
                name: "睁眼无语", mmd: "ジト目",
                value: 0, //value 0为正常，1为睁眼状态无语
                duration: 0,
            },

            {
                name: "瞳孔小", mmd: "瞳小",
                value: 0, //value 0为最大，1为最小
                duration: 0,
            },
            {
                name: "嘴线大", mmd: "口横広げ",
                value: 0, //value 0为正常，1为最大
                duration: 0,
            },
            {
                name: "嘴线小", mmd: "口横狭め",
                value: 0, //value 0为正常，1为最小
                duration: 0,
            },
            {
                name: "嘴惊吓", mmd: "あ２",
                value: 0, //value 0为正常，1为张嘴惊吓状
                duration: 0,
            },
            {
                name: "嘴生气", mmd: "い２",
                value: 0, //value 0为正常，1为张嘴生气状
                duration: 0,
            },
            {
                name: "嘴发呆", mmd: "い１",
                value: 0, //value 0为正常，1为张嘴发呆无语状
                duration: 0,
            },

            {
                name: "左嘴角上扬", mmd: "にやり２",
                value: 0, //value 0为正常，1为张嘴发呆无语状
                duration: 0,
            },

            {
                name: "左嘴角上扬张开", mmd: "にやり３",
                value: 0, //value 0为正常，1为张嘴发呆无语状
                duration: 0,
            },

            {
                name: "嘴吧张开", mmd: "ワ",
                value: 0, //value 0为正常，1为张嘴最大
                duration: 0,
            },

            {
                name: "嘴角下", mmd: "ん",
                value: 0, //value 0为正常，1为闭嘴委屈状
                duration: 0,
            },
            {
                name: "嘴角上", mmd: "にやり",
                value: 0, //value 0为正常，1为闭嘴微笑状
                duration: 0,
            },

            {
                name: "嘴型a", mmd: "あ",
                value: 0, //value 0为正常，1为发音a
                duration: 0,
            },
            {
                name: "嘴型i", mmd: "い",
                value: 0, //value 0为正常，1为发音i
                duration: 0,
            },
            {
                name: "嘴型u", mmd: "う",
                value: 0, //value 0为正常，1为发音u
                duration: 0,
            },
            {
                name: "嘴型e", mmd: "え",
                value: 0, //value 0为正常，1为发音e
                duration: 0,
            },
            {
                name: "嘴型o", mmd: "お",
                value: 0, //value 0为正常，1为发音o
                duration: 0,
            },
        ];

        // let expression = [
        //     {
        //         name: "闭眼",
        //         faceData: [
        //             { name: "闭眼", value: 1 },
        //         ],
        //         duration: 0.2,
        //     },
        //     {
        //         name: "睁眼",
        //         faceData: [
        //             { name: "闭眼", value: 0 },
        //         ],
        //         duration: 0.2,
        //     },
        // ];
        // 发音
        let zhimuData = [
            {
                name: "a",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                faceData: [
                    { name: "嘴型a", value: 1, },
                    { name: "嘴型o", value: 0, },
                    { name: "嘴型e", value: 0, },
                    { name: "嘴型i", value: 0, },
                    { name: "嘴型u", value: 0, }, 
                ],
            },
            {
                name: "o",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [ 
                    { name: "嘴型a", value: 0, },
                    { name: "嘴型o", value: 1, },
                    { name: "嘴型e", value: 0, },
                    { name: "嘴型i", value: 0, },
                    { name: "嘴型u", value: 0, }, 
                ],
            },
            {
                name: "e",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [ 
                    { name: "嘴型a", value: 0, },
                    { name: "嘴型o", value: 0, },
                    { name: "嘴型e", value: 1, },
                    { name: "嘴型i", value: 0, },
                    { name: "嘴型u", value: 0, }, 
                ],
            },
            {
                name: "i",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [ 
                    
                    { name: "嘴型a", value: 0, },
                    { name: "嘴型o", value: 0, },
                    { name: "嘴型e", value: 0, },
                    { name: "嘴型i", value: 1, },
                    { name: "嘴型u", value: 0, }, 
                ],
            },
            {
                name: "u",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [ 
                    { name: "嘴型a", value: 0, },
                    { name: "嘴型o", value: 0, },
                    { name: "嘴型e", value: 0, },
                    { name: "嘴型i", value: 0, },
                    { name: "嘴型u", value: 1, }, 
                    { name: "嘴线小", value: 0.6 },
                ],
            },
            {
                name: "v",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                   
                    { name: "嘴型a", value: 0, },
                    { name: "嘴型o", value: 0, },
                    { name: "嘴型e", value: 0, },
                    { name: "嘴型i", value: 0, },
                    { name: "嘴型u", value: 1, }, 

                    { name: "嘴线小", value: 0.6 },
                ],
            },

            {
                name: "bpm",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [
                    { name: "嘴线大", value: 0.7 },
                ],
            },
            {
                name: "f",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [
                    { name: "嘴线大", value: 0.7 },
                ],
            },

            {
                name: "dtnl",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [
                    { name: "嘴型e", value: 0.1 },
                    { name: "嘴型i", value: 0 },
                ],
            },

            {
                name: "gkh",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [
                    { name: "嘴型e", value: 0.1 },
                    { name: "嘴型i", value: 0 },
                ],
            },

            {
                name: "jqxyzhchshrzcs",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间   
                faceData: [
                    { name: "嘴型e", value: 0 },
                    { name: "嘴型i", value: 1 },
                ],
            }, 


        ]

        // 情绪
        let expressionData = [
            {
                name: "高兴",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                    { name: "闭眼笑", value: 1, },
                    { name: "嘴角上", value: 1, },
                ],
            },
            {
                name: "闭眼",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                    { name: "闭眼", value: 1, },
                ],
            },
            {
                name: "伤心委屈",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                    { name: "睁眼委屈", value: 1 },
                    { name: "眉毛位置下", value: 1 },
                    { name: "眉毛委屈", value: 1 },
                    { name: "嘴角下", value: 1 },
                ],
            },
            {
                name: "生气",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                    { name: "眉毛生气", value: 1 },
                    { name: "嘴生气", value: 1 },
                    { name: "睁眼生气", value: 1 },
                ],
            },
            {
                name: "疑问",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                    { name: "眉毛位置上", value: 0.5 },
                    { name: "嘴角下", value: 0.3 },
                    { name: "闭眼", value: 0.1 },
                ],
            },
            {
                name: "惊吓",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [
                    { name: "瞳孔小", value: 1 },
                    { name: "嘴惊吓", value: 1 },
                    { name: "眉毛位置上", value: 1 },
                ],
            },
            {
                name: "无语",
                perc: 0.0, // 百分比   
                duration: 0.25, // 插值变化的时间  
                time: 1, //动作完成后的持续时间
                faceData: [

                    { name: "睁眼无语", value: 1 },
                    { name: "嘴吧张开", value: 0.1 },
                    { name: "瞳孔小", value: 0.51 },
                    { name: "左嘴角上扬", value: 1 },


                ],
            },
            {
                name: "正常",
                perc: 0.0, // 百分比  
                duration: 0.25, // 插值变化的时间  
                time: -1, //动作完成后的持续时间
                faceData: [
                    { name: "闭眼笑", value: 0 },
                    { name: "眉毛生气", value: 0 },
                    { name: "嘴生气", value: 0 },
                    { name: "睁眼生气", value: 0 },
                    { name: "瞳孔小", value: 0 },
                    { name: "嘴惊吓", value: 0 },
                    { name: "眼惊吓", value: 0 },
                    { name: "眉毛位置上", value: 0 },
                    { name: "嘴角上", value: 0 },
                    { name: "嘴角下", value: 0 },
                ],
            },
        ]

        let expressionFormat = [
            {
                action: "眼皮事件",
                faceData: [
                    {
                        "name": "闭眼",
                        "value": 0.0, // 开始时眼睛完全睁开  
                        "duration": 0.1 // 眨眼开始前的准备时间，保持睁开状态  
                    },
                ]
            },
        ];

        let expression = [  
            {  
                action: "眨眼",  
                faceData: [  
                    {  
                        "name": "闭眼",  
                        "value": 0.0, // 开始时眼睛完全睁开  
                        "duration": 0.1 // 眨眼开始前的准备时间，保持睁开状态  
                    },  
                    {  
                        "name": "闭眼",  
                        "value": 0.5, // 眼睛开始闭合到一半  
                        "duration": 0.1 // 眨眼动作中眼睛闭合的时间  
                    },  
                    {  
                        "name": "闭眼",  
                        "value": 1.0, // 眼睛完全闭合  
                        "duration": 0.05 // 眨眼动作中眼睛保持闭合的时间  
                    },  
                    {  
                        "name": "闭眼",  
                        "value": 0.5, // 眼睛开始重新睁开到一半  
                        "duration": 0.1 // 眨眼动作中眼睛重新睁开的时间  
                    },  
                    {  
                        "name": "闭眼",  
                        "value": 0.0, // 眼睛完全睁开  
                        "duration": 0.1 // 眨眼动作结束后，眼睛保持睁开状态的时间  
                    }  
                ]  
            },   
        ];
 

        const keys = [];

        function initGui() {
            const gui = new GUI();
            const dictionary = mesh.morphTargetDictionary;
            const controls = {};
            const bq = gui.addFolder('情绪');
            const zhimu = gui.addFolder('发音');
            const morphs = gui.addFolder('Morphs');
            function initControls() {
                for (const key in dictionary) {
                    let keyT = key;
                    for (let i = 0; i < faceData.length; i++) {
                        const element = faceData[i];
                        if (element.mmd == key) {
                            keyT = element.name;
                        }
                    }
                    controls[keyT] = 0.0;
                }

                for (let i = 0; i < expressionData.length; i++) {
                    const element = expressionData[i];
                    controls[element.name] = 0.0;
                }

                for (let i = 0; i < zhimuData.length; i++) {
                    const element = zhimuData[i];
                    controls[element.name] = 0.0;
                }
            }
            function initKeys() {
                for (const key in dictionary) {
                    let keyT = key;
                    for (let i = 0; i < faceData.length; i++) {
                        const element = faceData[i];
                        if (element.mmd == key) {
                            keyT = element.name;
                        }
                    }

                    keys.push(keyT);
                }

                // 表情
                for (let i = 0; i < expressionData.length; i++) {
                    const element = expressionData[i];
                    bq.add(controls, element.name, 0.0, 1.0, 0.01).onChange((v)=>{
                        // console.log(element.name,v);
                        playE(element.name,v);
                    }); 
                }  

                for (let i = 0; i < zhimuData.length; i++) {
                    const element = zhimuData[i];
                    zhimu.add(controls, element.name, 0.0, 1.0, 0.01).onChange((v) => {
                        playE(element.name, v);
                    });
                }

            }
            function initMorphs() {

                for (const key in dictionary) {

                    let keyT = key;
                    for (let i = 0; i < faceData.length; i++) {
                        const element = faceData[i];
                        if (element.mmd == key) {
                            keyT = element.name;
                        }
                    }
                    if (keyT == key) {
                        console.log(keyT);
                    }
                    morphs.add(controls, keyT, 0.0, 1.0, 0.01).onChange(onChangeMorph);
                }
            }


            function onChangeMorph() {
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = controls[key];
                    mesh.morphTargetInfluences[i] = value;
                }
            }

            initControls();
            initKeys();
            initMorphs();

            onChangeMorph();
            morphs.close();
            bq.close();
            zhimu.close();
        }

        function getCurrent(name) {
            for (let i = 0; i < faceData.length; i++) {
                const element = faceData[i];
                if (element.name == name) {
                    return element;
                }
            }
        }
        function getKeyIndex(name) {
            let mmd = "";
            for (let i = 0; i < faceData.length; i++) {
                const element = faceData[i];
                if (element.name == name) {
                    mmd = element.mmd;
                }
            }
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key == mmd || key == name) {
                    return i;
                }
            }
        }


        let shengmu = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s"];
        let yunmu = [
            "a", "o", "e", "i", "u", "v",
            "ai", "ei", "ui", "ao", "ou", "iu", "ie", "ve",
            "er", "an", "en", "in", "un", "vn",
            "ang", "eng", "ing", "ong",
            "ia", "ua", "uo", "ie", "ve",
            "ian", "uan", "uen", "vng", "eng", "ing", "ong",
            "iang", "uang", "iong"
        ];
        let yunmu2 = [ 
            "ai", "ei", "ui", "ao", "ou", "iu", "ie", "ve", 
        ];
        function splitPinyinIntoSyllables(pinyin) {
            // 预设的声母映射，用于识别多字母声母（如zh, ch, sh等）  
            const multiLetterInitials = ['zh', 'ch', 'sh'];
            // 分解音节  
            const syllables = [];

            let has = false;
            for (let i = 0; i < multiLetterInitials.length && !has; i++) {
                const element = multiLetterInitials[i];
                if (pinyin.includes(element)) {
                    syllables.push(element);
                    has = true;
                }
            }
            if (!has) {
                syllables.push(pinyin[0]);
                syllables.push(pinyin.substring(1));
            } else {
                syllables.push(pinyin.substring(2));
            }
            return syllables;
        }



        function Init() {
            // for (let i = 0; i < expression.length; i++) {
            //     // setTimeout(() => {
            //     //     // 
            //     //     // let { name, faceData, duration } = expressionItem;
            //     //     // // for (let i = 0; i < faceData.length; i++) {
            //     //     // //     const element = faceData[i];
            //     //     // //     let morphIndex = getKeyIndex(element.name);
            //     //     // //     TweenAlpha(getCurrent(element.name), element.value, duration, (v) => {
            //     //     // //         mesh.morphTargetInfluences[morphIndex] = v;
            //     //     // //     });
            //     //     // // }
            //     // }, 2000 * i);
            //     const expressionItem = expression[i];
            //     playExpression(expressionItem,0);

            // }

            // return;

            setInterval(() => {

                for (let i = 0; i < expression.length; i++) {
                    const expressionItem = expression[i];
                    playExpression(expressionItem.faceData, 0);
                }

            }, 5000 * 1);




            setTimeout(() => {

                // 测试函数  
                const pinyin = ["ni", "shi", "shui"];
                const all = [];
                for (let i = 0; i < pinyin.length; i++) {
                    const syllables = splitPinyinIntoSyllables(pinyin[i]);

                    let yunmuc = syllables[1];
                    let has = false
                    for (let j = 0; j < yunmu2.length && !has; j++) {
                        const element = yunmu2[j];
                        if(element == yunmuc){
                            has = true; 
                        }
                    } 
                    if(!has){

                    }else{
                        syllables[1] = yunmuc.substring(0,1);
                        syllables[2] = yunmuc.substring(1);
                    }
                    for (let j = 0; j < syllables.length; j++) {
                        all.push(syllables[j]);
                    } 
                    // console.log("音节:", syllables);
                }
                // console.log("音节:", all);
                playZM(all, 0);
            }, 2000 * 1);
            return;
            // const pinyin = "nishishui";  

            setTimeout(() => {
                let zm = "aoeiuv";
                //分解声母韵母

            }, 2000 * 1);
        }
        function playExpression(faceData, i) {
            let { name, value, duration } = faceData[i];
            let morphIndex = getKeyIndex(name);
            let cur = getCurrent(name);
            TweenAlpha(cur.value, value, duration, (v) => {
                // console.log(v);
                mesh.morphTargetInfluences[morphIndex] = v;

            }, () => {
                // console.log("完成",i);
                i++;
                cur.value = value;
                if (faceData.length == i) {
                    return;
                }
                playExpression(faceData, i);
            });
        }

        function playZM(syllables, num) {
            // console.log(syllables, num, syllables[num]);
            for (let i = 0; i < zhimuData.length; i++) {
                const element = zhimuData[i];
                if (element.name.includes(syllables[num])) {
                    // console.log(element,);
                    for (let j = 0; j < element.faceData.length; j++) {
                        const facedataItem = element.faceData[j];
                        let { name, value } = facedataItem;
                        let morphIndex = getKeyIndex(name);
                        let cur = getCurrent(name);
                        // console.log(name,cur.value, value,morphIndex);
                        TweenAlpha(cur.value, value, element.duration * 10, (v) => {
                            mesh.morphTargetInfluences[morphIndex] = v;
                            // console.log(v);
                        }, () => {
                            num++;
                            cur.value = value;
                            if (syllables.length == num) {
                                return;
                            }
                            playZM(syllables, num);
                        });
                    }
                    return;
                }
            }
        }
        function playE(expName, perc) {
            // console.log(expName, perc);
            for (let i = 0; i < expressionData.length; i++) {
                const element = expressionData[i];
                if (element.name == expName) {
                    for (let j = 0; j < element.faceData.length; j++) {
                        const facedataItem = element.faceData[j];
                        playExpression2(facedataItem.name, element.duration, facedataItem.value * perc);
                    }
                    return;
                }
            }

            for (let i = 0; i < zhimuData.length; i++) {
                const element = zhimuData[i];
                if (element.name == expName) {
                    for (let j = 0; j < element.faceData.length; j++) {
                        const facedataItem = element.faceData[j];
                        playExpression2(facedataItem.name, element.duration, facedataItem.value * perc);
                    }
                    return;
                }
            }
        }
        function playExpression2(name, duration, value) {
            let morphIndex = getKeyIndex(name);
            let cur = getCurrent(name);
            // console.log(name,cur.value, value);
            TweenAlpha(cur.value, value, duration, (v) => {
                mesh.morphTargetInfluences[morphIndex] = v;
            }, () => {
                // console.log("完成",name); 
                cur.value = value;
            });
        }



        function TweenAlpha(f, t, duration, update, onComplete) {
            // console.log("TweenAlpha",f, t, duration);
            let from = new THREE.Vector3(f, 0, 0);
            let _to = new THREE.Vector3(t, 0, 0);
            let current = from.clone();
            let to = _to.clone();
            let movingTween = new TWEEN.Tween(current).to(to, duration * 1000).easing(TWEEN.Easing.Linear.None)
            let updateTargetPos = () => {
                if (update) {
                    update(current.x);
                }
            }
            movingTween.onUpdate(updateTargetPos);
            movingTween.start() // 启动动画
            movingTween.onComplete(() => {
                if (onComplete) {
                    onComplete();
                }
            });
        }

        initGui();
        Init();
    }
}
export { FaceBone };