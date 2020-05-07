/*
 * Created by chenLiang on 2020/3/16.
 */
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import './EditType.scss'
import { List } from 'antd-mobile';
import { connect } from 'react-redux';
import {reducerType} from "../../store";
import {Toast} from 'antd-mobile'
import SelectPop from "../../component/SelectPop";
import {editBreed} from "../../assets/ts/api";
import PasswordBox from "../../component/PasswordBox";
import * as util from "../../../../utils/utils";

const mapStateToProps = (state: reducerType) => ({ purchaseData: state.purchaseReducer.purchaseData });
interface apiProps {
    purchaseData: any;
}
let hoursList: object[] = [];
//RouteComponentProps:路由库自带的api的类型定义
class EditType extends Component<RouteComponentProps&apiProps, any> {
    constructor(props: any) {
        super(props);
        this.getTimeList();
        this.state = {
            showPop: false,
            activeIndex: 1,
            // 策略信息对象
            item: {
                accessPrice: '',
                turnBack: ''
            },
            timeArr: [9, 30],
            openPassword: false,
            // ruleType为1时的股价
            firstPrice: '',
            // ruleType为2时的股价
            secondPrice: '',
            errTips: '',
            barTitle: '今日' + util.getCurrentYMD('Y年M月D日')
        }
    };
    componentDidMount() {
        const {item} = this.state;
        let params: any = this.props.match.params;
        this.setState({
            item: JSON.parse(params.item)
        });
        this.setState({
            timeArr: item.entrustTime ? item.entrustTime.split(':').map((item: any)=>Number(item)):['', '']
        })
    }

    showDateTap = () => {
        this.setState({showDate: true});
    };
    goBack = (password: string) => {
        const {item} = this.state;
        let updatePurchaseDetail = {
            strategyId: item.strategyId || undefined,
            warnId: item.warnId || undefined,
            accessPrice: item.accessPrice || undefined,
            turnBack: item.turnBack || undefined,
            entrustTime: item.entrustTime || undefined,
            ruleType: item.ruleType || undefined,
            arbitrageId: item.arbitrageId || undefined
        };
        this.setState({errTips: ''});
        editBreed({pwd: password, updatePurchaseDetail: JSON.stringify(updatePurchaseDetail)}).then(() => {
            Toast.info('改单成功', 3 , ()=> {
                this.props.history.goBack();
            })
        }).catch((err)=> {
            this.setState({
                errTips: err.result || err.msg || '改单失败'
            })
        })
    };
    showTimePop = ()=> {
        this.setState({showPop: true});
    };
    // 获取时间弹框时间列表
    getTimeList() {
        let first = [];
        let second = [];
        for(let i = 0; i < 61; i++) {
            let secondItem = {label: i + '分', value: i};
            let firstItem = {label: i + '时', value: i};
            if(i < 10) {
                secondItem.label = '0' + i + '分';
                firstItem.label = '0' + i + '时';
            }
            if (i > 8 && i < 15) {
                first.push(Object.assign(firstItem, {children: [{}]}));
            }
            second.push(secondItem);
        }
        for (let j = 0; j < first.length; j++) {
            if (j === 0) {
                first[j].children = [...second].splice(0, 31);
            } else if (j === 5) {
                first[j].children = [...second].slice(0, 59);
            } else {
                first[j].children = [...second];
            }
        }
        hoursList = first;
    }
    setTimeList = ()=> {
        return [...hoursList];
    }
    format = (labels: React.ReactNode[]): any=> {
        labels = labels.map((item: any)=> {return item.substring(0, item.length - 1)});
        return labels.join(' : ');
    };

    controlBox = (isOpen: boolean)=> {
        if (!isOpen) {
            this.setState({errTips: ''})
        }
        this.setState({openPassword: isOpen})
    };
    confirmTap = ()=> {
        const {item} = this.state;
        if (item.ruleType === 1) item.accessPrice = this.state.firstPrice;
        if (item.ruleType === 2) item.accessPrice = this.state.secondPrice;
        let reg1 = item.ruleType === 1 && item.accessPrice && item.turnBack;
        let reg2 = item.ruleType === 2 && item.accessPrice;
        let reg3 = item.ruleType === 3 && item.entrustTime;
        if (reg1 || reg2 || reg3 || (item.ruleType === 4)) {
            this.controlBox(true);
        } else {
            Toast.info('请填全选中的相应策略类型');
        }
    };
    public render() {
        const { showPop, timeArr, item, openPassword, firstPrice, secondPrice, errTips, barTitle } = this.state;
        const changeIndex = (index: number)=> {
            item.ruleType = index;
            this.setState({item})
        };
        // 股价输入改变
        const priceBlur = (e: any, name: string, type?: number) => {
            let val = e.target.value;
            var reg = /^(\+)?[0-9]+(.[0-9]*)?$/;
            if (reg.test(val) && Number(val)) {
                if (Number(val) > 100) {
                    val = Number(val).toFixed(item.exchange==='SH'?2:3);
                } else {
                    Toast.info('股价值必须大于100元');
                    val = '100.00';
                }
            } else {
                val = '';
                Toast.info('请输入正确的股价值');
            }
            item[name] = val;
            if (type === 1) {
                this.setState({
                    item,
                    firstPrice: item[name]
                });
            } else if (type === 2) {
                this.setState({
                    item,
                    secondPrice: item[name]
                });
            } else {
                this.setState({item});
            }
        };
        const changeInput = (e: any, name: string, type?: number)=> {
            item[name] = e.target.value;
            if (type === 1) {
                this.setState({
                    item,
                    firstPrice: item[name]
                });
            } else if (type === 2) {
                this.setState({
                    item,
                    secondPrice: item[name]
                });
            } else {
                this.setState({item});
            }
        };
        const loopBlur = (e: any, name: string)=> {
            let val = e.target.value;
            var reg = /^(-|\+)?[0-9]+(.[0-9]*)?$/;
            if (reg.test(val) && Number(val)) {
                val = Number(val).toFixed(2);
                if(val.indexOf('-') < 0) val = '-' + val;
            } else {
                val = '';
                Toast.info('请输入正确的回落百分比')
            }
            item[name] = val;
            this.setState({item});
        };
        const popConfirm = (val: any)=> {
            this.setState({timeArr: val})
            if (val.length > 1) {
                val = val.map((item: any)=> Number(item) < 10 ?  ('0' + item) : item);
            }
            item.entrustTime = val ? val.join(':') : [];
        };
        const popChange = (val: any)=> {
            this.setState({timeArr: val})
            if (val.length > 1) {
                val = val.map((item: any)=> Number(item) < 10 ?  ('0' + item) : item);
            }
            item.entrustTime = val ? val.join(':') : [];
        };
        return (
            <div className="set-sell-type">
                <div className="wa-row wa-wrap set-sell-content">
                    <div className="wa-col-100 wa-center set-title">
                        设置卖出策略类型
                    </div>
                    <div className="wa-row" onClick={() => changeIndex(1)}>
                        <div className={item.ruleType === 1 ? 'wa-col-10 select-icon selected' : 'wa-col-10 select-icon'}>
                        </div>
                        <div className="wa-col">
                            <div className="wa-row type-input">
                                <div className="wa-col-16 text-right">
                                    股价≥
                                </div>
                                <div className="wa-col-45">
                                    <input type="number" value={firstPrice}
                                           placeholder="价格（元）"
                                           onChange={(e)=> changeInput(e, 'accessPrice', 1)}
                                           onBlur={(e)=> priceBlur(e, 'accessPrice', 1)}/>
                                </div>
                                <div className="wa-col">后，</div>
                            </div>
                            <div className="wa-row type-input">
                                <div className="wa-col-14 text-right">
                                    回落
                                </div>
                                <div className="wa-col-45">
                                    <input type="number"
                                           placeholder="百分比（%）"
                                           value={item.turnBack}
                                           onChange={(e)=> changeInput(e, 'turnBack')}
                                           onBlur={(e)=> loopBlur(e, 'turnBack')}
                                           className="percent"/>%
                                </div>
                                <div className="wa-col">卖出</div>
                            </div>
                        </div>
                    </div>
                    <div className="wa-row type-input" onClick={() => changeIndex(2)}>
                        <div className={item.ruleType === 2 ? 'wa-col-10 select-icon selected' : 'wa-col-10 select-icon'}>
                        </div>
                        <div className="wa-col-15 text-right">股价≥</div>
                        <div className="wa-col-40">
                            <input type="number"
                                   placeholder="价格（元）"
                                   value={secondPrice}
                                   onChange={(e)=> changeInput(e, 'accessPrice', 2)}
                                   onBlur={(e)=> priceBlur(e, 'accessPrice', 2)}/>
                        </div>
                        <div className="wa-col">
                            后卖出
                        </div>
                    </div>
                    <div className="wa-row type-input" onClick={() => changeIndex(3)}>
                        <div className={item.ruleType === 3 ? 'wa-col-10 select-icon selected' : 'wa-col-10 select-icon'}>
                        </div>
                        <div className="wa-col-37 text-right">
                            时间达到上市首日
                        </div>
                        <div className="wa-col">
                            {/*<DatePicker*/}
                                {/*value={sellDate}*/}
                                {/*mode="date"*/}
                                {/*onChange={date => this.setState({sellDate: date})}*/}
                            {/*>*/}
                                {/*<List.Item></List.Item>*/}
                            {/*</DatePicker>*/}
                            <SelectPop onConfirm={popConfirm}
                                       onClick={this.showTimePop}
                                       columns={this.setTimeList()}
                                       showPop={showPop}
                                       barTitle={barTitle}
                                       value = {timeArr}
                                       format={this.format}
                                       onChange={popChange}>
                                <List.Item/>
                            </SelectPop>
                        </div>
                        <div className="wa-col-20">
                            卖出
                        </div>
                    </div>
                    <div onClick={() => changeIndex(4)} className="wa-row type-input">
                        <div className={item.ruleType === 4 ? 'wa-col-10 select-icon selected' : 'wa-col-10 select-icon'}>
                        </div>
                        <div className="wa-col-20 text-right">
                            暂不卖出
                        </div>
                    </div>
                </div>
                <div className="wa-row fixed-btn">
                    <div className="wa-col-100">
                        <div className="set-pop-btn" onClick={()=>{this.confirmTap()}}>
                            确定
                        </div>
                    </div>
                </div>
                <PasswordBox confirmPass={this.goBack}
                             openPassword={openPassword}
                             errTips={errTips}
                             controlBox={this.controlBox}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(EditType);