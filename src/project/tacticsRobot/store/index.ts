import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { countReducer, apiTest1Reducer, purchaseReducer, homeReducer } from "./reducers";
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2 // 查看 'Merge Process' 部分的具体情况
};
const reducers: any = combineReducers({
    countReducer,
    apiTest1Reducer,
    purchaseReducer,
    homeReducer
});
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(persistedReducer, applyMiddleware(thunk));     // 传递给createStore函数 这个export
export const persistor = persistStore(store);  // 包装store 这个也export
//引入组合后的
export type reducerType = ReturnType<typeof reducers>;
// 第一个参数就是组合后的reducers 第二个参数就是默认值 第三个就是异步的thunk那些
// export default createStore(reducers, {
//     countReducer: initialState
// }, applyMiddleware(thunk));