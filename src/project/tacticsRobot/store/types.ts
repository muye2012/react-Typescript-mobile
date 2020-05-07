export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export type INCREMENT_COUNTER = typeof INCREMENT_COUNTER;

export const DECREMENT_COUNTER = "DECREMENT_COUNTER";
export type DECREMENT_COUNTER = typeof DECREMENT_COUNTER;

// action类型
export interface INCREMENT_ACTION_TYPE{
    type:INCREMENT_COUNTER;
    number:number;
}
export interface DECREMENT_ACTION_TYPE{
    type:DECREMENT_COUNTER;
    number: number;
}


// 接口请求测试
export const API_TEST1 = "API_TEST1";


// 待申购品种列表接口
export const PURCHASE_LIST = "PURCHASE_LIST";
export type PURCHASE_LIST = typeof PURCHASE_LIST;

export interface PURCHASE_LIST_TYPE {
    type: PURCHASE_LIST,
    purchaseData: any;
}

// 选择品种
export const SELECT_PURCHASE = "SELECT_PURCHASE";
// 运行中列表数据
export const RUNNING_PURCHASE = "RUNNING_PURCHASE";
// 已申购列表数据
export const SUBSCRIBED_LIST = 'SUBSCRIBED_LIST';
// 已委托列表数据
export const ENTRUSTED_LIST = 'ENTRUSTED_LIST';
// 委托详情
export const ENTRUST_DETAIL = 'ENTRUST_DETAIL';

export type ACTION_TYPE = INCREMENT_ACTION_TYPE | DECREMENT_ACTION_TYPE | PURCHASE_LIST_TYPE;