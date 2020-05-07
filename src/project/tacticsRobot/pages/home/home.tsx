// Created by chenLiang on 2020-3-9.
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import RunningRobot from './components/RunningRobot'
import './home.scss'
import Subscribe from "./components/Subscribe";
import EntrustList from "./components/EntrustList";
import {Icon} from 'antd-mobile';
import { connect } from 'react-redux';
import { reducerType } from '../../store';
import {asyncApiTest1, asyncRunningList} from "../../store/actions";
import {queryNewBondEarning} from "../../assets/ts/api";
import * as util from "../../../../utils/utils";

const mapStateToProps = (state: reducerType) => ({ testData: state.apiTest1Reducer.testData });
const mapDispatchToProps = { asyncApiTest1, asyncRunningList };
interface apiProps {
    testData: any;
    asyncApiTest1: Function;
}

//RouteComponentProps:路由库自带的api的类型定义
class Home extends Component<RouteComponentProps & apiProps | any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            tabList: [
                {
                    name: '运行中',
                    index: 1
                },
                {
                    name: '已申购',
                    index: 2,
                    // 是否显示消息小红点
                    isMsg: false
                },
                {
                    name: '已委托',
                    index: 3
                },
                {
                    name: '持仓',
                    index: 4
                }
            ],
            activeIndex: 1,
            showPassword: false,
            baseInfo: {},
            source: 103
        };
    }

    componentDidMount() {
        let source = util.GetQuery('source') || '';
        if (source) {
            localStorage.setItem('source', source);
        }
        source = localStorage.getItem('source') || 103;
        source = Number(source);
        this.setState({
            source
        });
        queryNewBondEarning({}).then((res: any)=> {
            if(res.code === 1) {
                let baseInfo = res.result || {};
                baseInfo.customerIdHide = baseInfo.customerId ? baseInfo.customerId.substring(0, 4) + '****' + baseInfo.customerId.substring(8, baseInfo.customerId.length) : '';
                this.setState({
                    baseInfo: res.result || {}
                })
            }
        })
    }

    // 切换tab
    private changeTab = (item: any) => () => {
        if (item.index === 4) {
            // this.setState({showPassword: true});
            util.openUrl('qianqian://x-callback-url/trading/general?tradeType=3');
        } else {
            this.setState({activeIndex: item.index});
            item.isMsg = false;
        }
    };
    private goPage = (name: string, params: any = '') => {
        let route = params ? `/${name}/${params}`:`/${name}`;
        this.props.history.push(route);
    };
    openAccount = () => {
      util.nativeMethod('callSwitchAccountFunction', ()=> {
          setTimeout(()=> {
              const {asyncRunningList} = this.props;
              asyncRunningList({});
              // 获取累计收益、收益率
              queryNewBondEarning({}).then((res: any)=> {
                  if(res.code === 1) {
                      let baseInfo = res.result || {};
                      baseInfo.customerIdHide = baseInfo.customerId ? baseInfo.customerId.substring(0, 4) + '****' + baseInfo.customerId.substring(8, baseInfo.customerId.length) : '';
                      this.setState({
                          baseInfo: res.result || {}
                      })
                  }
              })
          }, 1000)
      })
    };

    public render() {
        const {tabList, activeIndex, baseInfo, source} = this.state;
        const listItem = tabList.map((item: any, index: number) => (
            <div className="wa-col-25 wa-center"
                     key={index}
                     onClick={this.changeTab(item)}>
                <div className={activeIndex === item.index ? 'tab-item active-tab' : 'tab-item'}>
                        {item.name}
                        <b className={item.isMsg ? 'msg-icon' : ''}/>
                </div>
            </div>
        ));
        const tabItem = activeIndex === 1 ? (<RunningRobot history={this.props.history}/>) : activeIndex === 2 ? (<Subscribe/>) : (<EntrustList history={this.props.history}/>);
        return (
            <div className="home-page" id="homePage">
                <div className="home-page-account" onClick={this.openAccount}>客户号：{baseInfo.customerIdHide || ''}</div>
                <div className="home-page-account">
                </div>
                <div className={"wa-row home-page-title " + (source === 103 ? 'DD-title':'')}>
                    <div className="wa-col-100">
                        智能打债&智能卖出
                    </div>
                </div>
                <div className="wa-row home-page-total">
                    <div className="wa-col-50 text-center">
                        <div className="total-title">
                            累计收益
                        </div>
                        <div className={"total-val " + (baseInfo.earning > 0 ? 'red-col': baseInfo.earning < 0 ? 'green-col':'')}>
                            {baseInfo.earning || '0.00'}
                        </div>
                    </div>
                    <div className="wa-col-50 text-center">
                        <div className="total-title">
                            累计收益率
                        </div>
                        <div className={"total-val " + (baseInfo.earningRate > 0 ? 'red-col': baseInfo.earningRate < 0 ? 'green-col':'')}>
                            {baseInfo.earningRate || '0.00'}%
                        </div>
                    </div>
                </div>
                <div className="wa-row home-page-tab">
                    {listItem}
                </div>
                <div className="wa-row">
                    <div className="wa-col-100">
                    </div>
                </div>
                {tabItem}
                <div className="wa-row logo-img">
                    <div className="wa-col-100">
                    </div>
                </div>
                <div className="wa-row fixed-btn">
                    <div className="wa-col-100"
                    onClick={()=> {this.goPage('build_robot', 1)}}>
                        <Icon type='cross-circle' size='sm'/>
                    添加品种
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);