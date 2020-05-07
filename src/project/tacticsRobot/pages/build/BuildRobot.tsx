/*
 * Created by chenLiang on 2020/3/10.
 */
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import ProductList from "./components/ProductList";
import './BuildRobot.scss'
import SelectTime from "./components/SelectTime";
import RobotBtn from '../../component/RobotBtn'
import {savePurchaseBondOrder} from "../../assets/ts/api";
import {reducerType} from "../../store";
import {asyncPurchase} from "../../store/actions";
import { connect } from 'react-redux';
import {Toast, Modal} from 'antd-mobile';
import PasswordBox from "../../component/PasswordBox";

const mapStateToProps = (state: reducerType) => ({ purchaseData: state.purchaseReducer.purchaseData });
const mapDispatchToProps = {asyncPurchase};
interface apiProps {
    purchaseData: any;
    asyncPurchase: Function;
}

//RouteComponentProps:路由库自带的api的类型定义
class BuildRobot extends Component<RouteComponentProps & apiProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            purchaseTime: '09:30',
            openPassword: false,
            defaultTime: '09:30',
            params: {},
            errTips: ''
        };
    }

    componentDidMount() {
        this.setState({
            params: this.props.match.params
        });
        if (localStorage.getItem('routeName') === 'set_type') {
            localStorage.removeItem('routeName');
            return false;
        }
        const { asyncPurchase } = this.props;
        asyncPurchase({}).then(()=> {
            const {purchaseData} = this.props;
            const {purchaseTime} = purchaseData;

            this.setState({
                purchaseTime,
                defaultTime: purchaseTime
            });
        })
    }

    // 确认搭建
    private confirmBuild = (password: string) => {
        let params:any = {purchaseTime: this.state.purchaseTime, pwd: password};
        const {purchaseData} = this.props;
        const {recommendSubscribeList, notRecommendSubscribeList, notGradSubscribeList} = purchaseData;
        let list = [...recommendSubscribeList, ...notRecommendSubscribeList, ...notGradSubscribeList];
        params.savePurchaseData = this.dealList(list);
        // if (!params.savePurchaseData.length) Toast.info('请选择品种');
        this.setState({
            errTips: ''
        });
        savePurchaseBondOrder(params).then(()=> {
            this.setState({
                openPassword: false
            });
            Toast.success('创建成功！', 3, ()=> {
                this.props.history.push('/home');
            });
        }).catch((err)=> {
            this.setState({
                errTips: err.result || err.msg || '提交失败'
            })
        })
    };
    controlBox = (isOpen: boolean)=> {
        if (!isOpen) {
            this.setState({errTips: ''})
        }
        this.setState({openPassword: isOpen})
    };
    // 获取选中的品种列表
    private dealList = (list: any)=> {
        let selectedList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].selected) {
                let obj = {
                    purchaseCode: list[i].purchaseCode || undefined,
                    exchange: list[i].exchange || undefined,
                    accessPrice: list[i].accessPrice || undefined,
                    turnBack: list[i].turnBack || undefined,
                    entrustTime: list[i].entrustTime ? list[i].entrustTime : undefined,
                    ruleType: list[i].ruleType || undefined,
                    stockId: list[i].stockId || undefined
                };
                selectedList.push(obj);
            }
        }
        return selectedList;
    };
    changeTime = (val: any)=> {
        console.log(val);
        this.setState({
            purchaseTime: (val[0] < 10 ? ("0"+val[0]) : (val[0] + "")) + ':' + (val[1] < 10 ? ("0"+val[1]) : (val[1] + ""))
        })

    };
    submitTap = ()=> {
        const {purchaseTime, defaultTime} = this.state;
        if (purchaseTime !== defaultTime) {
            Modal.alert((<div>预约申购时间将改为{purchaseTime}<br/>是否确认提交？</div>), '', [
                {
                    text: '取消',
                    onPress: ()=> {}
                },
                {
                    text: '确认提交',
                    onPress: ()=> {
                        this.controlBox(true);
                    }
                }
            ]);
        } else {
            this.controlBox(true);
        }
    }

    public render() {
        const {openPassword, params, errTips, purchaseTime} = this.state;
        const {purchaseData} = this.props;
        const {
            recommendSubscribeList,
            recommendNoSelect,
            notRecommendSubscribeList,
            notGradSubscribeList,
            notGradSubscribeNoSelect,
            notRecommendNoSelect,
        } = purchaseData;
        return (
            <div className="build-robot">
                <SelectTime purchaseTime={purchaseTime} changeTime={this.changeTime}/>
                <div className="wa-row build-robot-title">
                    <div className="wa-col-100">建议申购列表</div>
                </div>
                <ProductList history={this.props.history}
                             list={recommendSubscribeList}
                             isNoSelect={recommendNoSelect}
                             params={params}/>
                <div className="wa-row build-robot-title">
                    <div className="wa-col-100">不建议申购列表</div>
                </div>
                <ProductList history={this.props.history}
                             list={notRecommendSubscribeList}
                             isNoSelect={notRecommendNoSelect}
                             params={params}/>
                <div className="wa-row build-robot-title">
                    <div className="wa-col-100">未评级申购列表</div>
                </div>
                <ProductList history={this.props.history}
                             isNoSelect={notGradSubscribeNoSelect}
                             list={notGradSubscribeList}
                             params={params}/>
                <RobotBtn type="8" btnTap={()=> {this.submitTap()}}/>
                <PasswordBox confirmPass={this.confirmBuild}
                             errTips={errTips}
                             openPassword={openPassword}
                             controlBox={this.controlBox}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildRobot);