/**
 * Created by chenLiang on 2018/9/26.
 */
import {windowHbridge} from './HBMBBridge'

export function urlencode(str) {
  str = (str + '').toString();

  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

export function urlDecode(zipStr) {
  var uzipStr = '';
  for (var i = 0; i < zipStr.length; i++) {
    var chr = zipStr.charAt(i);
    if (chr === '+') {
      uzipStr += ' ';
    } else if (chr === '%') {
      var asc = zipStr.substring(i + 1, i + 3);
      if (parseInt('0x' + asc) > 0x7f) {
        uzipStr += decodeURI('%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
        ;
        i += 8;
      } else {
        uzipStr += String.fromCharCode(parseInt('0x' + asc))
        i += 2;
      }
    } else {
      uzipStr += chr;
    }
  }
  return uzipStr;
}


// 获取地址栏参数
export function GetQueryString(str) {
  let url = window.location.href; // 获取url中'?'符后的字串
  let theRequest = {};
  if (url.indexOf('?') !== -1) {
    let index = url.indexOf('?');
    let str = url.substr(index + 1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
  }
  return theRequest[str];
}

// 获取地址栏参数
export function GetMobileQueryString(str) {
  let url = window.location.href; // 获取url中'?'符后的字串
  let theRequest = {};
  if (url.indexOf('#') !== -1) {
    url = url.split('#')[0]
  }

  if (url.indexOf('?') !== -1) {
    let index = url.indexOf('?');
    let str = url.substr(index + 1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
  }
  return theRequest[str];
}

// 获取地址栏参数(改良版)
export function GetQuery(str = '') {
  let url = decodeURIComponent(window.location.href);
  let aggregation = new Map();
  if (url.indexOf('?') !== -1) {
    let urlArr = url.split('?');
    urlArr.forEach(item => {
      if (item.indexOf('&') > -1) {
        item.split('&').forEach(val => {
          aggregation.set(...val.split('='))
        })
      } else if (item.indexOf('=') > -1) {
        aggregation.set(...item.split('='));
      }
    })
  }
  return aggregation.get(str) || false
}

// 判断是否为微信浏览器
export function isWeChart() {
  let agent = navigator.userAgent.toLowerCase();
  if (agent.indexOf('micromessenger') > -1) {
    return true;
  } else {
    return false;
  }
}

// 倒计时
export function countDown(callback) {
  let totalCount = 60
  let str = `重新获取(${totalCount})`
  let enable = false
  callback(str, enable)
  let timer = setInterval(() => {
    totalCount -= 1
    str = `重新获取(${totalCount})`
    if (totalCount === 0) {
      str = '重新获取'
      clearInterval(timer)
      timer = null
      enable = true
    }
    callback(str, enable)
  }, 1000)
}

// 生成随机数 min最小 max最大值
export function random(minNum = 0, maxNum = 100) {
  // return parseInt(Math.random() * (max - min + 1) + min, 10);
  //  // Math.floor(Math.random() * (max - min + 1) + min);
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}

// 金额的元变成万元单位 保留两位小数
export function changeUnit(val) {
  let money = '0.00';
  if (val) {
    money = Number(val);
    money = (money / 10000).toFixed(2)
  }
  return money;
}

// 两数相除计算成百分数 val1分子 val2分母 showPer 是否显示百分号，默认显示, 默认保留两位小数
/*export function changePercent(val1, val2, showPer = true) {
  let num = 0.00;
  if (val1 && val2) {
    num = NP.divide(val1, val2).toFixed(6);
    num = parseFloat(NP.times(num, 100).toFixed(2))
  }
  if (showPer) {
    return num + '%'
  }
  return num;
}*/

// 验证手机号， 只做了首位数字与长度验证
export function checkPhone(val) {
  return /^1\d{10}$/.test(val);
}

export function SectionToChinese(section) {
  let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  // let chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
  let chnUnitChar = ['', '十', '百', '千'];
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (section > 0) {
    let v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}

// 获取url中的文件名
export function getFileName(url) {
  let str = url;
  str = str.substring(str.lastIndexOf('/') + 1)
  str = str.substring(0, str.lastIndexOf('.'))
  return str;
}

// 获取url中的文件名，带后缀
export function getFileNameHasSuffix(url) {
  let str = url;
  str = str.substring(str.lastIndexOf('/') + 1)
  return str;
}

// 去掉千分符
export function delcommafy(str) {
  // 去除空格
  str = str.replace(/[ ]/g, '');
  str = str.replace(/,/gi, '');
  return str;
}

// 加上千分符
export function commafy(str) {
  let reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (str + '').replace(reg, '$&,');
}

// 格式化数量单位 超过万即显示万单位，超过亿即显示亿单位 例如 130000 => 13万 keepNum保留的小数位数 负数亦如此
// isObj 是否以对象形式返回 目的是将数字和单位分开 返回形式 {num: -12, unit: '万'}
export function dealNum(num, keepNum = 2, isObj = false) {
  num = num ? Number(num) : '';
  let add = '';
  if (num < 0) {
    num = Math.abs(num);
    add = '-';
  }
  let unit = '';
  if (num >= 100000000) {
    num = num / 100000000;
    unit = '亿';
  } else if (num >= 10000) {
    num = num / 10000;
    unit = '万';
  }
  if (keepNum >= 0 && num) {
    num = num.toFixed(keepNum);
  }
  if (isObj) return {num: add + num, unit};
  return add + num + unit;
}

// 利用js对超出的文字部分省略隐藏并用三点表示 txt文本 showTxtNum 显示多少文字 moreTxtNum超出几个文字开始隐藏
export function moreEllipsis(txt, showTxtNum, moreTxtNum = 0) {
  if (!moreTxtNum) moreTxtNum = showTxtNum + 2;
  if (txt.length >= moreTxtNum) {
    txt = txt.substring(0, showTxtNum) + '...';
  }
  return txt;
}


// 有关app
const ua = navigator.userAgent

export const isApp = ua.indexOf('ToukerAppMobileUserAgent-Qianqian') > 0 || ua.indexOf('StockWarningAppMobileUserAgent') > 0

export const isAndroid = function isAndroid() {
  return ua.indexOf('Android') > 0
}

export const isIOS = function isIOS() {
  return /(iPhone|iPad|iPod)/i.test(ua)
}

export function openUrl(url) {
  if (url && isApp) {
    try {
      if (window.HBMBBridge && window.HBMBBridge.checkAppRouterValidity()) {
        // 查看最新移动端接口API文档，调用替换的API逻辑
        let params = {'url': url}
        let method = 'openNativeURL'
        window.HBMBBridge.callApp(method, params, function (err, result) {
          if (err) {
            // error handle
          } else {
            // success handle
          }
        })
      } else {
        // 老移动端接口调用逻辑
        window.hbmobile.openNativeURL(url)
      }
    } catch (e) {
      console.log('调用移动端出错：' + e)
    }
  } else {
    window.location.href = 'https://m.touker.com/stock/download';
  }
}

export function openLogin(url) {
  if (url) {
    try {
      if (windowHbridge && windowHbridge.checkAppRouterValidity()) {
        // 查看最新移动端接口API文档，调用替换的API逻辑
        let method = 'openLoginPage'
        windowHbridge.callApp(method, {type: 1}, function (err, result) {
          if (err) {
            // error handle
          } else {
            // success handle
          }
        })
      } else {
        // 老移动端接口调用逻辑
        window.hbmobile.setOpenLoginPage(1);
      }
    } catch (e) {
      console.log('调用移动端出错：' + e)
    }
  }
}
// 调用原生方法
export function nativeMethod(method, callback = null, oldAndroid = false) {
  if (method) {
    if (isAndroid() && oldAndroid) {
      console.log('方法0')
      // 老移动端接口调用逻辑
      window.hbmobile[method](callback);
      return false;
    }
    try {
      if (window.HBMBBridge && window.HBMBBridge.checkAppRouterValidity()) {
        console.log('方法1')
        // 查看最新移动端接口API文档，调用替换的API逻辑
        window.HBMBBridge.callApp(method, {type: 1}, callback);
      } else {
        console.log('方法2')
        // 老移动端接口调用逻辑
        window.hbmobile[method](callback);
      }
    } catch (e) {
      console.log('调用移动端出错：' + e)
    }
  }
}

// 设置缓存数据
export function setStorage(key, data) {
  if (window.localStorage) {
    localStorage.setItem(key, JSON.stringify(data))
  } else {
    console.log('禁止了localStorage缓存设置');
  }
}

// 如有缓存数据则取出否则设置默认值
export function getStorage(key, initData) {
  if (window.localStorage) {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    } else {
      localStorage.setItem(key, JSON.stringify(initData));
    }
  }
  return initData;
}

// 设置缓存数据
export function setSeStorage(key, data) {
  if (window.sessionStorage) {
    sessionStorage.setItem(key, JSON.stringify(data))
  } else {
    console.log('禁止了localStorage缓存设置');
  }
}

// 如有缓存数据则取出否则设置默认值
export function getSeStorage(key, initData) {
  if (window.sessionStorage) {
    if (sessionStorage.getItem(key)) {
      return JSON.parse(sessionStorage.getItem(key));
    } else {
      sessionStorage.setItem(key, JSON.stringify(initData));
    }
  }
  return initData;
}

// 获取cookie
export function getCookie(cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=');
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

// 判断是否是小米app
export function isXiaomiApp() {
  return ua.indexOf('OgSh0zbc9im7AkIBkkM_Fg') > 0 || ua.indexOf('clVpbZthQDCpmYAchiQcrg') > 0 || ua.indexOf('lNYFwzCSRTYFLk-FeSb57A') > 0;
}

// 将数字处理成正负号形式 对于百分数 isTimes 为百分数时是否需要乘以100
/*export function dealNumPer(num, isPer = false, keepNum = 2, isTimes = true) {
  if (num === undefined || num === '') return '';
  if (!isPer) {
    num = Number(num);
    if (keepNum) num = num.toFixed(2);
    return num > 0 ? ('+' + num) : num;
  } else {
    if (isTimes) {
      num = NP.times(num, 100);
    }
    if (keepNum) num = num.toFixed(2)
    return num > 0 ? ('+' + num + '%') : num + '%';
  }
}*/

// 将一个数字变成一种状态 -1：  小于0，  0: 等于0， 1: 大于0 可结合数据字典用
export function numStatus(num) {
  num = Number(num);
  if (num > 0) {
    return 1;
  } else if (num < 0) {
    return -1;
  } else {
    return 0;
  }
}

// js中宽度大小自适应 默认适应于750的设计稿
export function rpx(size, wd = 750) {
  const RATE = window.innerWidth / wd;
  return Number(size) * RATE + 'px';
}

// 用于动画上的定时器，它会保持跟屏幕刷新同频，减少CPU性能消耗和函数节流
export let animationTimer = () => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}
export const clearAnimationTimer = window.cancelAnimationFrame ||
    Window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function (id) {
      window.clearTimeout(id);
    };
// 导入远程js
export function importJs(url) {
  if (document.getElementById(url)) return true;
  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = url;
  s.id = url;
  document.body.appendChild(s)
}
// 移除远程js
export function removeJs(id) {
  let dom = document.getElementById(id);
  if (dom) {
    dom.parentNode.removeChild(dom);
  }
}
// 在字符串中加入指定的html标签 str 需要加入的字符串 htmlStr被html标签包裹的字符串
export function strAddHtml(str, htmlStr, tag = 'span', className = '') {
  if (!str) return '';
  let index1 = str.indexOf(htmlStr);
  if (index1 === -1 || !htmlStr) return str || '';
  let index2 = index1 + htmlStr.length;
  return str.slice(0, index1) +
    '<' + tag + ' class="' + className + '">' +
    str.slice(index1, index2) + '</' + tag + '>' +
    str.slice(index2, str.length);
}
// 获取当前年月日  formatStr 需要显示的格式 Y年 M月 D日 H 小时 min分钟 S秒 W星期 -表示连接符可用任意连字符
export const getCurrentYMD = (formatStr = 'Y-M-D', timestamp = null) => {
  let myDate = timestamp ? new Date(timestamp) : new Date();
  let year = myDate.getFullYear() + '';
  let month = Number(myDate.getMonth()) + 1 + '';
  let date = myDate.getDate() + '';
  let hour = myDate.getHours() + '';
  let minute = myDate.getMinutes() + '';
  let week = myDate.getDay() + '';
  let seconds = myDate.getSeconds() + '';
  hour = Number(hour) < 10 ? ('0' + hour) : hour;
  minute = Number(minute) < 10 ? ('0' + minute) : minute;
  seconds = Number(seconds) < 10 ? ('0' + seconds) : seconds;
  formatStr = formatStr.indexOf('Y') > -1 ? formatStr.replace(/Y/, year) : formatStr;
  formatStr = formatStr.indexOf('M') > -1 ? formatStr.replace(/M/, month) : formatStr;
  formatStr = formatStr.indexOf('D') > -1 ? formatStr.replace(/D/, date) : formatStr;
  formatStr = formatStr.indexOf('H') > -1 ? formatStr.replace(/H/, hour) : formatStr;
  formatStr = formatStr.indexOf('min') > -1 ? formatStr.replace(/min/, minute) : formatStr;
  formatStr = formatStr.indexOf('W') > -1 ? formatStr.replace(/W/, week) : formatStr;
  formatStr = formatStr.indexOf('S') > -1 ? formatStr.replace(/S/, seconds) : formatStr;
  return formatStr;
};
// 格式化时间 str表示连接符 默认 - 连接  formatStr 需要显示的格式 Y年 M月 D日 H 小时 min分钟 S 秒
export const formatTime = (time, formatStr = 'Y-M-D', detail = false) => {
  time += '';
  if (!time || time.length < 10) {
    return '';
  } else if (time.length < 12) {
    time = parseInt(time) * 1000;
  }
  time = Number(time);
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = '' + month;
  month = month.length < 2 ? ('0' + month) : month;
  let day = date.getDate();
  day = '' + day;
  day = day.length < 2 ? ('0' + day) : day;
  let hour = date.getHours();
  let minute = date.getMinutes();
  let seconds = date.getSeconds();
  let left = [year, month, day].join('-');
  hour = Number(hour) < 10 ? ('0' + hour) : hour;
  minute = Number(minute) < 10 ? ('0' + minute) : minute;
  seconds = Number(seconds) < 10 ? ('0' + seconds) : seconds;
  const right = hour + ':' + minute;
  if (detail) {
    return left + ' ' + right;
  }
  formatStr = formatStr.indexOf('Y') > -1 ? formatStr.replace(/Y/, year) : formatStr;
  formatStr = formatStr.indexOf('M') > -1 ? formatStr.replace(/M/, month) : formatStr;
  formatStr = formatStr.indexOf('D') > -1 ? formatStr.replace(/D/, day) : formatStr;
  formatStr = formatStr.indexOf('H') > -1 ? formatStr.replace(/H/, hour) : formatStr;
  formatStr = formatStr.indexOf('min') > -1 ? formatStr.replace(/min/, minute) : formatStr;
  formatStr = formatStr.indexOf('S') > -1 ? formatStr.replace(/S/, seconds) : formatStr;
  return formatStr
}