export default class ApiHttp {
    addr: string;
    query: any;
    way: string;
    // get请求时拼接参数
    get(params: any) {
        let url = this.addr;
        if (params) {
            let paramsArray: any = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + ((typeof params[key] === "object") ? JSON.stringify(params[key]).replace(/"/g, '\'') : params[key])));
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return url;
    };
    post(params: any) {
        let url = '';
        if (params) {
            let paramsArray: any = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + ((typeof params[key] === "object") ? JSON.stringify(params[key]).replace(/"/g, '\'') : params[key])));
            if (url.search(/\?/) === -1) {
                url = paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        url = url.replace(/"/g, '');
        return url;
    };
    constructor(url: string, params: any, methods: string) {
        this.addr = url;
        this.query = params;
        this.way = methods;
    };
    request() {
        let url = this.addr;
        let obj: any = {
            method: this.way,
            mode: "cors",
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                // 'Content-Type': 'multipart/form-data;charset=UTF-8',
                'deviceCode': 'A95ZEF1-47B5-AC90BF3'
            })
        };
        if (this.way === 'get') {
            url = this.get(this.query);
        } else {
            // obj = {...obj, body: JSON.stringify(this.query)};
            obj = {...obj, body: this.post(this.query)}

        }
        return new Promise((resolve, reject) => {
            fetch(url, obj).then((response: any) => {
                return this.checkStatus(response);
            }).then((res) => {
                if (res.code === 1) {
                    return resolve(res)
                } else {
                    if (res.code === -101) {
                        let url = window.location.href;
                        if (process.env.NODE_ENV === 'development') {
                            window.location.href = `http://m.dev.hbec.com/account/login?referrer=http://${window.location.host}`;
                        } else {
                            window.location.href = `/account/login?referrer=${url.split('#')[0]}`;
                        }
                    }
                    return reject(res)
                }
            }).catch((err: any) => {
                return reject(err)
            })
        })
    };
    // 判断200等状态码并返回状态信息
    checkStatus(response: any) {
        // 如果http状态码正常，则直接返回数据
        if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
            return response.json();
        }
        // 状态码code异常状态下，把错误信息返回去
        return {
            code: -404,
            msg: '网络异常'
        }
    }

}