import {Toast} from 'antd-mobile';
import ApiHttp from './http'
import * as util from '../../../../utils/utils'

const env = process.env.NODE_ENV;
let baseUrl = '/api/';
if (env === 'production') baseUrl = '/robot/';
export const getAPI = (params: any, url: string, showErr = true, showLoading = false, method = 'get') => {
    if (showLoading) {
        Toast.loading('加载中...', 0);
    }
    params.source = util.GetQuery('source') || localStorage.getItem('source') || 103;
    const appSet = new ApiHttp(baseUrl + url, params, method);
    return new Promise((resolve, reject) => {
        appSet.request().then((res) => {
            if(showLoading) Toast.hide();
            resolve(res);
        }).catch((err) => {
            if(showLoading) Toast.hide();
            if(showErr) Toast.info(err.msg || err.result || '服务器出错');
            reject(err);
        })
    })
};

/******************http://10.0.30.2:9090/blog/post/product_java@touker.com/409d4709e893**********/

// 测试
export const test1 = (params: object) => getAPI(params, 'robot/product/realProductList.do', true, true);
// 待申购接口
export const purchaseList = (params: object) => getAPI(params, 'bond/getPurchaseList.do');
// 提交搭建
export const savePurchaseBondOrder = (params: object) => getAPI(params, 'bond/savePurchaseBondOrder.do', false, false, 'post');
// 运行中品种
export const runningPurchase = (params: object) => getAPI(params, 'bond/getBondArbitrageIngList.do');
// 改单
export const editBreed = (params: object) => getAPI(params, 'bond/updateBondArbitrage.do', false);
// 暂停&删除&恢复明细
export const deleteBreed = (params: object) => getAPI(params, 'bond/handleBondArbitrage.do');
// 已申购列表
export const subscribedList = (params: object) => getAPI(params, 'bond/getPurchasedHistories.do');
// 已委托列表
export const entrustedList = (params: object) => getAPI(params, 'bond/queryEntrustedResult.do');
// 查询累计收益、收益率相关信息
export const queryNewBondEarning = (params: object) => getAPI(params, 'bondRobot/index/queryNewBondEarning.do');
// 委托明细
export const entrustDetail = (params: object) => getAPI(params, 'bond/queryConditionEntrustDetail.do');
