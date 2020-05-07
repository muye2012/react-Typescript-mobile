/**
 * Created by chenLiang on 2019/03/10.
 */
const HBAPPANDROIDBRIDGENAME = 'hb_mb_bridge';
const HBAPPIOSBRIDGENAME = 'hb_mb_bridge';
declare global {
    interface Window { webkit: any; HBMBBridge: any;}
}
(function (win) {
    let ua = navigator.userAgent;

    function isAndroid() {
        return ua.indexOf('Android') > 0;
    }

    function isIOS() {
        return /(iPhone|iPad|iPod)/i.test(ua);
    }

    function checkIOSWebkit() {
        return isIOS() && (typeof window.webkit !== 'undefined') && (typeof window.webkit.messageHandlers !== 'undefined') && ((typeof window.webkit.messageHandlers[HBAPPIOSBRIDGENAME] !== 'undefined') === true);
    }

    /**
     * 校验是否是IOS bridge 环境
     */
    function checkIosBridge() {
        return isIOS() && (typeof win[HBAPPANDROIDBRIDGENAME] !== 'undefined')
    }

    let mobile = {
        check_webkit: function () {
            return checkIOSWebkit();
        },
        checkAppRouterValidity: function () {
            if (isAndroid() && (typeof win[HBAPPANDROIDBRIDGENAME] !== 'undefined')) {
                return true;
            } else if (checkIosBridge()) {
                return true;
            } else if (checkIOSWebkit()) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *通过bridge调用app端的方法
         * @param method
         * @param params
         * @param callBack
         */
        callApp: function (method: any, params: any, callback: any) {
            // if (!checkAppRouterValidity()) {
            //   callback("bridge is not available!", null);
            //   return;
            // }
            let req = {
                Method: method,
                Data: params
            };
            if (isIOS()) {
                if (checkIOSWebkit()) {
                    console.log('checkIOSWebkit')
                    let cbName = 'CB_iOS_' + Date.now() + '_' + Math.ceil(Math.random() * 10);
                    // 挂载一个临时函数到window变量上，方便app回调
                    win[cbName] = function (err: any, result: any) {
                        let resultObj;
                        if (typeof result !== 'undefined' && result !== null) {
                            try {
                                resultObj = JSON.parse(result)['result'];
                            } catch (e) {
                                resultObj = result;
                            }
                        }
                        callback(err, resultObj);
                        // 回调成功之后删除挂载到window上的临时函数
                        delete win[cbName];
                    };
                    req['CB_iOS'] = cbName;
                    window.webkit.messageHandlers[HBAPPIOSBRIDGENAME].postMessage(req);
                } else {
                    console.log('checkIOS')
                    win[HBAPPIOSBRIDGENAME].callRouter(req, function (err: any, result: any) {
                        let resultObj = null;
                        let errorMsg = null;
                        if (typeof result !== 'undefined' && result !== 'null' && result !== null) {
                            resultObj = JSON.parse(result);
                            if (resultObj) {
                                resultObj = resultObj.result;
                            }
                        }
                        if (err !== 'null' && typeof err !== 'undefined' && err !== null) {
                            errorMsg = err;
                        }
                        callback(errorMsg, resultObj);
                    });
                }
            } else if (isAndroid()) {
                // 生成回调函数方法名称
                let cbName = 'CB_' + Date.now() + '_' + Math.ceil(Math.random() * 10);
                // 挂载一个临时函数到window变量上，方便app回调
                win[cbName] = function (err: any, result: any) {
                    let resultObj;
                    if (typeof result !== 'undefined' && result !== null) {
                        resultObj = JSON.parse(result).result;
                    }
                    callback(err, resultObj);
                    // 回调成功之后删除挂载到window上的临时函数
                    delete win[cbName];
                };
                win[HBAPPANDROIDBRIDGENAME].callRouter(JSON.stringify(req), cbName);
            }
        },
        callAppSync: function (method: any, params: any) {
            if (!this.checkAppRouterValidity()) {
                return {errMsg: 'bridge is not available!'};
            }
            let req = {
                Method: method,
                Data: params
            };
            let responseJSONObj = null;
            let response = null;
            if (isIOS()) {
                let iosBridge = win[HBAPPIOSBRIDGENAME];
                let callRouterSyncFunc = iosBridge.callRouterSync;
                if (callRouterSyncFunc) {
                    responseJSONObj = callRouterSyncFunc(req);
                    response = responseJSONObj;
                    return response;
                } else {
                    let methodFunc = iosBridge[method];
                    if (methodFunc) {
                        let result = methodFunc(params);
                        let resultObj;
                        try {
                            result = JSON.parse(result);
                            resultObj = {
                                result: result
                            };
                        } catch (error) {
                            resultObj = {
                                result: result
                            };
                        }
                        return resultObj;
                    } else {
                        return {errMsg: 'method is not exist!'};
                    }
                }
            } else if (isAndroid()) {
                responseJSONObj = win[HBAPPANDROIDBRIDGENAME].callRouterSync(JSON.stringify(req));
                response = JSON.parse(responseJSONObj);
                return response;
            }
        }
    };
    // 将mobile对象挂载到window全局
    if (!win.HBMBBridge) {
        win.HBMBBridge = mobile;
    }
})(window);
let winHbridge = window.HBMBBridge
export const windowHbridge = winHbridge
