import {
    INCREMENT_COUNTER,
    DECREMENT_COUNTER,
    INCREMENT_ACTION_TYPE,
    DECREMENT_ACTION_TYPE,
    API_TEST1, PURCHASE_LIST, RUNNING_PURCHASE, SUBSCRIBED_LIST, ENTRUSTED_LIST, ENTRUST_DETAIL
} from './types';
import {Dispatch} from 'redux';
import {entrustDetail, entrustedList, purchaseList, runningPurchase, subscribedList, test1} from "../assets/ts/api";

const incrementCount = (number: number): INCREMENT_ACTION_TYPE => ({type: INCREMENT_COUNTER, number});
export const asyncIncrementCount = (number: number) => (dispatch: Dispatch<INCREMENT_ACTION_TYPE>) => {
    setTimeout(() => dispatch(incrementCount(number)), 1000);
};
export const decrementCount = (number: number): DECREMENT_ACTION_TYPE => ({type: DECREMENT_COUNTER, number});

// 接口测试
export const asyncApiTest1 = (params: any) => (dispatch: Dispatch<any>) => {
    return test1(params).then((res) => {
        dispatch(getApiTest1(res));
        return res;
    }).catch(err => {
        return err;
    })
};

const getApiTest1 = (res: any) => {
    return {type: API_TEST1, testData: res};
};

const env = process.env.NODE_ENV;

// 申购列表接口
export const asyncPurchase = (params: any) => {
    return (dispatch: Dispatch<any>) => {
        return purchaseList(params).then((res: any) => {
            dispatch(getPurchase(res.result));
            return res;
        }).catch(err => {
            if (env === 'development') {
                let list = [
                    {
                        stockId: '16146',
                        purchaseCode: '13131',
                        purchaseName: '可转债',
                        exchange: 'sh',
                        issuePrice: '15.5',
                        // 申购数量
                        maxPurchaseQuantity: '100',
                        purchaseDate: '2012-10-12',
                        grade: 1,
                        accessPrice: '33.36',
                        turnBack: '-23.33',
                        entrustTime: '10:30',
                        ruleType: 1,
                        allowPurchase: true,
                        subscribed: 0
                    },
                    {
                        stockId: '16146',
                        purchaseCode: '13131',
                        purchaseName: '可转债',
                        exchange: 'sh',
                        issuePrice: '15.5',
                        // 申购数量
                        maxPurchaseQuantity: '100',
                        purchaseDate: '2012-10-12',
                        grade: 1,
                        accessPrice: '33.36',
                        turnBack: '-23.33%',
                        entrustTime: '10:30',
                        ruleType: 2,
                        allowPurchase: true,
                        subscribed: 0
                    },
                    {
                        stockId: '16146',
                        purchaseCode: '13131',
                        purchaseName: '可转债',
                        exchange: 'sh',
                        issuePrice: '15.5',
                        // 申购数量
                        maxPurchaseQuantity: '100',
                        purchaseDate: '2012-10-12',
                        grade: 1,
                        accessPrice: '33.36',
                        turnBack: '-23.33',
                        entrustTime: '10:30',
                        ruleType: 3,
                        allowPurchase: true,
                        subscribed: 1
                    },
                    {
                        stockId: '16146',
                        purchaseCode: '13131',
                        purchaseName: '可转债',
                        exchange: 'sh',
                        issuePrice: '15.5',
                        // 申购数量
                        maxPurchaseQuantity: '100',
                        purchaseDate: '2012-10-12',
                        grade: 1,
                        accessPrice: '33.36',
                        turnBack: '56.56',
                        entrustTime: '10:30',
                        ruleType: 4,
                        allowPurchase: true,
                        subscribed: 0
                    }
                ];
                err.result = {
                    recommendSubscribeList: list,
                    notRecommendSubscribeList: list.map((item) => {
                        item.grade = 1;
                        return item;
                    }),
                    notGradSubscribeList: list.map((item) => {
                        item.grade = 0;
                        return item;
                    }),
                    purchaseTime: '2020-05-23'
                };
                dispatch(getPurchase(err.result));
            }
            return err;
        });
    };
};
const getPurchase = (data: any) => {
    return {type: PURCHASE_LIST, purchaseData: data};
};
// 运行中列表数据
export const asyncRunningList = (params: any) => {
    return (dispatch: Dispatch<any>) => {
        return runningPurchase(params).then((res: any) => {
            dispatch(getRunningList(res.result))
            return res;
        }).catch(err => {
            if (env === 'development') {
                let list = [
                    {
                        arbitrageId: '16465',
                        purchaseCode: '46946146',
                        purchaseName: '特斯拉转债',
                        // 发行价
                        issuePrice: 120,
                        // 申购数量
                        purchaseCount: 1000,
                        purchaseDate: '2020-10-23',
                        // 估价（ruleType=1或2时展示)
                        accessPrice: 100,
                        // 回落百分比，不包含百分号（ruleType=1时展示）
                        turnBack: -12,
                        // 1：回落，2：价格，3：时间，4：暂不卖出
                        ruleType: 1,
                        // 当前价
                        currentPrice: 230,
                        exchange: 'SH',
                        subscribed: 0
                    }, {
                        arbitrageId: '16465',
                        purchaseCode: '46946146',
                        purchaseName: '特斯拉转债',
                        // 发行价
                        issuePrice: 150,
                        // 申购数量
                        purchaseCount: 1500,
                        purchaseDate: '2020-02-23',
                        // 估价（ruleType=1或2时展示)
                        accessPrice: 100,
                        // 回落百分比，不包含百分号（ruleType=1时展示）
                        turnBack: -12,
                        // 1：回落，2：价格，3：时间，4：暂不卖出
                        ruleType: 2,
                        // 当前价
                        currentPrice: 230,
                        exchange: 'SH',
                        subscribed: 1
                    }, {
                        arbitrageId: '16465',
                        purchaseCode: '46946146',
                        purchaseName: '特斯拉转债',
                        // 发行价
                        issuePrice: 120,
                        // 申购数量
                        purchaseCount: 1000,
                        purchaseDate: '2020-10-23',
                        // 估价（ruleType=1或2时展示)
                        accessPrice: 100,
                        // 回落百分比，不包含百分号（ruleType=1时展示）
                        turnBack: -12,
                        // 1：回落，2：价格，3：时间，4：暂不卖出
                        ruleType: 3,
                        // 当前价
                        currentPrice: 230,
                        exchange: 'SH',
                        subscribed: 0
                    }, {
                        arbitrageId: '16465',
                        purchaseCode: '46946146',
                        purchaseName: '特斯拉转债',
                        // 发行价
                        issuePrice: 120,
                        // 申购数量
                        purchaseCount: 1000,
                        purchaseDate: '2020-10-23',
                        // 估价（ruleType=1或2时展示)
                        accessPrice: 100,
                        // 回落百分比，不包含百分号（ruleType=1时展示）
                        turnBack: -12,
                        // 1：回落，2：价格，3：时间，4：暂不卖出
                        ruleType: 4,
                        // 当前价
                        currentPrice: 230,
                        exchange: 'SH',
                        subscribed: 1
                    }
                ];
                dispatch(getRunningList({
                    purchaseTime: '2018-12-23',
                    reservationList: list,
                    signedOnSellList: list,
                }));
            }
            return err;
        })
    }
};
const getRunningList = (data: any) => {
    return {type: RUNNING_PURCHASE, runningData: data}
};
// 已申购数据
export const asyncSubscribed = (params: any) => {
    return (dispatch: Dispatch<any>) => {
        return subscribedList(params).then((res: any) => {
            dispatch(getSubscribed(res.result, params.pageNo))
            return res
        }).catch((err)=> {
            return err;
        })
    }
};
const getSubscribed = (data: any, pageNo: Number) => {
    return {type: SUBSCRIBED_LIST, data, pageNo}
}

// 已委托列表数据
export const asyncEntrusted = (params: any) => {
    return (dispatch: Dispatch<any>) => {
        return entrustedList(params).then((res: any) => {
            dispatch(getEntrusted(res.result, params.cursor))
        }).catch((err) => {
            if (env === 'development') {
                err = {
                    "result": {
                        "cursor": 468625,
                        "content": [
                            {
                                "entrustId": 468842,
                                "orderId": 64071,
                                "entrustCommand": {
                                    "trackType": 3,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0510273967",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 3, "code": "159903", "name": "深成ETF", "exchange": "SZ"},
                                    "entrustPrice": 1.1010,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:02:00:00:00:00:00;IMEI:;IMSI:;UUID:",
                                    "entrustBatchNo": 2099482167,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 3,
                                "entrustResult": {"errorCode": 0, "errorMessage": "委托价格超出价格涨跌控制范围[1.102-1.346]"},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-31 10:01:27",
                                "triggerTime": "2020-03-31 10:01:27"
                            },
                            {
                                "entrustId": 468661,
                                "orderId": 64002,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2097245559,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 3,
                                "entrustResult": {"errorCode": 0, "errorMessage": "现在已闭市,系统禁止委托"},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-18 16:47:05",
                                "triggerTime": "2020-03-18 16:47:05"
                            }, {
                                "entrustId": 468643,
                                "orderId": 63995,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096991619,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:6", "entrustCode": 6},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-18 09:57:42",
                                "triggerTime": "2020-03-18 09:57:42"
                            }, {
                                "entrustId": 468631,
                                "orderId": 63992,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096906503,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:398", "entrustCode": 398},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:37:29",
                                "triggerTime": "2020-03-17 13:37:29"
                            }, {
                                "entrustId": 468630,
                                "orderId": 63992,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096906431,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:397", "entrustCode": 397},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:36:17",
                                "triggerTime": "2020-03-17 13:36:17"
                            }, {
                                "entrustId": 468629,
                                "orderId": 63992,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096906386,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:396", "entrustCode": 396},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:35:34",
                                "triggerTime": "2020-03-17 13:35:34"
                            }, {
                                "entrustId": 468628,
                                "orderId": 63991,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096873489,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:395", "entrustCode": 395},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:33:26",
                                "triggerTime": "2020-03-17 13:33:26"
                            }, {
                                "entrustId": 468627,
                                "orderId": 63990,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096840046,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:394", "entrustCode": 394},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:22:08",
                                "triggerTime": "2020-03-17 13:22:08"
                            }, {
                                "entrustId": 468626,
                                "orderId": 63990,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096839968,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:393", "entrustCode": 393},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:20:50",
                                "triggerTime": "2020-03-17 13:20:50"
                            }, {
                                "entrustId": 468625,
                                "orderId": 63989,
                                "entrustCommand": {
                                    "trackType": 4,
                                    "tradeDirection": 1,
                                    "stockHolderNo": "0182404331",
                                    "exchangeType": 1,
                                    "securityInfo": {"type": 4, "code": "002273", "name": "水晶光电", "exchange": "SZ"},
                                    "entrustPrice": 14.0000,
                                    "entrustNumber": 100,
                                    "orderType": 0,
                                    "nodeInfo": "FID:TJD;MIP:;MPN:18888800000;MAC:;IMEI:;IMSI:;UUID:DBFB036D-F0B7-4505-80F1-83351A67903B",
                                    "entrustBatchNo": 2096806885,
                                    "orderTypeDesc": "限价"
                                },
                                "entrustState": 2,
                                "entrustResult": {"errorCode": 1, "errorMessage": "委托成功,您这笔委托的合同号是:392", "entrustCode": 392},
                                "declareResult": {"beingRevoked": false, "canBeRevoked": false, "declareDescription": ""},
                                "strategyInfo": {"strategyType": 1, "strategyName": "价格条件"},
                                "createTime": "2020-03-17 13:15:35",
                                "triggerTime": "2020-03-17 13:15:35"
                            }]
                    }, "code": 1, "success": true
                }
                dispatch(getEntrusted(err.data, 1))
            }
            return err;
        })
    }
};
const getEntrusted = (data: any, cursor: number) => {
    return {type: ENTRUSTED_LIST, data, cursor}
}// 委托明细
export const asyncEntrustDetail = (params: any) => {
    return (dispatch: Dispatch<any>) => {
        return entrustDetail(params).then((res: any) => {
            dispatch(getEntrustDetail(res.result))
        }).catch((err) => {
            return err;
        })
    }
};
const getEntrustDetail = (data: any) => {
    return {type: ENTRUST_DETAIL, data}
}


// export const selectPurchase = (breedType: number, index: number) => ({type: SELECT_PURCHASE, breedType, index});