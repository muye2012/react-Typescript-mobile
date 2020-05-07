/*
 * Created by chenLiang on 2020/3/10.
 */
import React, {Component} from 'react';
import './BallotList.scss'
import WaIcon from "../../../component/WaIcon";
import {deleteBreed} from "../../../assets/ts/api";
import {Toast, Modal} from 'antd-mobile'
import {asyncRunningList} from "../../../store/actions";
import { connect } from 'react-redux';
import { reducerType } from '../../../store';
import * as util from '../../../../../utils/utils'

const mapStateToProps = (state: reducerType) => ({ runningData: state.homeReducer.runningData });

const mapDispatchToProps = { asyncRunningList };

class BallotList extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: 1,
            openPassword: false
        }
    }
    public readonly state = {
        activeIndex: 1,
        openPassword: false
    };
    static defaultProps={
      list: []
    };

    componentDidMount() {
    }

    // 跳转条件单详情
    private goDetail = (warnId: number, strategyType: number) => {
        if (!warnId) return Toast.info('未创建条件单');
        let url = `qianqian://x-callback-url/conditional/detail?warnId=${warnId}&strategyType=${strategyType}`;
        if (window.HBMBBridge && util.isApp) {
            let params = {'url': url};
            let method = 'openNativeURL';
            window.HBMBBridge.callApp(method, params, function (err: any, result: any) {
                if (err) {
                    // error handle
                } else {
                    // success handle
                }
            });
        } else {
            window.location.href = 'https://m.touker.com/stock/download';
        }
    };
    public render() {
        const {list} = this.props;
        const controlDo = (index: number)=> {
            list[index].isOpen = !list[index].isOpen;
            this.setState({
                activeIndex: '1'
            })
        };
        const editTap = (item: object)=> {
            this.props.history.push('/edit_type/'+JSON.stringify(item));
        };
        const stopBreed = (id: number) => {
            let params = {
                arbitrageId: id,
                arbitrageState: 2
            };
            deleteBreed({handleBondData: params}).then(() => {
                Toast.info('暂停成功');
                const {asyncRunningList} = this.props;
                asyncRunningList({})
            })
        };
        const recoverBreed = (id: number)=> {
          let params = {
              arbitrageId: id,
              arbitrageState: 1
          }
            deleteBreed({handleBondData: params}).then(() => {
                Toast.info('恢复成功')
                const {asyncRunningList} = this.props;
                asyncRunningList({})
            })
        };
        const delBreed = (id: number) => {
            Modal.alert('是否确认删除卖出策略？', '', [
                {
                    text: '取消',
                    onPress: ()=> {}
                },
                {
                    text: '确认删除',
                    onPress: ()=> {
                        let params = {
                            arbitrageId: id,
                            arbitrageState: 3
                        };
                        deleteBreed({handleBondData: params}).then(()=> {
                            Toast.info('删除成功');
                            const {asyncRunningList} = this.props;
                            asyncRunningList({})
                        })
                    }
                }
            ]);
        };
        return (
            <div className="ballot-list">
                <div className="wa-row ballot-list-title">
                    <div className="wa-col-27 breed-code text-left">
                        品种代码
                    </div>
                    <div className="wa-col-33 text-right">
                        当前价/中签数量
                    </div>
                    <div className="wa-col text-right sell-tactics">
                        卖出策略
                    </div>
                </div>
                {
                    list.map((item: any, index: number)=> {
                        return <div className="wa-row ballot-list-item wa-wrap"
                             key={index + 'ballotList'}
                             onClick={()=>controlDo(index)}>
                            <div className="wa-col-27 breed-code text-left">
                                {item.purchaseName}<br/><span>{item.purchaseCode}.{item.exchange}</span>
                            </div>
                            <div className="wa-col-33 text-right">
                                {item.currentPrice}元<br/>{item.ballotAmount}{item.exchange === 'SH'?'手' : '张'}
                            </div>
                            <div
                                className={item.isOpen ? 'open-icon wa-col wa-ycenter wa-xend sell-price' : 'wa-col wa-ycenter wa-xend sell-price'}>
                                {
                                    item.ruleType === 1 ? (
                                            <span>股价≥{item.accessPrice}元后<br/>回落<b className='green-col'>{item.turnBack}%</b>卖出</span>) :
                                        item.ruleType === 2 ? ('股价≥' + item.accessPrice + '元后') :
                                            item.ruleType === 3 ? (<span className="text-center">时间达到<br/>{item.purchaseDate}<br/>卖出</span>) :
                                                '暂不卖出'
                                }
                            </div>
                            <div className={item.isOpen ? 'wa-row ballot-action' : 'wa-row ballot-action hidden'}>
                                <div className="wa-col-25 wa-center" onClick={(e)=> {e.stopPropagation(); return editTap(item)}}>
                                    <WaIcon img={require('../../../assets/images/home/edit.png')} size="13px"/> 改单
                                </div>
                                <div className={"wa-col-25 wa-center " + (item.arbitrageState === 2 ? 'hidden' : '')}
                                     onClick={(e) => {e.stopPropagation(); return stopBreed(item.arbitrageId)}}>
                                    <WaIcon img={require('../../../assets/images/home/pause.png')} size="13px"/> 暂停
                                </div>
                                <div className={"wa-col-25 wa-center " + (item.arbitrageState !== 2 ? 'hidden' : '')}
                                     onClick={(e) => {e.stopPropagation(); return recoverBreed(item.arbitrageId)}}>
                                    <WaIcon img={require('../../../assets/images/home/refresh.png')} size="13px"/> 恢复
                                </div>
                                <div className="wa-col-25 wa-center" onClick={(e) => {e.stopPropagation(); return delBreed(item.arbitrageId)}}>
                                    <WaIcon img={require('../../../assets/images/home/delete.png')} size="13px"/>
                                    删除
                                </div>
                                <div className="wa-col-25 wa-center" onClick={(e)=> { e.stopPropagation(); this.goDetail(item.warnId, item.strategyType)}}>
                                    <WaIcon img={require('../../../assets/images/home/detail.png')} size="13px"/>
                                    详情
                                </div>
                            </div>
                            <span className={item.arbitrageState !== 2 ?'hidden tag_stop' : 'tag_stop'}>已暂停</span>
                        </div>
                    })
                }
                {
                    !list || !list.length ? (<div className="wa-row ballot-list-empty">
                        <div className="wa-col-100 wa-center">
                            暂无已中签品种
                        </div>
                    </div>) : ''
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BallotList);