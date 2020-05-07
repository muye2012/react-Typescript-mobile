/*
 * Created by chenLiang on 2020/3/10.
 */
import React, {Component} from 'react';
import './Subscribe.scss'
import { connect } from 'react-redux';
import { reducerType } from '../../../store';
import {asyncSubscribed} from "../../../store/actions";
import RobotEmpty from "../../../component/RobotEmpty";
import LazyLoading from "../../../component/LazyLoading";

const mapStateToProps = (state: reducerType) => ({ subscribedList: state.homeReducer.subscribedList, subscribedPageOver: state.homeReducer.subscribedPageOver });
const mapDispatchToProps = { asyncSubscribed };
interface apiProps {
    subscribedList: object
}
class Subscribe extends Component<apiProps | any, any> {
    public readonly state = {
        isEmpty: false,
        pageSize: 10,
        pageNo: 1,
        isLoading: false
    };

    componentDidMount() {
        this.getData();
    }

    // 获取数据列表（分页处理）
    getData = () => {
        const {asyncSubscribed} = this.props;
        const {pageNo, pageSize} = this.state;
        this.setState({
            isLoading: true
        });
        asyncSubscribed({pageNo, pageSize}).then(()=> {
            this.setState({isLoading: false})
        }).catch(() => {
            this.setState({isLoading: false})
        });
        this.setState({pageNo: pageNo + 1});
    };
    goBank = ()=> {
        window.location.href = '/trade/capital/trade/transfer.htm';
    };

    public render() {
        const {subscribedList, subscribedPageOver} = this.props;
        const {isLoading} = this.state;
        const empty = !subscribedList.length ? (<div className="wa-row subscribe-page-empty" v-if="isEmpty">
                    <div className="wa-col-100 wa-center">
                        <RobotEmpty tips="暂无已申购品种"/>
                    </div>
                </div>) : '';
        return (
            <div className="subscribe-page">
                <LazyLoading updateData={this.getData} isLoading={isLoading} pageOver={subscribedPageOver}>
                {
                    subscribedList.map((item: any, index: number)=> {
                        return (<div className="wa-row subscribe-item" key={index + 'subscribe'}>
                            <div className="wa-col-20">
                                <div className="subscribe-btn">配售申购</div>
                            </div>
                            <div className="wa-col subscribe-item-content">
                                <p>股票名称:{item.purchaseName} {item.purchaseCode}
                                   <span className={"bank-transfer " + (!(item.purchaseStatus === 3 || item.purchaseStatus === 5 || item.purchaseStatus === 6)?'hidden':'')}
                                         onClick={this.goBank}>
                                       银证转账
                                   </span>
                                </p>
                                <p>起始配号:{item.beginNumber} 配号数量:{item.numberCount}</p>
                                <p>申购时间:{item.purchaseDate + ' ' + item.purchaseTime}</p>
                                {
                                    item.purchaseStatus === 2?(<p className="subscribe-item-status blue-col">已申购</p>):
                                        (item.purchaseStatus === -3 || item.purchaseStatus === 3 || item.purchaseStatus === 5 || item.purchaseStatus === 6)?(<p className="subscribe-item-status red-col">恭喜您！已中签
                                                <br/>请保证充足余额，将在收盘后自动为您缴费扣除</p>):
                                            item.purchaseStatus === -2 ? (<p className="subscribe-item-status blue-col">申购失败</p>):
                                                (<p className="subscribe-item-status blue-col">未中签</p>)
                                }
                            </div>
                        </div>)
                    })
                }
                    {empty}
                </LazyLoading>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscribe);