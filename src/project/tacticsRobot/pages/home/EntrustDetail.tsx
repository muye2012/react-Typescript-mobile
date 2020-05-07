/*
 * Created by chenLiang on 2020/4/14.
 */
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import './EntrustDetail.scss'
import { connect } from 'react-redux';
import { reducerType } from '../../store';
import {asyncEntrustDetail} from "../../store/actions";

const mapStateToProps = (state: reducerType) => ({ entrustDetail: state.homeReducer.entrustDetail });
const mapDispatchToProps = { asyncEntrustDetail };
interface apiProps {
    entrustDetail: any;
    asyncEntrustDetail: Function;
}

//RouteComponentProps:路由库自带的api的类型定义
class EntrustDetail extends Component<RouteComponentProps&apiProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {asyncEntrustDetail, match} = this.props;
        let params: any = match.params;
        asyncEntrustDetail({entrustId: params.id, code: params.code});
    }

    public render() {
        const {entrustDetail}=this.props;
        return (
            <div className="arbitrage strategy entrust_detail">
                <div className="arbitrage-content strategy-content">
                    <div className="item-list">
                        <div className="item strategy-item">
                            <div className="strategy-mid">
                                <div className="left">委托时间：</div>
                                <div className="right">
                                    {entrustDetail.createTime}
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">委托类型：</div>
                                <div className="right">
                                    条件交易
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">委托方向：</div>
                                <div className={"right "+(entrustDetail.tradeDirection === 1?'red-col':'blue-col')}>
                                    {entrustDetail.tradeDirection}
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">订单类型：</div>
                                <div className="right">
                                    {entrustDetail.orderTypeName}
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">证券代码：</div>
                                <div className="right">
                                    {entrustDetail.securityCode}.{entrustDetail.exchange}
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">证券名称：</div>
                                <div className="right">
                                    {entrustDetail.securityName}
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">委托价格：</div>
                                <div className="right">
                                    {entrustDetail.entrustPrice || '--'}元
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">委托数量：</div>
                                <div className="right">
                                    {entrustDetail.entrustNumber || '--'}{entrustDetail.exchange==='SH'?'手':'张'}
                                </div>
                            </div>
                            <div className="strategy-mid">
                                <div className="left">委托金额：</div>
                                <div className="right">
                                    {entrustDetail.totalPrice}元
                                </div>
                            </div>
{/*                            <div className="strategy-mid">
                                <div className="left">冻结资金：</div>
                                <div className="right">
                                    0.00元
                                </div>
                            </div>*/}
                            <div className="strategy-mid">
                                <div className="left">订单状态：</div>
                                <div className={"right " + (entrustDetail.isErr ? 'red-col':'blue-color')}>
                                    {entrustDetail.orderState}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntrustDetail);