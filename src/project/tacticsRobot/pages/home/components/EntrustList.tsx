/*
 * Created by chenLiang on 2020/3/10.
 */
import React, {Component} from 'react';
import './EntrustList.scss'
import WaIcon from "../../../component/WaIcon";
import RobotEmpty from "../../../component/RobotEmpty";
import {connect} from 'react-redux';
import {reducerType} from '../../../store';
import {asyncEntrusted} from "../../../store/actions";
import LazyLoading from "../../../component/LazyLoading";
import * as util from '../../../../../utils/utils'

const mapStateToProps = (state: reducerType) => ({entrustedData: state.homeReducer.entrustedData});
const mapDispatchToProps = {asyncEntrusted};

interface apiProps {
    entrustedData: object
}

class EntrustList extends Component<apiProps | any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: false,
            isEmpty: false,
            pageSize: 10,
            isLoading: false
        };
    };

    public readonly state = {
        activeIndex: false,
        isEmpty: false,
        pageSize: 10,
        isLoading: false
    };

    componentDidMount() {
        this.getData(-1);
    }

    private getData = (pageNo?: number) => {
        this.setState({isLoading: true})
        const {asyncEntrusted, entrustedData} = this.props;
        const {cursor} = entrustedData;
        const {pageSize} = this.state;
        asyncEntrusted({cursor: pageNo ? pageNo : cursor, pageSize, source: 102}).then(() => {
            this.setState({isLoading: false})
        }).catch(() => {
            this.setState({isLoading: false})
        })
    };
    // 跳转行情
    private goPrice = (fundName: string, fundCode: string, market: string) => {
        var url = "qianqian://x-callback-url/stock/stockQuoteInfo?stockName=" + encodeURIComponent(fundName) + "&stockCode=" + fundCode + "&exchange=" + market + "&securityType=4";
        if (window.HBMBBridge && util.isApp) {
            var params = {'url': url};
            var method = 'openNativeURL';
            window.HBMBBridge.callApp(method, params, function (err: any, result: any) {
                if (err) {
                    // error handle
                } else {
                    // success handle
                }
            });
        }
    };
    // 跳转条件单详情
    private goDetail = (warnId: number, strategyType: number) => {
        let url = `qianqian://x-callback-url/conditional/detail?warnId=${warnId}&strategyType=${strategyType}`;
        if (window.HBMBBridge && util.isApp) {
            let params = {'url': url};
            let method = 'openNativeURL';
            window.HBMBBridge.callApp(method, params, function (err: any, result: any) {
                if (err) {
                    // error handle
                } else {
                    console.log(result);
                    // success handle
                }
            });
        }
    }

    // 跳转委托明细
    goEnDetail(id: number, code: number) {
        const {history} = this.props;
        history.push('/entrust_detail/'+id+'/'+code);
    }

    public render() {
        const {entrustedData} = this.props;
        const {isLoading} = this.state;
        let {list, pageOver} = entrustedData;
        const openItem = (index: number) => {
            list[index].isOpen = !list[index].isOpen;
            this.setState({
                activeIndex: '1'
            })
        };
        return (
            <div className="entrust-list">
                <LazyLoading updateData={this.getData} isLoading={isLoading} pageOver={pageOver}>
                    {
                        list ? list.map((item: any, index: number) => (
                            <div onClick={() => openItem(index)}
                                 key={index + 'entrustedList'}
                                 className={item.isOpen ? 'up-arrow wa-row entrust-item wa-wrap' : 'bottom-arrow wa-row entrust-item wa-wrap'}>
                                <div className="wa-col-100 wa-ycenter entrust-item-top">
                                    <div className="entrust-name">{item.name}</div>
                                    <div className="entrust-code">{item.code}.{item.exchange}</div>
                                    <span className="entrust-state">{item.strategyName}</span>
                                </div>
                                <div className="wa-col-20">
                                    <div className={"entrust-btn " + (item.tradeDirection === 1 ? 'red-bg' : '')}>
                                        {item.tradeDirection === 1 ? '买入' : '卖出'}
                                    </div>
                                </div>
                                <div className="wa-col entrust-item-content">
                                    <p>委托价格:{item.entrustPrice}元 委托数量:{item.entrustAmount}{item.exchange === 'SH' ? '手':'张'}</p>
                                    <p>触发时间：{item.createTime}</p>
                                    <p className={"entrust-item-status " + (item.isSuccess ? 'blue-col' : 'red-col')}>{item.entrustResultMsg}</p>
                                </div>
                                <div className={"wa-row entrust-action " + (item.isOpen ? '' : 'hidden')}>
                                    <div className="wa-col-33 wa-center" onClick={(e) => {
                                        e.stopPropagation();
                                        this.goEnDetail(item.entrustId, item.code)
                                    }}>
                                        <WaIcon img={require('../../../assets/images/home/detail.png')}
                                                size='15%'
                                                mr='4px'/>
                                        委托明细
                                    </div>
                                    <div className="wa-col-33 wa-center" onClick={(e) => {
                                        e.stopPropagation();
                                        this.goDetail(item.warnId, item.code)
                                    }}>
                                        <WaIcon img={require('../../../assets/images/home/entrust_icon.png')}
                                                size='15%'
                                                mr='4px'/>
                                        条件单详情
                                    </div>
                                    <div className="wa-col-33 wa-center" onClick={(e) => {
                                        e.stopPropagation();
                                        this.goPrice(item.fundName, item.fundCode, item.exchange)
                                    }}>
                                        <WaIcon img={require('../../../assets/images/home/price_icon.png')}
                                                size='15%'
                                                mr='4px'/>
                                        行情
                                    </div>
                                </div>
                            </div>)) : ''
                    }
                    {
                        (!list || !list.length) ? (
                            <div className="wa-row entrust-list-empty">
                                <div className="wa-col-100 wa-center">
                                    <RobotEmpty tips="暂无已委托品种"/>
                                </div>
                            </div>) : ''
                    }
                </LazyLoading>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntrustList);