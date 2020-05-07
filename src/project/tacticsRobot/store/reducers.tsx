import {
    ACTION_TYPE,
    INCREMENT_COUNTER,
    DECREMENT_COUNTER,
    API_TEST1,
    PURCHASE_LIST,
    SELECT_PURCHASE,
    RUNNING_PURCHASE, SUBSCRIBED_LIST, ENTRUSTED_LIST, ENTRUST_DETAIL
} from "./types";
import React from 'react';
import * as util from '../../../utils/utils'

interface CountState {
    count: number,
    testData: any,
    purchaseData: object,
    runningData: object,
    subscribedList: [object],
    subscribedPageOver: boolean,
    entrustedData: object,
    entrustDetail: any
}

export const initialState: CountState = {
    count: 0,
    testData: {},
    purchaseData: {
        recommendSubscribeList: [],
        notRecommendSubscribeList: [],
        notGradSubscribeList: []
    },
    // 运行中的数据
    runningData: {
        reservationList: [],
        signedOnSellList: [],
        // 申购日期
        purchaseTime: ''
    },
    // 已申购列表
    subscribedList: [{}],
    subscribedPageOver: false,
    // 已委托列表数据
    entrustedData: {
        list: [],
        pageOver: false,
        cursor: -1
    },
    // 委托明细
    entrustDetail: {}
};

export function countReducer(state = initialState, action: ACTION_TYPE): CountState {
    switch (action.type) {
        case INCREMENT_COUNTER:
            return {...state, count: state.count + action.number};
        case DECREMENT_COUNTER:
            return {...state, count: state.count - action.number};
        default:
            return state;
    }
}

// 接口测试
export function apiTest1Reducer(state = initialState, action: any) {
    switch (action.type) {
        case API_TEST1:
            return {...state, testData: action.testData};
        default:
            return state;
    }
}

// 待申购接口
export function purchaseReducer(state = initialState, action: any) {
    // 处理列表数据
    function dealList(data: any) {
        let render = [];
        let list = [];
        let isNoSelect = false;
        for (let i = 0; i < data.length; i++) {
            let obj = {
                stockId: data[i].stockId || '',
                purchaseCode: data[i].purchaseCode || '',
                purchaseName: data[i].purchaseName || '',
                exchange: data[i].exchange || '',
                issuePrice: data[i].issuePrice || '',
                // 申购数量
                maxPurchaseQuantity: data[i].maxPurchaseQuantity || '',
                purchaseDate: data[i].purchaseDate || '',
                grade: data[i].grade || 0,
                accessPrice: data[i].accessPrice || '',
                turnBack: data[i].turnBack || '',
                entrustTime: data[i].entrustTime || '',
                ruleType: data[i].ruleType || 4,
                allowPurchase: data[i].allowPurchase || '',
                // 0 未预约 1 已预约
                subscribed: data[i].subscribed || 0,
                selected: data[i].subscribed === 1
            };
            if (!obj.subscribed) isNoSelect = true;
            list.push(obj);
            let item = (<div className="wa-row wa-wrap product-item" key={obj.stockId + i}>
                <div className="wa-col-33 product-item-code">
                    {obj.purchaseName}<br/>
                    {obj.purchaseCode + '.' + obj.exchange}
                </div>
                <div className="wa-col-33 text-right price-num">
                    {obj.issuePrice}元<br/>
                    {obj.maxPurchaseQuantity}张
                </div>
                <div className="wa-col wa-center">
                    {obj.purchaseDate}
                </div>
                <div className="wa-col-100 price-val">
                    <span className="arrow-right">卖出策略：{
                        obj.ruleType === 1 ? (<span>估价≥{obj.accessPrice}元后卖出, 回落<b>{obj.turnBack}</b></span>) :
                            obj.ruleType === 2 ? (<span>估价≥{obj.accessPrice}元后卖出</span>) :
                                obj.ruleType === 3 ? (<span>{obj.entrustTime}卖出</span>) :
                                    (<span>暂不卖出</span>)
                    }</span>
                </div>
            </div>);
            render.push(item);
        }
        return {render, list, isNoSelect};
    }

    switch (action.type) {
        case PURCHASE_LIST:
            // 解析接口返回的数据
            let data = action.purchaseData || {};
            let breed1 = dealList(data.recommendSubscribeList || []);
            // 建议申购列表
            let recommendSubscribeList = breed1.list;
            let subscribableRender = breed1.render;
            let recommendNoSelect = breed1.isNoSelect;
            let breed2 = dealList(data.notRecommendSubscribeList || []);
            // 不建议申购列表
            let notRecommendSubscribeList = breed2.list;
            let subscribedRender = breed2.render;
            let notRecommendNoSelect = breed2.isNoSelect;
            // 未评级列表
            let breed3 = dealList(data.notGradSubscribeList || []);
            let notGradSubscribeList = breed3.list;
            let notGradSubscribeNoSelect = breed3.isNoSelect;
            let purchaseData = {
                recommendSubscribeList,
                subscribableRender,
                recommendNoSelect,
                notRecommendSubscribeList,
                notGradSubscribeList,
                notGradSubscribeNoSelect,
                subscribedRender,
                notRecommendNoSelect,
                purchaseTime: data.purchaseTime || '09:30'
            };
            return {...state, purchaseData};
        case SELECT_PURCHASE:
            let breedData: any = state.purchaseData || {};
            let list = [];
            let render = []
            if (action.breedType === 1) {
                list = breedData.recommendSubscribeList;
                render = breedData.subscribableRender;
            } else if (action.breedType === 2) {
                list = breedData.notRecommendSubscribeList
            }
            list[action.index].selected = !list[action.index].selected;
            let obj = list[action.index];
            render[action.index] = (<div className="wa-row wa-wrap product-item" key={obj.stockId + action.index}>
                <div className={"wa-col-33 product-item-code" + (!obj.selected ? ' no-select' : '')}>
                    {obj.purchaseName}<br/>
                    {obj.purchaseCode + '.' + obj.exchange}
                </div>
                <div className="wa-col-33 text-right price-num">
                    {obj.issuePrice}元<br/>
                    {obj.maxPurchaseQuantity}张
                </div>
                <div className="wa-col wa-center">
                    {obj.purchaseDate}
                </div>
                <div className="wa-col-100 price-val">
                    <span className="arrow-right">卖出策略：{
                        obj.ruleType === 1 ? (<span>估价≥{obj.accessPrice}元后卖出, 回落<b>{obj.turnBack}</b></span>) :
                            obj.ruleType === 2 ? (<span>估价≥{obj.accessPrice}元后卖出</span>) :
                                obj.ruleType === 3 ? (<span>{obj.entrustTime}卖出</span>) :
                                    (<span>暂不卖出</span>)
                    }</span>
                </div>
            </div>);
            return {...state, purchaseData: breedData};
        default:
            return state
    }
}

export function homeReducer(state = initialState, action: any) {
    function dealRunning(list: any) {
        let arr = [];
        for (let i = 0; i < list.length; i++) {
            let obj = {
                arbitrageId: list[i].arbitrageId || '',
                purchaseCode: list[i].purchaseCode || '',
                purchaseName: list[i].purchaseName || '',
                // 发行价
                issuePrice: list[i].issuePrice || '',
                // 申购数量
                purchaseCount: list[i].purchaseCount || '',
                purchaseDate: list[i].purchaseDate || '',
                // 估价（ruleType=1或2时展示)
                accessPrice: list[i].accessPrice || '',
                // 回落百分比，不包含百分号（ruleType=1时展示）
                turnBack: list[i].turnBack || '',
                // 1：回落，2：价格，3：时间，4：暂不卖出
                ruleType: list[i].ruleType || '',
                // 当前价
                currentPrice: list[i].currentPrice || '',
                // 交易所
                exchange: list[i].exchange || '',
                strategyId: list[i].strategyId || '',
                arbitrageState: list[i].arbitrageState || 1,
                warnId: list[i].warnId || '',
                strategyType: list[i].strategyType || '',
                // 中签数量
                ballotAmount: list[i].ballotAmount || '',
                stockId: list[i].stockId || ''
            }
            arr.push(obj);
        }
        return arr;
    }

    switch (action.type) {
        case RUNNING_PURCHASE:
            let data = action.runningData || {};
            // 已预约列表
            let reservationList = dealRunning(data.reservationList || []);
            // 已中签约待卖出
            let signedOnSellList = dealRunning(data.signedOnSellList || []);
            return {
                ...state,
                runningData: {
                    reservationList,
                    signedOnSellList,
                    // 申购日期
                    purchaseTime: data.purchaseTime || ''
                }
            };
        // 已申购列表
        case SUBSCRIBED_LIST:
            let list = action.data || [];
            let subscribedList:any = [];
            if (action.pageNo !== 1) subscribedList = state.subscribedList;
            for (let i = 0; i < list.length; i++) {
                let obj: any = {};
                obj.purchaseName = list[i].purchaseName || '--';
                obj.purchaseDate = list[i].purchaseDate ? util.formatTime(Number(new Date(list[i].purchaseDate))) : '--';
                obj.purchaseCode = list[i].purchaseCode || '--';
                obj.purchaseTime = list[i].purchaseTime || '--';
                // 起始配号
                obj.beginNumber = list[i].beginNumber || '--';
                // 配号数量
                obj.numberCount = list[i].ballotAmount || '--';
                // 申购状态，2：已申购 ，-3, 3, 5, 6：已中签，4：未中签 -2 未申购
                obj.purchaseStatus = list[i].purchaseStatus || 4;
                subscribedList.push(obj);
            }
            return {
                ...state,
                subscribedList,
                subscribedPageOver: !list.length,
            };
        // 已委托列表数据
        case ENTRUSTED_LIST:
            let enData = action.data || {};
            let arr = enData.content || [];
            let entrustedData: any = state.entrustedData;
            let entrustedList: any = [];
            if (action.cursor !== -1) entrustedList = entrustedData.list;
            for(let i = 0; i < arr.length; i++){
                let obj: any = {};
                let entrustCommand = arr[i].entrustCommand || {};
                let securityInfo = entrustCommand.securityInfo || {};
                let entrustResult = arr[i].entrustResult || {};
                let declareResult = arr[i].declareResult || {};
                let strategyInfo = arr[i].strategyInfo || {};
                obj.name = securityInfo.name || '';
                obj.code = securityInfo.code || '';
                // 委托类别，1：买入、2：卖出
                obj.direction = arr[i].direction || 1;
                // 委托价格
                obj.entrustPrice = entrustCommand.entrustPrice || '--';
                // 委托数量
                obj.entrustAmount = entrustCommand.entrustNumber || '--';
                // 状态  1 买入 2 卖出
                obj.tradeDirection = entrustCommand.tradeDirection || 1;
                // 委托时间
                obj.entrustDate = arr[i].triggerTime || '--';
                obj.exchange = securityInfo.exchange || '--';
                // 触发时间
                obj.createTime = arr[i].createTime || '--';
                // 委托成功与否
                obj.isSuccess = entrustResult.errorCode === 1;
                // 委托结果说明
                if (obj.isSuccess) {
                    obj.entrustResultMsg = declareResult.declareDescription || '';
                } else {
                    obj.entrustResultMsg = entrustResult.errorMessage || '';
                }
                // 价格条件 回落卖出等状态名
                obj.strategyName = strategyInfo.strategyName || '--';
                // 基金名称
                obj.fundName = securityInfo.name || '--';
                // 基金代码
                obj.fundCode = securityInfo.code || '--';
                // 委托id
                obj.entrustId = arr[i].entrustId || '';
                entrustedList.push(obj)
            }
            return {
                ...state,
                entrustedData: {
                    list: entrustedList,
                    pageOver: !arr.length,
                    cursor: enData.cursor
                }
            };
        // 委托明细
        case ENTRUST_DETAIL:
            let detail = action.data || {};
            let info:any = {};
/*            let stateList = {
                0: '未申报',
                1: '正在申报',
                2: '已申报未成交',
                3: '非法委托',
                4: '申请资金授权中',
                5: '部分成交',
                6: '全部成交',
                7: '部成部撤',
                8: '全部撤单',
                9: '撤单未成',
                10: '等待人工申报'
            }; */
            info.stockHolderNo = detail.stockHolderNo || '';
            // 股票代码
            info.securityCode = detail.code || '--';
            // 股票名称
            info.securityName = detail.name || '--';
            // 交易所
            info.exchange = detail.exchange || '';
            // 委托价格
            info.entrustPrice = detail.entrustPrice || '';
            // 委托股数
            info.entrustNumber = detail.entrustNumber || '';
            // 订单类型，0：限价单，1-2、101-105市价单
            info.orderType = detail.orderType || 0;
            info.orderTypeName = info.orderType === 0 ? '限价单' : '市价单';
            // 委托状态
            info.entrustState = detail.entrustState || 0;
            // 委托时间
            // info.createTime = detail.createTime ? util.formatTime(Number(new Date(detail.createTime)), 'Y-M-D', true) : '--';
            info.createTime = detail.triggerTime || '--';
            // 交易方向
            info.tradeDirection = detail.tradeDirection === 1 ? '买入' : '卖出';
            info.tradeDirectionVal = detail.tradeDirection || 1;
            // 委托金额
            // info.totalPrice = (Number(info.entrustPrice) * Number(info.entrustNumber)).toFixed(2) || '--';
            info.totalPrice = detail.entrustMoney || '--';
            if (detail.errorCode === 0) {
                info.orderState = detail.errorMessage || '--';
            } else {
                // info.orderState = stateList[detail.entrustState || 0] || '已成交';
                info.orderState = '已成交';
            }
            info.isErr = detail.errorCode === 0;
            return{
                ...state,
                entrustDetail: info
            }
        default:
            return state;
    }
}