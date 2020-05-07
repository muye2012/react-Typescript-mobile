/*
 * Created by chenLiang on 2020/3/16.
 */
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import './SetTypePop.scss'
import { List } from 'antd-mobile';
import { connect } from 'react-redux';
import {reducerType} from "../../store";
import {Toast} from 'antd-mobile'
import SelectPop from "../../component/SelectPop";
import * as util from '../../../../utils/utils'

const mapStateToProps = (state: reducerType) => ({ purchaseData: state.purchaseReducer.purchaseData });
interface apiProps {
    purchaseData: any;
}
let hoursList: object[] = [];
//RouteComponentProps:路由库自带的api的类型定义
class SetTypePop extends Component<RouteComponentProps&apiProps, any> {
    constructor(props: any) {
        super(props);
        this.getTimeList();
        this.state = {
            showPop: false,
            activeIndex: 1,
            sellDate: '',
            // 第几个品种
            index: 0,
            // 哪一类申购列表 0未评级 1建议 2未建议
            grade: 0,
            timeArr: [9, 30],
            // ruleType为1时的股价
            firstPrice: '',
            // ruleType为2时的股价
            secondPrice: '',
            barTitle: '今日' + util.getCurrentYMD('Y年M月D日')
        }
    };
    componentDidMount() {
        let params: any = this.props.match.params;
        this.setState({
            index: Number(params.index),
            grade: Number(params.grade)
        });
        const item: any = this.getItem();
        this.setState({
            timeArr: item.entrustTime ? item.entrustTime.split(':').map((item: any)=>Number(item)):['', ''],
            firstPrice: item.ruleType === 1 ? item.accessPrice : '',
            secondPrice: item.ruleType === 2 ? item.accessPrice : ''
        })
    }

    showDateTap = () => {
        this.setState({showDate: true});
    };
    goBack = () => {
        const item: any = this.getItem();
        if (item.ruleType === 1) item.accessPrice = this.state.firstPrice;
        if (item.ruleType === 2) item.accessPrice = this.state.secondPrice;
        let reg1 = item.ruleType === 1 && item.accessPrice && item.turnBack;
        let reg2 = item.ruleType === 2 && item.accessPrice;
        let reg3 = item.ruleType === 3 && item.entrustTime;
        if (reg1 || reg2 || reg3 || (item.ruleType === 4)) {
            localStorage.setItem('routeName', 'set_type');
            this.props.history.goBack();
        } else {
            Toast.info('请填全相应策略类型');
        }
    };
    getItem = ()=>{
        let params: any = this.props.match.params;
        let {index, grade} = params;
        const {purchaseData} = this.props;
        const {recommendSubscribeList, notRecommendSubscribeList, notGradSubscribeList} = purchaseData;
        index = Number(index);
        grade = Number(grade);
        let item = {};
        if (grade === 1) {
            item = recommendSubscribeList[index] || {};
        } else if(grade === 2) {
            item = notRecommendSubscribeList[index] || {};
        } else if(grade === 0) {
            item = notGradSubscribeList[index] || {};
        }
        return item;
    };
    showTimePop = ()=> {
        this.setState({showPop: true});
    };
    // 获取时间弹框时间列表
    getTimeList() {
        let first = [];
        let second = [];
        for(let i = 0; i < 60; i++) {
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
                first[j].children = [...second].splice(30, 60);
            } else if (j === 5) {
                first[j].children = [...second].slice(0, 59);
            } else {
                first[j].children = [...second];
            }
        }
        hoursList = first;
    }
    setTimeList = ()=> {
        let first = [...hoursList];
        return first;
    }
    format = (labels: React.ReactNode[]): any=> {
        labels = labels.map((item: any)=> {return item.substring(0, item.length - 1)});
        return labels.join(' : ');
    };

    public render() {
        const { showPop, timeArr, firstPrice, secondPrice, barTitle } = this.state;
        const item: any = this.getItem();
        const changeIndex = (index: number)=> {
            item.ruleType = index;
            this.setState({activeIndex: '1'})
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
                    firstPrice: val
                });
            } else if (type === 2) {
                this.setState({
                    secondPrice: val
                });
            }
        };
        const changeInput = (e: any, name: string, type?: number)=> {
            item[name] = e.target.value;
            if (type === 1) {
                this.setState({
                    firstPrice: item[name]
                });
            } else if (type === 2) {
                this.setState({
                    secondPrice: item[name]
                });
            } else {
                this.setState({activeIndex: '1'});
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
            this.setState({activeIndex: '1'});
        };
        const popConfirm = (val: any)=> {
            this.setState({timeArr: val})
            if (val.length > 1) {
                val = val.map((item: any)=> Number(item) < 10 ?  ('0' + item) : item);
            }
            item.entrustTime = val ? (val.join(':') + ':00') : '';
        };
        const popChange = (val: any)=> {
            this.setState({timeArr: val})
            if (val.length > 1) {
                val = val.map((item: any)=> Number(item) < 10 ?  ('0' + item) : item);
            }
            item.entrustTime = val ? (val.join(':') + ':00') : '';
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
                                    <input type="number"
                                           placeholder="价格（元）"
                                           value={firstPrice}
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
                                       value = {timeArr}
                                       format={this.format}
                                       barTitle={barTitle}
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
                        <div className="set-pop-btn" onClick={this.goBack}>
                            确定
                        </div>
                    </div>
                </div>
                {/*<date-picker showDate={showDate}></date-picker>*/}
            </div>
        );
    }
}

export default connect(mapStateToProps)(SetTypePop);